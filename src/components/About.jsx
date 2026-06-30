import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaVideo,
  FaUsers,
  FaBullhorn,
  FaArchive,
  FaChartLine,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaProjectDiagram,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useMyContext } from "../Context/MyContext";

const pillarsData = [
  {
    icon: FaBookOpen,
    title: "Foundational Documentation",
    description:
      "Research, stakeholder engagement, leadership interviews, archival verification, content development, and perception audit.",
  },
  {
    icon: FaVideo,
    title: "Documentary & Digital Platforms",
    description:
      "Cinematic documentary production, digital platform development, and structured rollout of trailers and short-form content.",
  },
  {
    icon: FaUsers,
    title: "Public Engagement",
    description:
      "Curated stakeholder forums across the three senatorial zones, community engagement, and structured distribution across all 25 LGAs.",
  },
  {
    icon: FaBullhorn,
    title: "Strategic Amplification",
    description:
      "Coordinated release and amplification of documentary and supporting media content across digital and broadcast platforms.",
  },
  {
    icon: FaArchive,
    title: "Archives",
    description:
      "A structured repository for records, videos, leadership content, platforms, public reactions, and verified documentation.",
  },
  {
    icon: FaChartLine,
    title: "Public Accountability",
    description:
      "Preserving progress in a disciplined, accessible framework that strengthens clarity, continuity, and public understanding.",
  },
];

const senatorialZones = [
  {
    zone: "Niger East Senatorial Zone",
    alias: "Zone B",
    lgas: [
      "Bosso",
      "Chanchaga",
      "Gurara",
      "Munya",
      "Paikoro",
      "Rafi",
      "Shiroro",
      "Suleja",
      "Tafa",
    ],
  },
  {
    zone: "Niger North Senatorial Zone",
    alias: "Zone C",
    lgas: [
      "Agwara",
      "Borgu",
      "Kontagora",
      "Magama",
      "Mariga",
      "Mashegu",
      "Rijau",
      "Wushishi",
    ],
  },
  {
    zone: "Niger South Senatorial Zone",
    alias: "Zone A",
    lgas: [
      "Agaie",
      "Bida",
      "Edati",
      "Gbako",
      "Katcha",
      "Lapai",
      "Lavun",
      "Mokwa",
    ],
  },
];

const allLgas = senatorialZones.flatMap((zone) => zone.lgas);

const initialProjectForm = {
  projectName: "",
  commissioningDate: "",
  commissionedBy: "",
  lga: "",
  description: "",
  status: "published",
};

const MAX_PROJECT_IMAGES = 4;
const MAX_PROJECT_IMAGE_SIZE = 10 * 1024 * 1024;

const iconAnimations = [
  {
    animate: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 2 },
    },
  },
  {
    animate: {
      scale: [1, 1.12, 1],
      transition: { repeat: Infinity, duration: 2.2 },
    },
  },
  {
    animate: {
      x: [0, -6, 6, 0],
      transition: { repeat: Infinity, duration: 2.5 },
    },
  },
  {
    animate: {
      rotate: [0, 8, -8, 0],
      transition: { repeat: Infinity, duration: 2.4 },
    },
  },
  {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: { repeat: Infinity, duration: 2.1 },
    },
  },
  {
    animate: {
      y: [0, -6, 0],
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 2.6 },
    },
  },
];

