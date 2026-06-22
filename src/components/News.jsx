import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const initialFormData = {
  title: "",
  description: "",
  imageUrl: "",
  status: "published",
};

const VIEW_MORE_ROWS = 3;

const News = () => {
  const {
    currentUser,
    news = [],
    publishedNews = [],
    addNews,
    updateNews,
    deleteNews,
  } = useMyContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedItem, setExpandedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [visibleCount, setVisibleCount] = useState(3);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const updateCardsPerRow = () => {
      const count = window.innerWidth >= 1024 ? 3 : 2;

      setCardsPerRow(count);
      setVisibleCount(count);
    };

    updateCardsPerRow();
    window.addEventListener("resize", updateCardsPerRow);

    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  const signedInItems = news.length > 0 ? news : publishedNews;
  const visibleItems = currentUser ? signedInItems : publishedNews;

  const displayedItems = visibleItems.slice(
    0,
    Math.min(visibleCount, visibleItems.length)
  );

  const hasCardsToToggle = visibleItems.length > cardsPerRow;
  const hasMoreCards = visibleCount < visibleItems.length;

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

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadProgress(0);
    setEditingItem(null);
  };

  const closeForm = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + cardsPerRow * VIEW_MORE_ROWS, visibleItems.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(cardsPerRow);

    const target = document.getElementById("news");

    if (target) {
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    const maxImageSize = 10 * 1024 * 1024;

    if (file.size > maxImageSize) {
      toast.error("Image is too large. Please upload an image below 10MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
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

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

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
        reject(new Error("Upload failed. Please check your internet connection."));
      };

      xhr.send(body);
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
    setImageFile(null);
    setUploadProgress(0);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      status: item.status || "published",
    });

    window.scrollTo({
      top: document.getElementById("news")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    if (!currentUser) {
      toast.error("Please sign in before deleting news.");
      return;
    }

    if (!deleteNews) {
      toast.error("deleteNews is not available in your context yet.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      await deleteNews(item.id);
      toast.success("News deleted successfully.");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error(error.message || "Failed to delete news.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in before managing news.");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill the news title and description.");
      return;
    }

    if (!editingItem && !imageFile) {
      toast.error("Please select a news picture.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);

      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, "news");
      }

      const payload = {
        ...formData,
        imageUrl,
        fileName: imageFile?.name || editingItem?.fileName || "",
        fileType: imageFile?.type || editingItem?.fileType || "",
        fileSize: imageFile?.size || editingItem?.fileSize || "",
        storageProvider: "cloudinary",
      };

      if (editingItem) {
        if (!updateNews) {
          toast.error("updateNews is not available in your context yet.");
          return;
        }

        await updateNews(editingItem.id, payload);
        toast.success("News updated successfully.");
      } else {
        if (!addNews) {
          toast.error("addNews is not available in your context yet.");
          return;
        }

        await addNews(payload);
        toast.success("News added successfully.");
      }

      resetForm();
      setShowAddForm(false);
      setVisibleCount(cardsPerRow);
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error(error.message || "Failed to save news.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCardPreview = (item) => {
    setPreviewItem(item);
  };

  return (
    <section id="news" className="bg-white py-20 px-3 sm:px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            News & Updates
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5">
            Latest News
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with official reports, announcements, and development
            stories from The New Dawn.
          </p>

          <p className="text-sm text-slate-500 mt-4">
            Total news uploaded:{" "}
            <span className="font-bold text-[#065F2F]">
              {visibleItems.length}
            </span>
          </p>

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
              {showAddForm ? "Close Form" : "Add News"}
            </button>
          </div>
        )}

        {currentUser && showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-[#E9FFF3] p-6 md:p-10 rounded-3xl shadow-xl border border-[#C9F5DC]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h3 className="text-2xl font-extrabold text-[#065F2F]">
                {editingItem ? "Edit News" : "Add New News"}
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
                  News Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter news title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  required
                />
              </div>

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

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {editingItem ? "Replace News Picture" : "News Picture *"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  required={!editingItem}
                />

                {imageFile && (
                  <p className="text-sm text-slate-500 mt-2">
                    Selected:{" "}
                    <span className="font-semibold text-[#065F2F]">
                      {imageFile.name}
                    </span>
                  </p>
                )}

                {editingItem && !imageFile && (
                  <p className="text-sm text-slate-500 mt-2">
                    Current picture will remain unchanged unless you select a new
                    picture.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  News Content *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  placeholder="Write the news content here..."
                  required
                ></textarea>
              </div>
            </div>

            {submitting && (
              <div className="mt-6">
                <div className="w-full bg-white rounded-full h-3 overflow-hidden">
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
                  : "Uploading..."
                : editingItem
                ? "Update News"
                : "Upload & Save News"}
            </button>
          </form>
        )}

        {visibleItems.length === 0 ? (
          <div className="bg-[#E9FFF3] border border-[#C9F5DC] rounded-2xl p-10 text-center shadow-md">
            <FaImage className="text-[#F2B705] text-5xl mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-[#065F2F] mb-2">
              No news added yet
            </h4>
            <p className="text-slate-500">
              Published news will appear here once uploaded.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openCardPreview(item)}
                  className="bg-white border border-[#C9F5DC] rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-xl"
                    />

                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-30 bg-[#065F2F] text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full pointer-events-none">
                      News
                    </div>

                    {!!currentUser && item?.id && (
                      <div
                        className="absolute top-2 sm:top-4 right-2 sm:right-4 z-40 flex gap-1 sm:gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-white text-[#065F2F] h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B7A3E] hover:text-white transition text-xs sm:text-base"
                          type="button"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="bg-white text-red-600 h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition disabled:opacity-60 text-xs sm:text-base"
                          type="button"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                      <p className="text-[9px] sm:text-xs uppercase tracking-widest text-[#F2B705] font-bold line-clamp-1">
                        News Update
                      </p>

                      {currentUser && (
                        <span
                          className={`hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                            item.status === "published"
                              ? "bg-[#E9FFF3] text-[#065F2F] border border-[#C9F5DC]"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {item.status || "published"}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm sm:text-lg text-[#065F2F] line-clamp-2">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="hidden sm:block text-sm text-slate-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedItem(item);
                      }}
                      className="mt-2 sm:mt-3 text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                    >
                      Read More
                    </button>

                    {item.createdByName && (
                      <p className="hidden sm:block text-xs text-slate-400 mt-3">
                        Added by: {item.createdByName}
                      </p>
                    )}

                    <p className="hidden sm:block text-xs text-slate-400 mt-1">
                      Added on: {formatAddedTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {hasCardsToToggle && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={hasMoreCards ? handleViewMore : handleShowLess}
                  className="bg-[#065F2F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition shadow-lg"
                >
                  {hasMoreCards ? "View More" : "Show Less"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-[999] bg-black/75 px-4 py-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#C9F5DC]">
            <div className="sticky top-0 bg-white border-b border-[#C9F5DC] p-5 flex items-start justify-between gap-4 rounded-t-3xl z-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-2">
                  News Update
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold text-[#065F2F]">
                  {previewItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="shrink-0 h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5 md:p-8">
              {previewItem.imageUrl && (
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="w-full max-h-[65vh] object-cover rounded-2xl"
                />
              )}

              {previewItem.description && (
                <p className="text-slate-700 text-base md:text-lg leading-8 whitespace-pre-line mt-6">
                  {previewItem.description}
                </p>
              )}

              <div className="mt-6 pt-5 border-t border-[#C9F5DC] text-xs text-slate-400 space-y-1">
                {previewItem.createdByName && (
                  <p>Added by: {previewItem.createdByName}</p>
                )}
                <p>Added on: {formatAddedTime(previewItem.createdAt)}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPreviewItem(null);
                  setExpandedItem(previewItem);
                }}
                className="mt-6 bg-[#065F2F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition shadow-lg"
              >
                Read Full News
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedItem && (
        <div className="fixed inset-0 z-[999] bg-black/70 px-4 py-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#C9F5DC]">
            <div className="sticky top-0 bg-white border-b border-[#C9F5DC] p-5 flex items-start justify-between gap-4 rounded-t-3xl">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-2">
                  News Update
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#065F2F]">
                  {expandedItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setExpandedItem(null)}
                className="shrink-0 h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            {expandedItem.imageUrl && (
              <img
                src={expandedItem.imageUrl}
                alt={expandedItem.title}
                className="w-full max-h-[420px] object-cover"
              />
            )}

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

export default News;