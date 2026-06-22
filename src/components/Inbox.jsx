import React, { useEffect, useState } from "react";
import { FaEnvelope, FaTrash, FaCheckCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const VIEW_MORE_ROWS = 3;

const Inbox = () => {
  const {
    currentUser,
    inboxMessages = [],
    markInboxMessageAsRead,
    deleteInboxMessage,
  } = useMyContext();

  const [previewItem, setPreviewItem] = useState(null);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [visibleCount, setVisibleCount] = useState(3);

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

  const displayedMessages = inboxMessages.slice(
    0,
    Math.min(visibleCount, inboxMessages.length)
  );

  const hasCardsToToggle = inboxMessages.length > cardsPerRow;
  const hasMoreCards = visibleCount < inboxMessages.length;

  const formatDate = (createdAt) => {
    if (!createdAt) return "Just now";

    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "Just now";

    return date.toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + cardsPerRow * VIEW_MORE_ROWS, inboxMessages.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(cardsPerRow);

    const target = document.getElementById("inbox");

    if (target) {
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markInboxMessageAsRead(id);
      toast.success("Message marked as read.");
    } catch (error) {
      toast.error(error.message || "Failed to update message.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this inbox message?");
    if (!confirmed) return;

    try {
      await deleteInboxMessage(id);
      toast.success("Message deleted.");
      setPreviewItem(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete message.");
    }
  };

  if (!currentUser) return null;

  return (
    <section id="inbox" className="bg-[#E9FFF3] py-20 px-3 sm:px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Admin Inbox
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F]">
            Contact Messages
          </h2>

          <p className="text-slate-600 mt-4">
            Messages submitted through the website contact form.
          </p>

          <p className="text-sm text-slate-500 mt-4">
            Total messages:{" "}
            <span className="font-bold text-[#065F2F]">
              {inboxMessages.length}
            </span>
          </p>

          <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
        </div>

        {inboxMessages.length === 0 ? (
          <div className="bg-white border border-[#C9F5DC] rounded-2xl p-10 text-center shadow-md">
            <FaEnvelope className="text-[#F2B705] text-5xl mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-[#065F2F] mb-2">
              No messages yet
            </h4>
            <p className="text-slate-500">
              Contact form messages will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {displayedMessages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreviewItem(item)}
                  className="bg-white border border-[#C9F5DC] rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition cursor-pointer"
                >
                  <div className="relative h-40 sm:h-48 md:h-64 bg-gradient-to-br from-[#065F2F] to-[#0B7A3E] p-3 sm:p-4 md:p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <FaEnvelope className="text-[#F2B705] text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-4" />

                      <p className="text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#F2B705] mb-2 md:mb-3">
                        Contact Message
                      </p>

                      <h4 className="text-white text-sm sm:text-lg md:text-2xl font-extrabold leading-tight line-clamp-2">
                        {item.subject || "No Subject"}
                      </h4>
                    </div>

                    <p className="text-white/90 text-[11px] sm:text-sm line-clamp-2 md:line-clamp-3">
                      {item.message || "Click to read full message."}
                    </p>

                    <span className="text-[#F2B705] text-[11px] sm:text-sm font-bold">
                      Read →
                    </span>

                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-30 bg-white/15 border border-white/20 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full pointer-events-none">
                      {item.status || "unread"}
                    </div>

                    <div
                      className="absolute top-2 sm:top-4 right-2 sm:right-4 z-40 flex gap-1 sm:gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.status === "unread" && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="bg-white text-[#065F2F] h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B7A3E] hover:text-white transition text-xs sm:text-base"
                          title="Mark as read"
                        >
                          <FaCheckCircle />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="bg-white text-red-600 h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition text-xs sm:text-base"
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                      <p className="text-[9px] sm:text-xs uppercase tracking-widest text-[#F2B705] font-bold line-clamp-1">
                        From: {item.fullName || "Unknown Sender"}
                      </p>

                      <span
                        className={`hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          item.status === "unread"
                            ? "bg-[#F2B705] text-[#065F2F]"
                            : "bg-[#E9FFF3] text-[#065F2F] border border-[#C9F5DC]"
                        }`}
                      >
                        {item.status || "unread"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-lg text-[#065F2F] line-clamp-2">
                      {item.subject || "No Subject"}
                    </h4>

                    <p className="hidden sm:block text-sm text-slate-500 mt-2 line-clamp-2">
                      {item.message}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      className="mt-2 sm:mt-3 text-[11px] sm:text-sm font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                    >
                      Read Message
                    </button>

                    <p className="hidden sm:block text-xs text-slate-400 mt-3">
                      Email: {item.email}
                    </p>

                    <p className="hidden sm:block text-xs text-slate-400 mt-1">
                      Phone: {item.phoneNumber || "N/A"}
                    </p>

                    <p className="hidden sm:block text-xs text-slate-400 mt-1">
                      Received: {formatDate(item.createdAt)}
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
                  Contact Message
                </p>

                <h3 className="text-2xl md:text-4xl font-extrabold text-[#065F2F]">
                  {previewItem.subject || "No Subject"}
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
              <div className="w-full bg-gradient-to-br from-[#065F2F] to-[#0B7A3E] p-6 md:p-10 rounded-2xl">
                <FaEnvelope className="text-[#F2B705] text-5xl mb-4" />

                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
                  Message From
                </p>

                <h4 className="text-white text-3xl md:text-4xl font-extrabold leading-tight">
                  {previewItem.fullName || "Unknown Sender"}
                </h4>

                <a
                  href={`mailto:${previewItem.email}`}
                  className="inline-block mt-4 text-white/90 font-bold hover:text-[#F2B705] transition"
                >
                  {previewItem.email}
                </a>

                {previewItem.phoneNumber && (
                  <a
                    href={`tel:${previewItem.phoneNumber}`}
                    className="block mt-2 text-white/90 font-bold hover:text-[#F2B705] transition"
                  >
                    {previewItem.phoneNumber}
                  </a>
                )}
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-8 whitespace-pre-line mt-6">
                {previewItem.message}
              </p>

              <div className="mt-6 pt-5 border-t border-[#C9F5DC] text-xs text-slate-400 space-y-1">
                <p>Status: {previewItem.status || "unread"}</p>
                <p>Phone: {previewItem.phoneNumber || "N/A"}</p>
                <p>Source: {previewItem.source || "website-contact-form"}</p>
                <p>Received: {formatDate(previewItem.createdAt)}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {previewItem.status === "unread" && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(previewItem.id)}
                    className="bg-[#065F2F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B7A3E] transition shadow-lg inline-flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    Mark as Read
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(previewItem.id)}
                  className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg inline-flex items-center gap-2"
                >
                  <FaTrash />
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Inbox;