const AboutUs = () => {
  const { currentUser } = useMyContext();

  const projectFileInputRef = useRef(null);

  const [openInfoCard, setOpenInfoCard] = useState(null);
  const [selectedLga, setSelectedLga] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [editingProject, setEditingProject] = useState(null);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [projectImageFiles, setProjectImageFiles] = useState([]);
  const [existingProjectImages, setExistingProjectImages] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  useEffect(() => {
    const projectsQuery = query(
      collection(db, "accomplishedProjects"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProjects(list);
        setLoadingProjects(false);
      },
      (error) => {
        console.error("Error fetching accomplished projects:", error);
        toast.error("Failed to load accomplished projects.");
        setLoadingProjects(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      projectImageFiles.forEach((fileObj) => {
        if (fileObj?.previewUrl) {
          URL.revokeObjectURL(fileObj.previewUrl);
        }
      });
    };
  }, [projectImageFiles]);

  const publishedProjects = useMemo(() => {
    if (currentUser) return projects;

    return projects.filter((project) => project.status === "published");
  }, [currentUser, projects]);

  const selectedLgaProjects = useMemo(() => {
    if (!selectedLga) return [];

    return publishedProjects.filter(
      (project) =>
        String(project.lga || "").toLowerCase() === selectedLga.toLowerCase()
    );
  }, [publishedProjects, selectedLga]);

  const toggleInfoCard = (card) => {
    setOpenInfoCard((prev) => (prev === card ? null : card));
  };

  const resetProjectForm = () => {
    projectImageFiles.forEach((fileObj) => {
      if (fileObj?.previewUrl) {
        URL.revokeObjectURL(fileObj.previewUrl);
      }
    });

    setProjectForm(initialProjectForm);
    setEditingProject(null);
    setProjectImageFiles([]);
    setExistingProjectImages([]);
    setUploadProgress(0);

    if (projectFileInputRef.current) {
      projectFileInputRef.current.value = "";
    }
  };

  const closeProjectForm = () => {
    resetProjectForm();
    setShowProjectForm(false);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;

    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const availableSlots =
      MAX_PROJECT_IMAGES - existingProjectImages.length - projectImageFiles.length;

    if (availableSlots <= 0) {
      toast.info(`You can only add up to ${MAX_PROJECT_IMAGES} pictures.`);
      e.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);
    const invalidFile = filesToAdd.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      toast.error("Only image files are allowed for project pictures.");
      e.target.value = "";
      return;
    }

    const oversizedFile = filesToAdd.find(
      (file) => file.size > MAX_PROJECT_IMAGE_SIZE
    );

    if (oversizedFile) {
      toast.error("Each project picture must be below 10MB.");
      e.target.value = "";
      return;
    }

    if (selectedFiles.length > availableSlots) {
      toast.info(
        `Only ${availableSlots} more picture${
          availableSlots === 1 ? "" : "s"
        } allowed. Extra files were ignored.`
      );
    }

    const mappedFiles = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}_${file.size}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    }));

    setProjectImageFiles((prev) => [...prev, ...mappedFiles]);
    e.target.value = "";
  };

  const removeNewProjectImage = (id) => {
    setProjectImageFiles((prev) => {
      const target = prev.find((fileObj) => fileObj.id === id);

      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return prev.filter((fileObj) => fileObj.id !== id);
    });
  };

  const removeExistingProjectImage = (imageUrl) => {
    setExistingProjectImages((prev) => prev.filter((url) => url !== imageUrl));
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
        reject(
          new Error(
            "Upload failed. Check your internet connection or try a smaller file."
          )
        );
      };

      xhr.onabort = () => {
        reject(new Error("Upload was aborted. Please try again."));
      };

      xhr.send(body);
    });
  };

  const uploadProjectImages = async () => {
    if (!projectImageFiles.length) return [];

    const uploadedUrls = [];

    for (let i = 0; i < projectImageFiles.length; i += 1) {
      const fileObj = projectImageFiles[i];

      setUploadProgress(0);

      const url = await uploadToCloudinary(
        fileObj.file,
        "accomplished-projects"
      );

      if (url) uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handleSelectLga = (lga) => {
    setSelectedLga(lga);
    setOpenInfoCard("projects");

    setTimeout(() => {
      const target = document.getElementById("lga-projects");

      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
    setOpenInfoCard("projects");

    projectImageFiles.forEach((fileObj) => {
      if (fileObj?.previewUrl) {
        URL.revokeObjectURL(fileObj.previewUrl);
      }
    });

    setProjectForm({
      projectName: project.projectName || "",
      commissioningDate: project.commissioningDate || "",
      commissionedBy: project.commissionedBy || "",
      lga: project.lga || "",
      description: project.description || "",
      status: project.status || "published",
    });

    setProjectImageFiles([]);
    setExistingProjectImages(
      Array.isArray(project.projectImages) ? project.projectImages : []
    );
    setUploadProgress(0);

    if (projectFileInputRef.current) {
      projectFileInputRef.current.value = "";
    }

    setTimeout(() => {
      const target = document.getElementById("accomplished-project-form");

      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleDeleteProject = async (project) => {
    if (!currentUser) {
      toast.error("Please sign in before deleting a project.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.projectName}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingProjectId(project.id);

      await deleteDoc(doc(db, "accomplishedProjects", project.id));

      toast.success("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete project.");
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in before adding an accomplished project.");
      return;
    }

    if (
      !projectForm.projectName.trim() ||
      !projectForm.commissioningDate ||
      !projectForm.commissionedBy.trim() ||
      !projectForm.lga
    ) {
      toast.error("Please fill all required project fields.");
      return;
    }

    const totalImages = existingProjectImages.length + projectImageFiles.length;

    if (totalImages > MAX_PROJECT_IMAGES) {
      toast.error(`A project can only have up to ${MAX_PROJECT_IMAGES} pictures.`);
      return;
    }

    try {
      setSubmittingProject(true);

      const uploadedImageUrls = await uploadProjectImages();
      const projectImages = [...existingProjectImages, ...uploadedImageUrls].slice(
        0,
        MAX_PROJECT_IMAGES
      );

      const payload = {
        projectName: projectForm.projectName.trim(),
        commissioningDate: projectForm.commissioningDate,
        commissionedBy: projectForm.commissionedBy.trim(),
        lga: projectForm.lga,
        description: projectForm.description.trim(),
        status: projectForm.status || "published",
        projectImages,
        coverImage: projectImages[0] || "",
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
        updatedByName:
          currentUser.displayName || currentUser.name || currentUser.email || "",
      };

      if (editingProject) {
        await updateDoc(
          doc(db, "accomplishedProjects", editingProject.id),
          payload
        );

        toast.success("Accomplished project updated successfully.");
      } else {
        await addDoc(collection(db, "accomplishedProjects"), {
          ...payload,
          createdAt: serverTimestamp(),
          createdBy: currentUser.uid,
          createdByName:
            currentUser.displayName || currentUser.name || currentUser.email || "",
        });

        toast.success("Accomplished project added successfully.");
      }

      setSelectedLga(projectForm.lga);
      setOpenInfoCard("projects");
      resetProjectForm();
      setShowProjectForm(false);
    } catch (error) {
      console.error("Error saving accomplished project:", error);
      toast.error(error.message || "Failed to save accomplished project.");
    } finally {
      setSubmittingProject(false);
      setUploadProgress(0);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not specified";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProjectCountForLga = (lga) => {
    return publishedProjects.filter(
      (project) =>
        String(project.lga || "").toLowerCase() === String(lga || "").toLowerCase()
    ).length;
  };

  const getProjectImages = (project) => {
    if (!project) return [];

    if (Array.isArray(project.projectImages) && project.projectImages.length) {
      return project.projectImages.filter(Boolean).slice(0, MAX_PROJECT_IMAGES);
    }

    if (project.coverImage) return [project.coverImage];

    return [];
  };

  const openImagePreview = (project, imageIndex = 0) => {
    const images = getProjectImages(project);

    if (!images.length) return;

    setImagePreview({
      project,
      images,
    });

    setPreviewImageIndex(imageIndex);
  };

  const closeImagePreview = () => {
    setImagePreview(null);
    setPreviewImageIndex(0);
  };

  const showPreviousPreviewImage = () => {
    if (!imagePreview?.images?.length) return;

    setPreviewImageIndex((prev) =>
      prev === 0 ? imagePreview.images.length - 1 : prev - 1
    );
  };

  const showNextPreviewImage = () => {
    if (!imagePreview?.images?.length) return;

    setPreviewImageIndex((prev) =>
      prev === imagePreview.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      id="about"
      className="min-h-screen bg-[#E9FFF3] text-gray-800 py-16 px-4 md:py-20 md:px-20"
    >
      <div className="mb-12 md:mb-14 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
          About The Initiative
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5 tracking-tight">
          The New Dawn
        </h2>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A strategic multimedia programme for public engagement and
          enlightenment dedicated to the good people of Niger State.
        </p>

        <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
        <div className="relative mb-8 lg:mb-0">
          <div className="rounded-2xl shadow-xl bg-[#065F2F] px-4 py-6 sm:px-6 sm:py-8 md:p-10">
            <img
              src="/images/New-DawnLogo.png"
              alt="The New Dawn"
              className="w-full h-auto max-h-[360px] sm:max-h-[430px] md:max-h-[520px] object-contain"
            />
          </div>

          <div className="absolute -bottom-3 left-4 right-4 sm:left-8 sm:right-8 bg-white/95 shadow-md rounded-lg px-3 py-1.5 border-l-4 border-[#F2B705]">
            <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#065F2F] text-center leading-tight">
              Leadership in Action, A State in Motion.
            </h3>
          </div>
        </div>

        <div className="pt-6 lg:pt-0">
          <h3 className="text-3xl font-extrabold text-[#065F2F] mb-5">
            Capturing Governance in Motion
          </h3>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong className="text-[#065F2F]">The New Dawn</strong> is an
            initiative of{" "}
            <strong className="text-[#F2B705]">
              Shevet-city Communications
            </strong>{" "}
            in conjunction with the Niger State Government. It was created to
            showcase the development agenda and progress of Niger State under the
            leadership of{" "}
            <strong className="text-[#065F2F]">
              His Excellency, Farmer Governor Mohammed Umaru Bago.
            </strong>
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The platform integrates documentation, visual storytelling, digital
            accessibility, and public engagement to ensure that this period is
            recorded not as isolated achievements, but as a coherent trajectory
            of development.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Through human-centred storytelling and structured digital
            dissemination across web, social media, and broadcast platforms, The
            New Dawn strengthens credibility, visibility, and broad-based public
            enlightenment.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => toggleInfoCard("lgas")}
              className="bg-[#065F2F] text-white rounded-xl p-5 text-center hover:bg-[#0B7A3E] hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">25</h4>
              <p className="text-sm text-white/80">LGAs</p>
              <p className="text-xs text-[#F2B705] font-bold mt-2">
                Click to view
              </p>
            </button>

            <button
              type="button"
              onClick={() => toggleInfoCard("zones")}
              className="bg-[#F2B705] text-[#065F2F] rounded-xl p-5 text-center hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">3</h4>
              <p className="text-sm text-[#065F2F]/80">Senatorial Zones</p>
              <p className="text-xs text-[#065F2F] font-bold mt-2">
                Click to view
              </p>
            </button>

            <button
              type="button"
              onClick={() => toggleInfoCard("projects")}
              className="bg-[#0B7A3E] text-white rounded-xl p-5 text-center hover:bg-[#065F2F] hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">
                {publishedProjects.length}
              </h4>
              <p className="text-sm text-white/80">Accomplished Projects</p>
              <p className="text-xs text-[#F2B705] font-bold mt-2">
                Click to view
              </p>
            </button>
          </div>

          {openInfoCard && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 bg-white border border-[#C9F5DC] rounded-2xl shadow-lg p-5"
            >
              {openInfoCard === "lgas" && (
                <div>
                  <h4 className="text-xl font-extrabold text-[#065F2F] mb-3">
                    25 Local Government Areas in Niger State
                  </h4>

                  <p className="text-sm text-slate-500 mb-4">
                    Click any Local Government Area to view accomplished projects
                    commissioned there.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allLgas.map((lga, index) => {
                      const count = getProjectCountForLga(lga);

                      return (
                        <button
                          key={lga}
                          type="button"
                          onClick={() => handleSelectLga(lga)}
                          className={`text-left border rounded-lg px-3 py-2 text-sm font-semibold transition ${
                            selectedLga === lga
                              ? "bg-[#065F2F] border-[#065F2F] text-white"
                              : "bg-[#E9FFF3] border-[#C9F5DC] text-[#065F2F] hover:bg-[#065F2F] hover:text-white"
                          }`}
                        >
                          <span>
                            {index + 1}. {lga}
                          </span>

                          <span className="block text-[11px] mt-1 opacity-80">
                            {count} project{count === 1 ? "" : "s"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {openInfoCard === "zones" && (
                <div>
                  <h4 className="text-xl font-extrabold text-[#065F2F] mb-4">
                    Senatorial Zones and LGAs
                  </h4>

                  <div className="space-y-4">
                    {senatorialZones.map((zone) => (
                      <div
                        key={zone.zone}
                        className="bg-[#E9FFF3] border border-[#C9F5DC] rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h5 className="font-extrabold text-[#065F2F]">
                            {zone.zone}
                          </h5>
                          <span className="text-xs font-bold bg-[#F2B705] text-[#065F2F] px-3 py-1 rounded-full">
                            {zone.alias}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {zone.lgas.map((lga) => {
                            const count = getProjectCountForLga(lga);

                            return (
                              <button
                                key={lga}
                                type="button"
                                onClick={() => handleSelectLga(lga)}
                                className={`border rounded-full px-3 py-1 text-xs font-semibold transition ${
                                  selectedLga === lga
                                    ? "bg-[#065F2F] text-white border-[#065F2F]"
                                    : "bg-white text-slate-700 border-[#C9F5DC] hover:bg-[#065F2F] hover:text-white"
                                }`}
                              >
                                {lga} ({count})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {openInfoCard === "projects" && (
                <div id="lga-projects">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                      <h4 className="text-xl font-extrabold text-[#065F2F]">
                        Accomplished Projects
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        Select an LGA to view projects commissioned in that
                        location.
                      </p>
                    </div>

                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          if (showProjectForm) {
                            closeProjectForm();
                          } else {
                            resetProjectForm();
                            setShowProjectForm(true);
                          }
                        }}
                        className="bg-[#065F2F] text-white px-5 py-3 rounded-full inline-flex items-center justify-center gap-2 font-bold hover:bg-[#0B7A3E] transition shadow-md"
                      >
                        {showProjectForm ? <FaTimes /> : <FaPlus />}
                        {showProjectForm ? "Close Form" : "Add Project"}
                      </button>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Choose Local Government Area
                    </label>

                    <select
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                    >
                      <option value="">Select LGA</option>

                      {allLgas.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga} ({getProjectCountForLga(lga)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentUser && showProjectForm && (
                    <form
                      id="accomplished-project-form"
                      onSubmit={handleSubmitProject}
                      className="mb-6 bg-[#E9FFF3] p-5 rounded-2xl border border-[#C9F5DC]"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                        <h5 className="text-lg font-extrabold text-[#065F2F]">
                          {editingProject
                            ? "Edit Accomplished Project"
                            : "Add Accomplished Project"}
                        </h5>

                        {editingProject && (
                          <button
                            type="button"
                            onClick={closeProjectForm}
                            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Project Name *
                          </label>

                          <input
                            type="text"
                            name="projectName"
                            value={projectForm.projectName}
                            onChange={handleProjectChange}
                            placeholder="Example: Road Construction Project"
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Date Commissioned *
                          </label>

                          <input
                            type="date"
                            name="commissioningDate"
                            value={projectForm.commissioningDate}
                            onChange={handleProjectChange}
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Commissioned By *
                          </label>

                          <input
                            type="text"
                            name="commissionedBy"
                            value={projectForm.commissionedBy}
                            onChange={handleProjectChange}
                            placeholder="Example: His Excellency, Farmer Governor Mohammed Umaru Bago"
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Local Government Area *
                          </label>

                          <select
                            name="lga"
                            value={projectForm.lga}
                            onChange={handleProjectChange}
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                            required
                          >
                            <option value="">Select LGA</option>

                            {allLgas.map((lga) => (
                              <option key={lga} value={lga}>
                                {lga}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Status
                          </label>

                          <select
                            name="status"
                            value={projectForm.status}
                            onChange={handleProjectChange}
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Project Pictures
                          </label>

                          <input
                            ref={projectFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleProjectImagesChange}
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                          />

                          <p className="text-xs text-slate-500 mt-2">
                            Upload up to {MAX_PROJECT_IMAGES} pictures. Each
                            picture must be below 10MB.
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Project Description
                          </label>

                          <textarea
                            name="description"
                            value={projectForm.description}
                            onChange={handleProjectChange}
                            rows="5"
                            placeholder="Briefly describe the project..."
                            className="w-full p-3 border border-[#C9F5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                          ></textarea>
                        </div>
                      </div>

                      {(existingProjectImages.length > 0 ||
                        projectImageFiles.length > 0) && (
                        <div className="mt-5">
                          <p className="text-sm font-bold text-slate-700 mb-3">
                            Selected Project Pictures (
                            {existingProjectImages.length +
                              projectImageFiles.length}
                            /{MAX_PROJECT_IMAGES})
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {existingProjectImages.map((imageUrl, index) => (
                              <div
                                key={imageUrl}
                                className="relative rounded-xl overflow-hidden border border-[#C9F5DC] bg-white"
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Existing project ${index + 1}`}
                                  className="w-full h-28 object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExistingProjectImage(imageUrl)
                                  }
                                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                                  title="Remove picture"
                                >
                                  <FaTimes />
                                </button>

                                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                                  Saved
                                </span>
                              </div>
                            ))}

                            {projectImageFiles.map((fileObj, index) => (
                              <div
                                key={fileObj.id}
                                className="relative rounded-xl overflow-hidden border border-[#C9F5DC] bg-white"
                              >
                                <img
                                  src={fileObj.previewUrl}
                                  alt={`New project ${index + 1}`}
                                  className="w-full h-28 object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeNewProjectImage(fileObj.id)
                                  }
                                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                                  title="Remove picture"
                                >
                                  <FaTimes />
                                </button>

                                <span className="absolute bottom-2 left-2 bg-[#065F2F]/90 text-white text-[10px] px-2 py-1 rounded-full">
                                  New
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {submittingProject && projectImageFiles.length > 0 && (
                        <div className="mt-5">
                          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-[#0B7A3E] h-3 transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>

                          <p className="text-sm text-slate-600 mt-2">
                            Uploading project pictures... {uploadProgress}%
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingProject}
                        className="mt-5 bg-[#065F2F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition disabled:opacity-60 shadow-md"
                      >
                        {submittingProject
                          ? editingProject
                            ? "Updating..."
                            : "Saving..."
                          : editingProject
                          ? "Update Project"
                          : "Save Project"}
                      </button>
                    </form>
                  )}

                  {loadingProjects ? (
                    <div className="bg-white border border-[#C9F5DC] rounded-2xl p-8 text-center">
                      <p className="text-slate-500">Loading projects...</p>
                    </div>
                  ) : !selectedLga ? (
                    <div className="bg-white border border-[#C9F5DC] rounded-2xl p-8 text-center">
                      <FaMapMarkerAlt className="text-[#F2B705] text-4xl mx-auto mb-3" />
                      <h5 className="text-xl font-extrabold text-[#065F2F] mb-2">
                        Select an LGA
                      </h5>
                      <p className="text-slate-500">
                        Click any LGA above or use the dropdown to view
                        accomplished projects for that local government area.
                      </p>
                    </div>
                  ) : selectedLgaProjects.length === 0 ? (
                    <div className="bg-white border border-[#C9F5DC] rounded-2xl p-8 text-center">
                      <FaProjectDiagram className="text-[#F2B705] text-4xl mx-auto mb-3" />
                      <h5 className="text-xl font-extrabold text-[#065F2F] mb-2">
                        No project added for {selectedLga} yet
                      </h5>
                      <p className="text-slate-500">
                        Accomplished projects commissioned in {selectedLga} will
                        appear here once added.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F2B705] mb-1">
                          Viewing Projects In
                        </p>

                        <h5 className="text-2xl font-extrabold text-[#065F2F]">
                          {selectedLga} Local Government Area
                        </h5>

                        <p className="text-sm text-slate-500 mt-1">
                          {selectedLgaProjects.length} accomplished project
                          {selectedLgaProjects.length === 1 ? "" : "s"} found.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedLgaProjects.map((project) => {
                          const images = getProjectImages(project);

                          return (
                            <div
                              key={project.id}
                              className="bg-white border border-[#C9F5DC] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
                            >
                              {images.length > 0 ? (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => openImagePreview(project, 0)}
                                    className="w-full h-56 bg-slate-100 block overflow-hidden"
                                  >
                                    <img
                                      src={images[0]}
                                      alt={project.projectName}
                                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                    />
                                  </button>

                                  {images.length > 1 && (
                                    <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                                      {images.slice(1, 4).map((imageUrl, index) => (
                                        <button
                                          key={imageUrl}
                                          type="button"
                                          onClick={() =>
                                            openImagePreview(project, index + 1)
                                          }
                                          className="h-16 rounded-lg overflow-hidden border-2 border-white shadow bg-white"
                                        >
                                          <img
                                            src={imageUrl}
                                            alt={`${project.projectName} ${
                                              index + 2
                                            }`}
                                            className="w-full h-full object-cover"
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
                                    <FaImage />
                                    {images.length} picture
                                    {images.length === 1 ? "" : "s"}
                                  </span>
                                </div>
                              ) : (
                                <div className="h-44 bg-[#E9FFF3] flex flex-col items-center justify-center text-[#065F2F]">
                                  <FaImage className="text-4xl mb-2 text-[#F2B705]" />
                                  <p className="text-sm font-bold">
                                    No project picture
                                  </p>
                                </div>
                              )}

                              <div className="p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F2B705] mb-2">
                                      {project.lga}
                                    </p>

                                    <h5 className="text-xl font-extrabold text-[#065F2F] leading-tight">
                                      {project.projectName}
                                    </h5>
                                  </div>

                                  {currentUser && (
                                    <div className="flex gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleEditProject(project)}
                                        className="bg-[#E9FFF3] text-[#065F2F] h-9 w-9 rounded-full shadow flex items-center justify-center hover:bg-[#065F2F] hover:text-white transition"
                                        title="Edit project"
                                      >
                                        <FaEdit />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteProject(project)
                                        }
                                        disabled={deletingProjectId === project.id}
                                        className="bg-red-50 text-red-600 h-9 w-9 rounded-full shadow flex items-center justify-center hover:bg-red-600 hover:text-white transition disabled:opacity-60"
                                        title="Delete project"
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2 text-sm text-slate-600">
                                  <p className="flex items-start gap-2">
                                    <FaCalendarAlt className="text-[#065F2F] mt-1 shrink-0" />
                                    <span>
                                      <strong>Date Commissioned:</strong>{" "}
                                      {formatDate(project.commissioningDate)}
                                    </span>
                                  </p>

                                  <p className="flex items-start gap-2">
                                    <FaUserTie className="text-[#065F2F] mt-1 shrink-0" />
                                    <span>
                                      <strong>Commissioned By:</strong>{" "}
                                      {project.commissionedBy}
                                    </span>
                                  </p>

                                  <p className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-[#065F2F] mt-1 shrink-0" />
                                    <span>
                                      <strong>LGA:</strong> {project.lga}
                                    </span>
                                  </p>
                                </div>

                                {project.description && (
                                  <p className="text-slate-600 leading-relaxed mt-4 whitespace-pre-line">
                                    {project.description}
                                  </p>
                                )}

                                {images.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => openImagePreview(project, 0)}
                                    className="mt-4 bg-[#065F2F] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#0B7A3E] transition inline-flex items-center gap-2"
                                  >
                                    <FaImage />
                                    View Pictures
                                  </button>
                                )}

                                {currentUser && (
                                  <div className="mt-4 pt-4 border-t border-[#C9F5DC]">
                                    <span
                                      className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
                                        project.status === "published"
                                          ? "bg-[#E9FFF3] text-[#065F2F] border border-[#C9F5DC]"
                                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                      }`}
                                    >
                                      {project.status || "published"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div id="programme" className="text-center mb-20">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
          Programme Framework
        </p>

        <h2 className="text-3xl md:text-4xl font-extrabold text-[#065F2F] mb-6">
          Human-Centred Storytelling & Public Enlightenment
        </h2>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          The New Dawn is structured around documentation, storytelling,
          engagement, amplification, and archiving — ensuring that governance
          progress is communicated clearly, credibly, and sustainably.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {pillarsData.map((pillar, index) => {
            const IconComponent = pillar.icon;

            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-7 border border-[#C9F5DC] hover:shadow-2xl hover:border-[#F2B705]/70 transition"
              >
                <motion.div
                  className="flex justify-center mb-5"
                  animate={iconAnimations[index % iconAnimations.length].animate}
                >
                  <div className="w-16 h-16 rounded-full bg-[#065F2F] flex items-center justify-center">
                    <IconComponent size={30} className="text-[#F2B705]" />
                  </div>
                </motion.div>

                <h3 className="text-xl font-extrabold text-[#065F2F] mb-3">
                  {pillar.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-12 mb-20 shadow-md border border-[#C9F5DC]">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#065F2F] text-center uppercase tracking-wide mb-10">
          Vision & Mission
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-2xl font-bold text-[#065F2F] mb-4">Vision</h4>
            <p className="text-lg text-gray-700 bg-[#E9FFF3] p-6 border-l-4 border-[#F2B705] rounded-xl shadow-md leading-relaxed">
              To position The New Dawn as a structured leadership platform that
              captures governance in motion, preserves verified progress, and
              communicates Niger State’s development journey through credible,
              accessible, and human-centred storytelling.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-[#065F2F] mb-4">Mission</h4>
            <p className="text-lg text-gray-700 bg-[#E9FFF3] p-6 border-l-4 border-[#065F2F] rounded-xl shadow-md leading-relaxed">
              To document, package, and disseminate the administration’s
              development agenda through research, documentary production,
              public engagement, digital platforms, archives, and strategic
              media amplification.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#065F2F] text-white rounded-3xl p-8 md:p-14 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3 text-center">
          Expected Outcome
        </p>

        <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
          A Coherent Trajectory of Development
        </h3>

        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto text-center">
          By integrating documentation, visual storytelling, digital
          accessibility, stakeholder engagement, and archives, The New Dawn
          ensures that the work undertaken is not only documented but effectively
          communicated to a wider audience — preserving continuity, clarity, and
          efficiency in execution as a way of strengthening public accountability.
        </p>
      </div>

      {imagePreview && (
        <div className="fixed inset-0 z-[1000] bg-black/85 px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-1">
                  Project Pictures
                </p>

                <h3 className="text-white text-xl md:text-3xl font-extrabold">
                  {imagePreview.project?.projectName}
                </h3>

                <p className="text-white/70 text-sm mt-1">
                  {previewImageIndex + 1} of {imagePreview.images.length}
                </p>
              </div>

              <button
                type="button"
                onClick={closeImagePreview}
                className="shrink-0 h-11 w-11 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                title="Close pictures"
              >
                <FaTimes />
              </button>
            </div>

            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={imagePreview.images[previewImageIndex]}
                alt={`${imagePreview.project?.projectName} ${
                  previewImageIndex + 1
                }`}
                className="w-full max-h-[75vh] object-contain bg-black"
              />

              {imagePreview.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousPreviewImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 text-[#065F2F] flex items-center justify-center hover:bg-[#F2B705] transition"
                    title="Previous picture"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={showNextPreviewImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 text-[#065F2F] flex items-center justify-center hover:bg-[#F2B705] transition"
                    title="Next picture"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {imagePreview.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {imagePreview.images.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setPreviewImageIndex(index)}
                    className={`h-20 rounded-xl overflow-hidden border-2 transition ${
                      previewImageIndex === index
                        ? "border-[#F2B705]"
                        : "border-white/20"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${imagePreview.project?.projectName} thumbnail ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {imagePreview.project?.description && (
              <p className="text-white/80 text-sm md:text-base mt-4 leading-7">
                {imagePreview.project.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;
