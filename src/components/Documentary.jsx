import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaPlayCircle,
  FaImage,
  FaBroadcastTower,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFileAlt,
  FaShareAlt,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaTelegramPlane,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const categoryTabs = [
  { label: "Watch Documentary", value: "watch-documentary" },
  { label: "Trailers & Clips", value: "trailers" },
  { label: "Behind the Scenes", value: "behind-scenes" },
  { label: "Photo Highlights", value: "photo-highlights" },
  { label: "Releases & Broadcast", value: "broadcast" },
];

const filterTabs = [{ label: "All", value: "all" }, ...categoryTabs];

const initialFormData = {
  title: "",
  description: "",
  category: "watch-documentary",
  mediaType: "video",
  mediaUrl: "",
  thumbnailUrl: "",
  mediaSource: "upload",
  youtubeUrl: "",
  source: "Cloudinary",
  status: "published",
};

const VIEW_MORE_ROWS = 3;

const Documentary = () => {
  const {
    currentUser,
    documentaries = [],
    publishedDocumentaries = [],
    addDocumentary,
    updateDocumentary,
    deleteDocumentary,
    selectedDocumentaryCategory = "all",
    setSelectedDocumentaryCategory,
  } = useMyContext();

  const activeCategory = selectedDocumentaryCategory || "all";

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [visibleCount, setVisibleCount] = useState(3);

  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (setSelectedDocumentaryCategory) {
      setSelectedDocumentaryCategory("all");
    }
  }, [setSelectedDocumentaryCategory]);

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

  const signedInItems =
    documentaries.length > 0 ? documentaries : publishedDocumentaries;

  const visibleItems = currentUser ? signedInItems : publishedDocumentaries;

  const filteredItems =
    activeCategory === "all"
      ? visibleItems
      : visibleItems.filter(
          (item) => (item.category || "watch-documentary") === activeCategory
        );

  const displayedItems = filteredItems.slice(
    0,
    Math.min(visibleCount, filteredItems.length)
  );

  const hasCardsToToggle = filteredItems.length > cardsPerRow;
  const hasMoreCards = visibleCount < filteredItems.length;

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
    if (category === "all") return "All Media";

    return categoryTabs.find((tab) => tab.value === category)?.label || category;
  };

  const isYoutubeUrl = (url) => {
    if (!url) return false;

    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(
      url.trim()
    );
  };

  const getYoutubeVideoId = (url) => {
    if (!url) return "";

    try {
      const cleanUrl = url.trim();

      if (cleanUrl.includes("youtu.be/")) {
        return cleanUrl.split("youtu.be/")[1]?.split(/[?&/]/)[0] || "";
      }

      const parsedUrl = new URL(cleanUrl);
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) return videoId;

      if (parsedUrl.pathname.includes("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1]?.split(/[?&/]/)[0] || "";
      }

      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1]?.split(/[?&/]/)[0] || "";
      }

      return "";
    } catch {
      return "";
    }
  };

  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url);

    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  };

  const isYoutubeVideo = (item) => {
    return item.mediaType === "video" && item.mediaSource === "youtube";
  };

  const openYoutubeVideo = (item) => {
    const url = item.youtubeUrl || item.mediaUrl;

    if (!url) {
      toast.error("YouTube link is missing.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isTextBroadcast =
    formData.category === "broadcast" && formData.mediaType === "text";

  const isYoutubeFormVideo =
    formData.mediaType === "video" && formData.mediaSource === "youtube";

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
    setVisibleCount(cardsPerRow);

    if (setSelectedDocumentaryCategory) {
      setSelectedDocumentaryCategory(value);
    }
  };

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + cardsPerRow * VIEW_MORE_ROWS, filteredItems.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(cardsPerRow);

    const target = document.getElementById("documentary");

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

    setFormData((prev) => {
      if (name === "category" && value === "broadcast") {
        return {
          ...prev,
          category: value,
          mediaType: prev.mediaType || "text",
        };
      }

      if (name === "category" && prev.mediaType === "text") {
        return {
          ...prev,
          category: value,
          mediaType: "video",
          mediaSource: "upload",
          youtubeUrl: "",
        };
      }

      if (name === "mediaType" && value !== "video") {
        return {
          ...prev,
          mediaType: value,
          mediaSource: "upload",
          youtubeUrl: "",
        };
      }

      if (name === "mediaSource" && value === "youtube") {
        setMediaFile(null);

        return {
          ...prev,
          mediaSource: value,
          mediaType: "video",
          mediaUrl: "",
        };
      }

      if (name === "mediaSource" && value === "upload") {
        return {
          ...prev,
          mediaSource: value,
          youtubeUrl: "",
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
          mediaSource: "upload",
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
      mediaSource: "upload",
      youtubeUrl: "",
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
      category: item.category || "watch-documentary",
      mediaType: item.mediaType || "video",
      mediaUrl: item.mediaUrl || "",
      thumbnailUrl: item.thumbnailUrl || "",
      mediaSource: item.mediaSource || "upload",
      youtubeUrl: item.youtubeUrl || "",
      source: item.source || "Cloudinary",
      status: item.status || "published",
    });

    window.scrollTo({
      top: document.getElementById("documentary")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    if (!currentUser) {
      toast.error("Please sign in before deleting content.");
      return;
    }

    if (!deleteDocumentary) {
      toast.error("deleteDocumentary is not available in your context yet.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      await deleteDocumentary(item.id);
      toast.success("Content deleted successfully.");
    } catch (error) {
      console.error("Error deleting documentary content:", error);
      toast.error(error.message || "Failed to delete content.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in before managing documentary content.");
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (isTextBroadcast && !formData.description.trim()) {
      toast.error("Please write the broadcast text.");
      return;
    }

    if (isYoutubeFormVideo && !formData.youtubeUrl.trim()) {
      toast.error("Please paste the YouTube video link.");
      return;
    }

    if (isYoutubeFormVideo && !isYoutubeUrl(formData.youtubeUrl)) {
      toast.error("Please enter a valid YouTube link.");
      return;
    }

    if (!editingItem && !mediaFile && !isTextBroadcast && !isYoutubeFormVideo) {
      toast.error("Please select a file from your device.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);

      let mediaUrl = formData.mediaUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      if (mediaFile && !isTextBroadcast && !isYoutubeFormVideo) {
        mediaUrl = await uploadToCloudinary(mediaFile, "documentary");
      }

      if (
        thumbnailFile &&
        formData.mediaType !== "photo" &&
        !isTextBroadcast &&
        !isYoutubeFormVideo
      ) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile, "thumbnails");
      }

      if (isYoutubeFormVideo) {
        mediaUrl = formData.youtubeUrl.trim();
        thumbnailUrl = thumbnailUrl || getYoutubeThumbnail(formData.youtubeUrl);
      }

      const payload = {
        ...formData,
        mediaUrl: isTextBroadcast ? "" : mediaUrl,
        thumbnailUrl: isTextBroadcast ? "" : thumbnailUrl,
        youtubeUrl: isYoutubeFormVideo ? formData.youtubeUrl.trim() : "",
        mediaSource: isYoutubeFormVideo ? "youtube" : "upload",
        fileName:
          isTextBroadcast || isYoutubeFormVideo
            ? ""
            : mediaFile?.name || editingItem?.fileName || "",
        fileType: isTextBroadcast
          ? "text/plain"
          : isYoutubeFormVideo
          ? "youtube/link"
          : mediaFile?.type || editingItem?.fileType || "",
        fileSize:
          isTextBroadcast || isYoutubeFormVideo
            ? 0
            : mediaFile?.size || editingItem?.fileSize || "",
        storageProvider: isTextBroadcast
          ? "firestore-text"
          : isYoutubeFormVideo
          ? "youtube"
          : "cloudinary",
      };

      if (editingItem) {
        if (!updateDocumentary) {
          toast.error("updateDocumentary is not available in your context yet.");
          return;
        }

        await updateDocumentary(editingItem.id, payload);
        toast.success("Content updated successfully.");
      } else {
        await addDocumentary(payload);
        toast.success(
          isTextBroadcast
            ? "Broadcast text saved successfully."
            : isYoutubeFormVideo
            ? "YouTube video link saved successfully."
            : "Documentary content uploaded successfully."
        );
      }

      handleVisibleCategoryChange("all");
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving documentary content:", error);
      toast.error(error.message || "Failed to save content.");
    } finally {
      setSubmitting(false);
    }
  };

  const getShareImage = (item) => {
    if (!item) return "";

    if (item.mediaType === "photo") {
      return item.mediaUrl || item.thumbnailUrl || "";
    }

    if (item.mediaType === "video") {
      if (item.thumbnailUrl) return item.thumbnailUrl;

      if (isYoutubeVideo(item)) {
        return getYoutubeThumbnail(item.youtubeUrl || item.mediaUrl);
      }

      return getCloudinaryVideoThumbnail(item.mediaUrl);
    }

    return "";
  };

  const getShareUrl = (item) => {
    if (typeof window === "undefined") return "";

    const url = new URL(window.location.href);

    url.searchParams.delete("documentary");
    url.searchParams.set("documentary", item?.id || "");
    url.hash = "documentary";

    return url.toString();
  };

  const getShareText = (item) => {
    const description = String(item?.description || "")
      .replace(/\s+/g, " ")
      .trim();

    const shortenedDescription =
      description.length > 180
        ? `${description.slice(0, 177).trim()}...`
        : description;

    return [item?.title || "Documentary & Media", shortenedDescription]
      .filter(Boolean)
      .join("\n\n");
  };

  const openShareWindow = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=720,height=650"
    );
  };

  const handlePlatformShare = (platform, item) => {
    const shareUrl = getShareUrl(item);
    const shareText = getShareText(item);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(
      item?.title || "Documentary & Media"
    );

    const links = {
      whatsapp: `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    const destination = links[platform];

    if (!destination) return;

    if (platform === "email") {
      window.location.href = destination;
      return;
    }

    openShareWindow(destination);
  };

  const handleCopyShareLink = async (item) => {
    const shareUrl = getShareUrl(item);

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied successfully.");
      setShareItem(null);
    } catch (error) {
      console.error("Copy link failed:", error);
      toast.error("Unable to copy the link.");
    }
  };

  const fetchShareFile = async (item) => {
    const imageUrl = getShareImage(item);

    if (!imageUrl) return null;

    try {
      const response = await fetch(imageUrl, { mode: "cors" });

      if (!response.ok) return null;

      const blob = await response.blob();
      const extension =
        blob.type.includes("png")
          ? "png"
          : blob.type.includes("webp")
          ? "webp"
          : "jpg";

      return new File(
        [blob],
        `documentary-${item?.id || Date.now()}.${extension}`,
        { type: blob.type || "image/jpeg" }
      );
    } catch (error) {
      console.warn("Unable to prepare media file for sharing:", error);
      return null;
    }
  };

  const handleNativeShare = async (item) => {
    if (!navigator.share) {
      setShareItem(item);
      return;
    }

    const shareUrl = getShareUrl(item);
    const shareText = getShareText(item);
    const shareData = {
      title: item?.title || "Documentary & Media",
      text: shareText,
      url: shareUrl,
    };

    try {
      const file = await fetchShareFile(item);

      if (
        file &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        shareData.files = [file];
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Native share failed:", error);
        setShareItem(item);
      }
    }
  };

  const openShareMenu = (event, item) => {
    event?.stopPropagation();
    setShareItem(item);
  };

  const openCardPreview = (item) => {
    setPreviewItem(item);
  };

  const renderMedia = (item) => {
    if (item.mediaType === "text") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpandedItem(item);
          }}
          className="w-full h-40 sm:h-48 md:h-64 bg-gradient-to-br from-[#065F2F] to-[#0B7A3E] text-left p-3 sm:p-4 md:p-6 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition"
        >
          <div>
            <FaBroadcastTower className="text-[#F2B705] text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-4" />
            <p className="text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#F2B705] mb-2 md:mb-3">
              Broadcast Release
            </p>
            <h4 className="text-white text-sm sm:text-lg md:text-2xl font-extrabold leading-tight line-clamp-2">
              {item.title}
            </h4>
          </div>

          <p className="text-white/90 text-[11px] sm:text-sm line-clamp-2 md:line-clamp-3">
            {item.description || "Click to read full broadcast."}
          </p>

          <span className="text-[#F2B705] text-[11px] sm:text-sm font-bold">
            Read →
          </span>
        </button>
      );
    }

    if (item.mediaType === "photo") {
      return (
        <img
          src={item.mediaUrl}
          alt={item.title}
          className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-xl"
        />
      );
    }

    if (isYoutubeVideo(item)) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openYoutubeVideo(item);
          }}
          className="relative w-full h-40 sm:h-48 md:h-64 rounded-xl overflow-hidden bg-black group"
        >
          <img
            src={
              item.thumbnailUrl ||
              getYoutubeThumbnail(item.youtubeUrl || item.mediaUrl)
            }
            alt={item.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <span className="h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20 rounded-full bg-white/95 text-[#065F2F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
              <FaPlayCircle className="text-3xl sm:text-4xl md:text-5xl" />
            </span>
          </div>

          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-left">
            <p className="text-white text-[10px] sm:text-sm font-bold drop-shadow">
              Tap to watch
            </p>
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setPlayingVideo(item);
        }}
        className="relative w-full h-40 sm:h-48 md:h-64 rounded-xl overflow-hidden bg-black group"
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
          <span className="h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20 rounded-full bg-white/95 text-[#065F2F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
            <FaPlayCircle className="text-3xl sm:text-4xl md:text-5xl" />
          </span>
        </div>

        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-left">
          <p className="text-white text-[10px] sm:text-sm font-bold drop-shadow">
            Tap to play
          </p>
        </div>
      </button>
    );
  };

  const renderPreviewMedia = (item) => {
    if (!item) return null;

    if (item.mediaType === "text") {
      return (
        <div className="w-full bg-gradient-to-br from-[#065F2F] to-[#0B7A3E] p-6 md:p-10 rounded-2xl">
          <FaBroadcastTower className="text-[#F2B705] text-5xl mb-4" />
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Broadcast Release
          </p>
          <h4 className="text-white text-3xl md:text-4xl font-extrabold leading-tight">
            {item.title}
          </h4>
        </div>
      );
    }

    if (item.mediaType === "photo") {
      return (
        <img
          src={item.mediaUrl}
          alt={item.title}
          className="w-full max-h-[65vh] object-cover rounded-2xl"
        />
      );
    }

    if (isYoutubeVideo(item)) {
      return (
        <button
          type="button"
          onClick={() => openYoutubeVideo(item)}
          className="relative w-full max-h-[65vh] rounded-2xl overflow-hidden bg-black group"
        >
          <img
            src={
              item.thumbnailUrl ||
              getYoutubeThumbnail(item.youtubeUrl || item.mediaUrl)
            }
            alt={item.title}
            className="w-full max-h-[65vh] object-cover opacity-85 group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <span className="h-24 w-24 rounded-full bg-white/95 text-[#065F2F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
              <FaPlayCircle className="text-6xl" />
            </span>
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => {
          setPreviewItem(null);
          setPlayingVideo(item);
        }}
        className="relative w-full max-h-[65vh] rounded-2xl overflow-hidden bg-black group"
      >
        <video
          src={item.mediaUrl}
          poster={item.thumbnailUrl || getCloudinaryVideoThumbnail(item.mediaUrl)}
          muted
          playsInline
          preload="metadata"
          className="w-full max-h-[65vh] object-cover opacity-85 group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <span className="h-24 w-24 rounded-full bg-white/95 text-[#065F2F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
            <FaPlayCircle className="text-6xl" />
          </span>
        </div>
      </button>
    );
  };

  return (
    <section
      id="documentary"
      className="bg-[#E9FFF3] py-20 px-3 sm:px-5 md:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Documentary & Digital Platforms
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5">
            Documentary & Media
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore videos, photos, clips, official releases, and broadcast
            write-ups.
          </p>

          <p className="text-sm text-slate-500 mt-4">
            Total uploaded content:{" "}
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
              {showAddForm ? "Close Form" : "Add Content"}
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
                {editingItem
                  ? "Edit Documentary Content"
                  : "Add New Documentary Content"}
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
                  {categoryTabs.map((tab) => (
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
                  {formData.category === "broadcast" && (
                    <option value="text">Broadcast Text</option>
                  )}
                </select>
              </div>

              {formData.mediaType === "video" && !isTextBroadcast && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Video Source
                  </label>
                  <select
                    name="mediaSource"
                    value={formData.mediaSource}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  >
                    <option value="upload">Upload Short Video</option>
                    <option value="youtube">YouTube Link For Long Video</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Use YouTube links for long videos to avoid storing large
                    files.
                  </p>
                </div>
              )}

              {isYoutubeFormVideo && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    YouTube Video Link *
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                    required={isYoutubeFormVideo}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Paste the full YouTube video link here.
                  </p>
                </div>
              )}

              {!isTextBroadcast && !isYoutubeFormVideo && (
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

              {!isTextBroadcast &&
                !isYoutubeFormVideo &&
                formData.mediaType !== "photo" && (
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
                  Source / Broadcast Channel
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  placeholder="Example: NTA, YouTube, Facebook, Press Unit"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {isTextBroadcast
                    ? "Broadcast Text *"
                    : "Description / Caption"}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={isTextBroadcast ? "10" : "5"}
                  className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                  placeholder={
                    isTextBroadcast
                      ? "Paste or type the full broadcast release here..."
                      : "Write a short description"
                  }
                  required={isTextBroadcast}
                ></textarea>
              </div>
            </div>

            {submitting && !isTextBroadcast && !isYoutubeFormVideo && (
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
                  : isTextBroadcast
                  ? "Saving..."
                  : isYoutubeFormVideo
                  ? "Saving Link..."
                  : "Uploading..."
                : editingItem
                ? "Update Content"
                : isTextBroadcast
                ? "Save Broadcast Text"
                : isYoutubeFormVideo
                ? "Save YouTube Link"
                : "Upload & Save Content"}
            </button>
          </form>
        )}

        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-extrabold uppercase tracking-[0.2em] text-[#065F2F] mb-3 text-center">
            Select Media Category
          </label>

          <select
            value={activeCategory}
            onChange={(e) => handleVisibleCategoryChange(e.target.value)}
            className="w-full bg-white border border-[#C9F5DC] text-[#065F2F] font-bold rounded-2xl px-5 py-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] cursor-pointer"
          >
            {filterTabs.map((tab) => (
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
            <FaPlayCircle className="text-[#F2B705] text-5xl mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-[#065F2F] mb-2">
              No content added yet
            </h4>
            <p className="text-slate-500">
              Published content will appear here once uploaded.
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
                    {renderMedia(item)}

                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-30 bg-[#065F2F] text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full pointer-events-none">
                      {item.mediaType === "text" ? (
                        <span className="inline-flex items-center gap-1">
                          <FaFileAlt /> Text
                        </span>
                      ) : item.mediaType === "photo" ? (
                        <span className="inline-flex items-center gap-1">
                          <FaImage /> Photo
                        </span>
                      ) : item.category === "broadcast" ? (
                        <span className="inline-flex items-center gap-1">
                          <FaBroadcastTower /> Broadcast
                        </span>
                      ) : isYoutubeVideo(item) ? (
                        <span className="inline-flex items-center gap-1">
                          <FaPlayCircle /> YouTube
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <FaPlayCircle /> Video
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => openShareMenu(e, item)}
                      className={`absolute top-2 sm:top-4 z-40 bg-white text-[#065F2F] h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B7A3E] hover:text-white transition text-xs sm:text-base ${
                        currentUser && item?.id
                          ? "right-[4.25rem] sm:right-[6.5rem]"
                          : "right-2 sm:right-4"
                      }`}
                      title="Share"
                      aria-label={`Share ${item.title || "documentary content"}`}
                    >
                      <FaShareAlt />
                    </button>

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
                        {getCategoryTitle(item.category)}
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

                    {item.description && item.mediaType !== "text" && (
                      <p className="hidden sm:block text-sm text-slate-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {item.mediaType === "text" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedItem(item);
                        }}
                        className="mt-2 sm:mt-3 text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                      >
                        Read full broadcast
                      </button>
                    )}

                    {item.mediaType === "video" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isYoutubeVideo(item)) {
                            openYoutubeVideo(item);
                          } else {
                            setPlayingVideo(item);
                          }
                        }}
                        className="mt-2 sm:mt-3 inline-flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                      >
                        <FaPlayCircle />
                        {isYoutubeVideo(item) ? "YouTube" : "Play"}
                      </button>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCardPreview(item);
                        }}
                        className="text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                      >
                        {item.mediaType === "text" ? "Read More" : "More"}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => openShareMenu(e, item)}
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                      >
                        <FaShareAlt />
                        Share
                      </button>
                    </div>

                    {item.source && (
                      <p className="hidden sm:block text-xs text-slate-400 mt-3">
                        Source: {item.source}
                      </p>
                    )}

                    {item.createdByName && (
                      <p className="hidden sm:block text-xs text-slate-400 mt-1">
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
                  {getCategoryTitle(previewItem.category)}
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold text-[#065F2F]">
                  {previewItem.title}
                </h3>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => openShareMenu(e, previewItem)}
                  className="h-10 w-10 rounded-full bg-[#E9FFF3] text-[#065F2F] flex items-center justify-center hover:bg-[#065F2F] hover:text-white transition"
                  title="Share"
                  aria-label="Share documentary content"
                >
                  <FaShareAlt />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {renderPreviewMedia(previewItem)}

              {previewItem.description && (
                <p className="text-slate-700 text-base md:text-lg leading-8 whitespace-pre-line mt-6">
                  {previewItem.description}
                </p>
              )}

              <div className="mt-6 pt-5 border-t border-[#C9F5DC] text-xs text-slate-400 space-y-1">
                {previewItem.source && <p>Source: {previewItem.source}</p>}
                {previewItem.createdByName && (
                  <p>Added by: {previewItem.createdByName}</p>
                )}
                <p>Added on: {formatAddedTime(previewItem.createdAt)}</p>
              </div>

              {previewItem.mediaType === "text" && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem(null);
                    setExpandedItem(previewItem);
                  }}
                  className="mt-6 bg-[#065F2F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition shadow-lg"
                >
                  Read Full Broadcast
                </button>
              )}

              {previewItem.mediaType === "video" && (
                <button
                  type="button"
                  onClick={() => {
                    if (isYoutubeVideo(previewItem)) {
                      openYoutubeVideo(previewItem);
                    } else {
                      setPreviewItem(null);
                      setPlayingVideo(previewItem);
                    }
                  }}
                  className="mt-6 bg-[#065F2F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition shadow-lg inline-flex items-center gap-2"
                >
                  <FaPlayCircle />
                  {isYoutubeVideo(previewItem)
                    ? "Watch on YouTube"
                    : "Play Video"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => openShareMenu(e, playingVideo)}
                  className="h-11 w-11 rounded-full bg-white text-[#065F2F] flex items-center justify-center hover:bg-[#065F2F] hover:text-white transition"
                  title="Share video"
                  aria-label="Share video"
                >
                  <FaShareAlt />
                </button>

                <button
                  type="button"
                  onClick={() => setPlayingVideo(null)}
                  className="h-11 w-11 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                  title="Close video"
                >
                  <FaTimes />
                </button>
              </div>
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


      {shareItem && (
        <div
          className="fixed inset-0 z-[1100] bg-black/70 px-4 py-8 flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShareItem(null);
          }}
        >
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#C9F5DC] overflow-hidden">
            <div className="p-5 border-b border-[#C9F5DC] flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#F2B705]">
                  Share
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-[#065F2F] line-clamp-2">
                  {shareItem.title || "Documentary & Media"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShareItem(null)}
                className="shrink-0 h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                aria-label="Close share menu"
              >
                <FaTimes />
              </button>
            </div>

            {getShareImage(shareItem) && (
              <img
                src={getShareImage(shareItem)}
                alt={shareItem.title || "Documentary preview"}
                className="w-full h-44 object-cover"
              />
            )}

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handlePlatformShare("whatsapp", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-green-50 transition"
                >
                  <FaWhatsapp className="text-2xl text-green-600" />
                  <span className="text-xs font-bold text-slate-700">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformShare("facebook", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-blue-50 transition"
                >
                  <FaFacebookF className="text-2xl text-blue-700" />
                  <span className="text-xs font-bold text-slate-700">Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformShare("twitter", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                >
                  <FaTwitter className="text-2xl text-sky-500" />
                  <span className="text-xs font-bold text-slate-700">X</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformShare("linkedin", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-blue-50 transition"
                >
                  <FaLinkedinIn className="text-2xl text-blue-700" />
                  <span className="text-xs font-bold text-slate-700">LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformShare("telegram", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-sky-50 transition"
                >
                  <FaTelegramPlane className="text-2xl text-sky-500" />
                  <span className="text-xs font-bold text-slate-700">Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformShare("email", shareItem)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 p-3 hover:bg-amber-50 transition"
                >
                  <FaEnvelope className="text-2xl text-amber-600" />
                  <span className="text-xs font-bold text-slate-700">Email</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(shareItem)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#065F2F] px-4 py-3 text-sm font-bold text-[#065F2F] hover:bg-[#E9FFF3] transition"
                >
                  <FaLink />
                  Copy Link
                </button>

                <button
                  type="button"
                  onClick={() => handleNativeShare(shareItem)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#065F2F] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B7A3E] transition"
                >
                  <FaShareAlt />
                  More
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500 text-center">
                The More option can include the picture on supported mobile devices.
              </p>
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
                  Broadcast Release
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

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => openShareMenu(e, expandedItem)}
                  className="h-10 w-10 rounded-full bg-[#E9FFF3] text-[#065F2F] flex items-center justify-center hover:bg-[#065F2F] hover:text-white transition"
                  title="Share"
                  aria-label="Share broadcast"
                >
                  <FaShareAlt />
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedItem(null)}
                  className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                >
                  <FaTimes />
                </button>
              </div>
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

export default Documentary;