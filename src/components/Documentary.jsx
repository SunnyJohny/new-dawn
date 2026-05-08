import React, { useState } from "react";
import { FaPlus, FaPlayCircle, FaImage, FaBroadcastTower } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const categoryTabs = [
  { label: "Watch Documentary", value: "watch-documentary" },
  { label: "Trailers & Clips", value: "trailers" },
  { label: "Behind the Scenes", value: "behind-scenes" },
  { label: "Photo Highlights", value: "photo-highlights" },
  { label: "Releases & Broadcast", value: "broadcast" },
];

const Documentary = () => {
  const { currentUser, documentaries, publishedDocumentaries, addDocumentary } =
    useMyContext();

  const [activeCategory, setActiveCategory] = useState("watch-documentary");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "watch-documentary",
    mediaType: "video",
    mediaUrl: "",
    thumbnailUrl: "",
    source: "Cloudinary",
    status: "published",
  });

  const filteredItems = publishedDocumentaries.filter(
    (item) => (item.category || "watch-documentary") === activeCategory
  );

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file.");
      return;
    }

    const maxVideoSize = 50 * 1024 * 1024;
    const maxImageSize = 10 * 1024 * 1024;

    if (isVideo && file.size > maxVideoSize) {
      toast.error("Video is too large. Please upload a video below 50MB for now.");
      e.target.value = "";
      return;
    }

    if (isImage && file.size > maxImageSize) {
      toast.error("Image is too large. Please upload an image below 10MB.");
      e.target.value = "";
      return;
    }

    setMediaFile(file);

    setFormData((prev) => ({
      ...prev,
      mediaType: isImage ? "photo" : "video",
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "watch-documentary",
      mediaType: "video",
      mediaUrl: "",
      thumbnailUrl: "",
      source: "Cloudinary",
      status: "published",
    });

    setMediaFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in before adding documentary content.");
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!mediaFile) {
      toast.error("Please select a file from your device.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);

      const mediaUrl = await uploadToCloudinary(mediaFile, "documentary");

      const thumbnailUrl =
        thumbnailFile && formData.mediaType !== "photo"
          ? await uploadToCloudinary(thumbnailFile, "thumbnails")
          : "";

      await addDocumentary({
        ...formData,
        mediaUrl,
        thumbnailUrl,
        fileName: mediaFile.name,
        fileType: mediaFile.type,
        fileSize: mediaFile.size,
        storageProvider: "cloudinary",
      });

      toast.success("Documentary content uploaded successfully.");
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error uploading documentary content:", error);
      toast.error(error.message || "Failed to upload content.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryTitle = (category) => {
    return categoryTabs.find((tab) => tab.value === category)?.label || category;
  };

  const renderMedia = (item) => {
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
      <video
        src={item.mediaUrl}
        controls
        poster={item.thumbnailUrl || getCloudinaryVideoThumbnail(item.mediaUrl)}
        className="w-full h-64 object-cover rounded-xl bg-black"
      />
    );
  };

  return (
    <section id="documentary" className="bg-[#f8fafc] py-20 px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c7922b] mb-3">
            Documentary & Digital Platforms
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#064e3b] mb-5">
            Documentary & Media
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore videos, photos, clips, and official releases.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Total uploaded content:{" "}
            <span className="font-bold text-[#064e3b]">
              {documentaries.length}
            </span>
          </p>

          <div className="w-24 h-1 bg-[#c7922b] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* ADD BUTTON */}
        {currentUser ? (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAddForm((prev) => !prev)}
              className="bg-[#064e3b] text-white px-6 py-3 rounded-full inline-flex items-center gap-2 mx-auto font-bold hover:bg-[#c7922b] transition"
            >
              <FaPlus />
              {showAddForm ? "Close Add Form" : "Add Content"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 text-center shadow-md mb-10 max-w-2xl mx-auto">
            <p className="text-gray-600">
              Sign in to upload documentary videos, photos, clips, releases, or
              broadcast content.
            </p>
          </div>
        )}

        {/* FORM */}
        {currentUser && showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-extrabold text-[#064e3b] mb-6">
              Add New Documentary Content
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  required
                >
                  {categoryTabs.map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select File From Device *
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  required
                />

                {mediaFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected:{" "}
                    <span className="font-semibold text-[#064e3b]">
                      {mediaFile.name}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Detected Media Type
                </label>
                <input
                  type="text"
                  value={formData.mediaType === "photo" ? "Photo" : "Video"}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              {formData.mediaType !== "photo" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Optional Video Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  />

                  {thumbnailFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      Thumbnail:{" "}
                      <span className="font-semibold text-[#064e3b]">
                        {thumbnailFile.name}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Source / Broadcast Channel
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  placeholder="Example: NTA, YouTube, Facebook, Press Unit"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  placeholder="Write a short description"
                ></textarea>
              </div>
            </div>

            {submitting && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#064e3b] h-3 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 bg-[#064e3b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c7922b] transition disabled:opacity-60"
            >
              {submitting ? "Uploading..." : "Upload & Save Content"}
            </button>
          </form>
        )}

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-5 py-2 rounded-full font-bold transition ${
                activeCategory === tab.value
                  ? "bg-[#064e3b] text-white"
                  : "bg-gray-200 text-[#064e3b] hover:bg-[#064e3b] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-extrabold text-[#064e3b]">
            {getCategoryTitle(activeCategory)}
          </h3>
        </div>

        {/* CONTENT GRID */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-md">
            <FaPlayCircle className="text-[#c7922b] text-5xl mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-[#064e3b] mb-2">
              No content added yet
            </h4>
            <p className="text-gray-500">
              Published content will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative">
                  {renderMedia(item)}

                  <div className="absolute top-4 left-4 bg-[#064e3b] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.mediaType === "photo" ? (
                      <span className="inline-flex items-center gap-1">
                        <FaImage /> Photo
                      </span>
                    ) : item.category === "broadcast" ? (
                      <span className="inline-flex items-center gap-1">
                        <FaBroadcastTower /> Broadcast
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <FaPlayCircle /> Video
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-[#c7922b] font-bold mb-2">
                    {getCategoryTitle(item.category)}
                  </p>

                  <h4 className="font-bold text-lg text-[#064e3b]">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-sm text-gray-500 mt-2">
                      {item.description}
                    </p>
                  )}

                  {item.createdByName && (
                    <p className="text-xs text-gray-400 mt-3">
                      Added by: {item.createdByName}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    Added on: {formatAddedTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Documentary;