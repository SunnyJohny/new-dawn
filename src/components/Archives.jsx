import React, { useState } from "react";
import {
  FaPlus,
  FaPlayCircle,
  FaImage,
  FaArchive,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const archiveTabs = [
  { label: "Records", value: "records" },
  { label: "Videos", value: "videos" },
  { label: "Leadership Hub", value: "leadership-hub" },
  { label: "Platforms", value: "platforms" },
];

const initialFormData = {
  title: "",
  description: "",
  category: "records",
  mediaType: "video",
  mediaUrl: "",
  thumbnailUrl: "",
  source: "Cloudinary",
  status: "published",
};

const Archives = () => {
  const {
    currentUser,
    archives = [],
    publishedArchives = [],
    addArchive,
    updateArchive,
    deleteArchive,
    selectedArchiveCategory = "records",
    setSelectedArchiveCategory,
  } = useMyContext();

  const activeCategory = selectedArchiveCategory || "records";

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const signedInItems = archives.length > 0 ? archives : publishedArchives;
  const visibleItems = currentUser ? signedInItems : publishedArchives;

  const filteredItems = visibleItems.filter(
    (item) => (item.category || "records") === activeCategory
  );

  const isTextArchive = formData.mediaType === "text";

  const formatAddedTime = (createdAt) => {
    if (!createdAt) return "Just now";

    let date;

    if (createdAt?.toDate) {
      date = createdAt.toDate();
    } else if (createdAt instanceof Date) {
      date = createdAt;
    } else {
      date = new Date(createdAt);
    }

    if (Number.isNaN(date.getTime())) return "Just now";

    return date.toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getCategoryTitle = (category) => {
    return archiveTabs.find((tab) => tab.value === category)?.label || category;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setMediaFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
    setEditingItem(null);
  };

  const closeForm = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleVisibleCategoryChange = (value) => {
    if (setSelectedArchiveCategory) {
      setSelectedArchiveCategory(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "mediaType" && value === "text") {
        return {
          ...prev,
          mediaType: value,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file.");
      e.target.value = "";
      return;
    }

    const maxVideoSize = 50 * 1024 * 1024;
    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoDuration = 3 * 60;

    if (isImage && file.size > maxImageSize) {
      toast.error("Image is too large. Please upload an image below 10MB.");
      e.target.value = "";
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error("Video is too large. Please upload a video below 50MB.");
      e.target.value = "";
      return;
    }

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);

        if (video.duration > maxVideoDuration) {
          toast.error("Video must not exceed 3 minutes.");
          e.target.value = "";
          setMediaFile(null);
          return;
        }

        setMediaFile(file);

        setFormData((prev) => ({
          ...prev,
          mediaType: "video",
        }));
      };

      video.onerror = () => {
        toast.error("Unable to read video duration. Please select another video.");
        e.target.value = "";
        setMediaFile(null);
      };

      video.src = URL.createObjectURL(file);
      return;
    }

    setMediaFile(file);

    setFormData((prev) => ({
      ...prev,
      mediaType: "photo",
    }));
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Thumbnail must be an image file.");
      e.target.value = "";
      return;
    }

    const maxImageSize = 10 * 1024 * 1024;

    if (file.size > maxImageSize) {
      toast.error("Thumbnail is too large. Please upload an image below 10MB.");
      e.target.value = "";
      return;
    }

    setThumbnailFile(file);
  };

  const uploadToCloudinary = (file, folderName) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        reject(new Error("Cloudinary cloud name or upload preset is missing."));
        return;
      }

      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", folderName);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", uploadUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve(data.secure_url);
          } else {
            reject(new Error(data?.error?.message || "Cloudinary upload failed."));
          }
        } catch {
          reject(new Error("Invalid Cloudinary response."));
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            "Upload failed. Check your internet connection or try a smaller file."
          )
        );
      };

      xhr.onabort = () => {
        reject(
          new Error(
            "Upload was aborted. Try a smaller video or a stronger network."
          )
        );
      };

      xhr.send(body);
    });
  };

  const getCloudinaryVideoThumbnail = (videoUrl) => {
    if (!videoUrl || !videoUrl.includes("/upload/")) return "";

    return videoUrl
      .replace("/upload/", "/upload/so_2,f_jpg/")
      .replace(/\.(mp4|mov|webm|mkv|avi)$/i, ".jpg");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
    setMediaFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "records",
      mediaType: item.mediaType || "video",
      mediaUrl: item.mediaUrl || "",
      thumbnailUrl: item.thumbnailUrl || "",
      source: item.source || "Cloudinary",
      status: item.status || "published",
    });

    window.scrollTo({
      top: document.getElementById("archives")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    if (!currentUser) {
      toast.error("Please sign in before deleting archive content.");
      return;
    }

    if (!deleteArchive) {
      toast.error("deleteArchive is not available in your context yet.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      await deleteArchive(item.id);
      toast.success("Archive content deleted successfully.");
    } catch (error) {
      console.error("Error deleting archive content:", error);
      toast.error(error.message || "Failed to delete archive content.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in before managing archive content.");
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (isTextArchive && !formData.description.trim()) {
      toast.error("Please write the archive text.");
      return;
    }

    if (!editingItem && !mediaFile && !isTextArchive) {
      toast.error("Please select a file from your device.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);

      let mediaUrl = formData.mediaUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      if (mediaFile && !isTextArchive) {
        mediaUrl = await uploadToCloudinary(mediaFile, "archives");
      }

      if (thumbnailFile && formData.mediaType !== "photo" && !isTextArchive) {
        thumbnailUrl = await uploadToCloudinary(
          thumbnailFile,
          "archive-thumbnails"
        );
      }

      const payload = {
        ...formData,
        mediaUrl: isTextArchive ? "" : mediaUrl,
        thumbnailUrl: isTextArchive ? "" : thumbnailUrl,
        fileName: isTextArchive
          ? ""
          : mediaFile?.name || editingItem?.fileName || "",
        fileType: isTextArchive
          ? "text/plain"
          : mediaFile?.type || editingItem?.fileType || "",
        fileSize: isTextArchive
          ? 0
          : mediaFile?.size || editingItem?.fileSize || "",
        storageProvider: isTextArchive ? "firestore-text" : "cloudinary",
      };

      if (editingItem) {
        if (!updateArchive) {
          toast.error("updateArchive is not available in your context yet.");
          return;
        }

        await updateArchive(editingItem.id, payload);
        toast.success("Archive content updated successfully.");
      } else {
        if (!addArchive) {
          toast.error("addArchive is not available in your context yet.");
          return;
        }

        await addArchive(payload);
        toast.success(
          isTextArchive
            ? "Archive text saved successfully."
            : "Archive content uploaded successfully."
        );
      }

      handleVisibleCategoryChange(formData.category);
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving archive content:", error);
      toast.error(error.message || "Failed to save archive content.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderMedia = (item) => {
    if (item.mediaType === "text") {
      return (
        <button
          type="button"
          onClick={() => setExpandedItem(item)}
          className="w-full h-64 bg-gradient-to-br from-[#065F2F] to-[#0B7A3E] text-left p-6 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition"
        >
          <div>
            <FaArchive className="text-[#F2B705] text-4xl mb-4" />
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#F2B705] mb-3">
              Archive Record
            </p>
            <h4 className="text-white text-2xl font-extrabold leading-tight">
              {item.title}
            </h4>
          </div>

          <p className="text-white/90 text-sm line-clamp-3">
            {item.description || "Click to read full archive."}
          </p>

          <span className="text-[#F2B705] text-sm font-bold">
            Click to read full archive →
          </span>
        </button>
      );
    }

    if (item.mediaType === "photo") {
      return (
        <img
          src={item.mediaUrl}
          alt={item.title}
          className="w-full h-64 object-cover rounded-xl"
        />
      );
    }

    return (
      <button
        type="button"
        onClick={() => setPlayingVideo(item)}
        className="relative w-full h-64 rounded-xl overflow-hidden bg-black group"
      >
        <video
          src={item.mediaUrl}
          poster={item.thumbnailUrl || getCloudinaryVideoThumbnail(item.mediaUrl)}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <span className="h-20 w-20 rounded-full bg-white/95 text-[#065F2F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
            <FaPlayCircle className="text-5xl" />
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-left">
          <p className="text-white text-sm font-bold drop-shadow">
            Tap to play video
          </p>
        </div>
      </button>
    );
  };

  return (
    <section id="archives" className="bg-[#E9FFF3] py-20 px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Archive & Institutional Records
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5">
            Archives
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore records, videos, photos, leadership materials, platforms,
            and archive write-ups.
          </p>

          <p className="text-sm text-slate-500 mt-4">
            Total uploaded archive content:{" "}
            <span className="font-bold text-[#065F2F]">
              {visibleItems.length}
            </span>
          </p>

          {currentUser && (
            <p className="text-xs text-[#065F2F] font-semibold mt-2">
              Signed-in CRUD mode active. Admin restriction can be added later.
            </p>
          )}

          <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
        </div>

        {currentUser && (
          <div className="text-center mb-6">
            <button
              onClick={() => {
                if (showAddForm) {
                  closeForm();
                } else {
                  resetForm();
                  setShowAddForm(true);
                }
              }}
              className="bg-[#065F2F] text-white px-6 py-3 rounded-full inline-flex items-center gap-2 mx-auto font-bold hover:bg-[#0B7A3E] transition shadow-lg"
              type="button"
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
              {showAddForm ? "Close Form" : "Add Archive Content"}
            </button>
          </div>
        )}

        {currentUser && showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-[#C9F5DC]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h3 className="text-2xl font-extrabold text-[#065F2F]">
                {editingItem ? "Edit Archive Content" : "Add New Archive Content"}
              </h3>

              {editingItem && (
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
                >
                  <FaTimes />
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  required
                >
                  {archiveTabs.map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Media Type
                </label>
                <select
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                >
                  <option value="video">Video</option>
                  <option value="photo">Photo</option>
                  <option value="text">Archive Text</option>
                </select>
              </div>

              {!isTextArchive && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {editingItem
                      ? "Replace File From Device"
                      : "Select File From Device *"}
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaFileChange}
                    className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                    required={!editingItem}
                  />

                  <p className="text-xs text-slate-500 mt-2">
                    Videos must not exceed 3 minutes.
                  </p>

                  {mediaFile && (
                    <p className="text-sm text-slate-500 mt-2">
                      Selected:{" "}
                      <span className="font-semibold text-[#065F2F]">
                        {mediaFile.name}
                      </span>
                    </p>
                  )}

                  {editingItem && !mediaFile && (
                    <p className="text-sm text-slate-500 mt-2">
                      Current file will remain unchanged unless you select a new
                      file.
                    </p>
                  )}
                </div>
              )}

              {!isTextArchive && formData.mediaType !== "photo" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Optional Video Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  />

                  {thumbnailFile && (
                    <p className="text-sm text-slate-500 mt-2">
                      Thumbnail:{" "}
                      <span className="font-semibold text-[#065F2F]">
                        {thumbnailFile.name}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Source / Archive Channel
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  placeholder="Example: Official Records, Media Unit, YouTube, Press Unit"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {isTextArchive ? "Archive Text *" : "Description / Caption"}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={isTextArchive ? "10" : "5"}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  placeholder={
                    isTextArchive
                      ? "Paste or type the full archive text here..."
                      : "Write a short description"
                  }
                  required={isTextArchive}
                ></textarea>
              </div>
            </div>

            {submitting && !isTextArchive && (
              <div className="mt-6">
                <div className="w-full bg-[#E9FFF3] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#0B7A3E] h-3 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 bg-[#065F2F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition disabled:opacity-60 shadow-lg"
            >
              {submitting
                ? editingItem
                  ? "Updating..."
                  : isTextArchive
                  ? "Saving..."
                  : "Uploading..."
                : editingItem
                ? "Update Archive Content"
                : isTextArchive
                ? "Save Archive Text"
                : "Upload & Save Content"}
            </button>
          </form>
        )}

        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-extrabold uppercase tracking-[0.2em] text-[#065F2F] mb-3 text-center">
            Select Archive Category
          </label>

          <select
            value={activeCategory}
            onChange={(e) => handleVisibleCategoryChange(e.target.value)}
            className="w-full bg-white border border-[#C9F5DC] text-[#065F2F] font-bold rounded-2xl px-5 py-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] cursor-pointer"
          >
            {archiveTabs.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-2">
            Viewing
          </p>
          <h3 className="text-3xl font-extrabold text-[#065F2F]">
            {getCategoryTitle(activeCategory)}
          </h3>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-[#C9F5DC] rounded-2xl p-10 text-center shadow-md">
            <FaArchive className="text-[#F2B705] text-5xl mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-[#065F2F] mb-2">
              No archive content added yet
            </h4>
            <p className="text-slate-500">
              Published archive content will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#C9F5DC] rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative overflow-hidden rounded-xl">
                  {renderMedia(item)}

                  <div className="absolute top-4 left-4 z-30 bg-[#065F2F] text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
                    {item.mediaType === "text" ? (
                      <span className="inline-flex items-center gap-1">
                        <FaFileAlt /> Text
                      </span>
                    ) : item.mediaType === "photo" ? (
                      <span className="inline-flex items-center gap-1">
                        <FaImage /> Photo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <FaPlayCircle /> Video
                      </span>
                    )}
                  </div>

                  {!!currentUser && item?.id && (
                    <div className="absolute top-4 right-4 z-40 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-white text-[#065F2F] h-9 w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B7A3E] hover:text-white transition"
                        type="button"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="bg-white text-red-600 h-9 w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition disabled:opacity-60"
                        type="button"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs uppercase tracking-widest text-[#F2B705] font-bold">
                      {getCategoryTitle(item.category)}
                    </p>

                    {currentUser && (
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          item.status === "published"
                            ? "bg-[#E9FFF3] text-[#065F2F] border border-[#C9F5DC]"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {item.status || "published"}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-lg text-[#065F2F]">
                    {item.title}
                  </h4>

                  {item.description && item.mediaType !== "text" && (
                    <p className="text-sm text-slate-500 mt-2">
                      {item.description}
                    </p>
                  )}

                  {item.mediaType === "text" && (
                    <button
                      type="button"
                      onClick={() => setExpandedItem(item)}
                      className="mt-3 text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                    >
                      Read full archive
                    </button>
                  )}

                  {item.mediaType === "video" && (
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(item)}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                    >
                      <FaPlayCircle />
                      Play video
                    </button>
                  )}

                  {item.source && (
                    <p className="text-xs text-slate-400 mt-3">
                      Source: {item.source}
                    </p>
                  )}

                  {item.createdByName && (
                    <p className="text-xs text-slate-400 mt-1">
                      Added by: {item.createdByName}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 mt-1">
                    Added on: {formatAddedTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {playingVideo && (
        <div className="fixed inset-0 z-[1000] bg-black/85 px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-1">
                  Now Playing
                </p>
                <h3 className="text-white text-xl md:text-3xl font-extrabold">
                  {playingVideo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPlayingVideo(null)}
                className="shrink-0 h-11 w-11 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                title="Close video"
              >
                <FaTimes />
              </button>
            </div>

            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <video
                src={playingVideo.mediaUrl}
                poster={
                  playingVideo.thumbnailUrl ||
                  getCloudinaryVideoThumbnail(playingVideo.mediaUrl)
                }
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full max-h-[75vh] bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {playingVideo.description && (
              <p className="text-white/80 text-sm md:text-base mt-4 leading-7">
                {playingVideo.description}
              </p>
            )}
          </div>
        </div>
      )}

      {expandedItem && (
        <div className="fixed inset-0 z-[999] bg-black/70 px-4 py-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#C9F5DC]">
            <div className="sticky top-0 bg-white border-b border-[#C9F5DC] p-5 flex items-start justify-between gap-4 rounded-t-3xl">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-2">
                  Archive Record
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#065F2F]">
                  {expandedItem.title}
                </h3>
                {expandedItem.source && (
                  <p className="text-sm text-slate-500 mt-2">
                    Source: {expandedItem.source}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setExpandedItem(null)}
                className="shrink-0 h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5 md:p-8">
              <p className="text-slate-700 text-base md:text-lg leading-8 whitespace-pre-line">
                {expandedItem.description}
              </p>

              <div className="mt-8 pt-5 border-t border-[#C9F5DC] text-xs text-slate-400">
                Added on: {formatAddedTime(expandedItem.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Archives;