import React from "react";
import { FaEnvelope, FaTrash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMyContext } from "../Context/MyContext";

const Inbox = () => {
  const {
    currentUser,
    inboxMessages = [],
    markInboxMessageAsRead,
    deleteInboxMessage,
  } = useMyContext();

  const formatDate = (createdAt) => {
    if (!createdAt) return "Just now";

    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "Just now";

    return date.toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
    } catch (error) {
      toast.error(error.message || "Failed to delete message.");
    }
  };

  if (!currentUser) return null;

  return (
    <section id="inbox" className="bg-[#E9FFF3] py-20 px-5 md:px-20">
      <div className="max-w-6xl mx-auto">
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
          <div className="space-y-5">
            {inboxMessages.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#C9F5DC] rounded-2xl p-5 shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-extrabold text-[#065F2F]">
                        {item.subject}
                      </h3>

                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          item.status === "unread"
                            ? "bg-[#F2B705] text-[#065F2F]"
                            : "bg-[#E9FFF3] text-[#065F2F] border border-[#C9F5DC]"
                        }`}
                      >
                        {item.status || "unread"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mb-1">
                      From:{" "}
                      <span className="font-bold text-slate-700">
                        {item.fullName}
                      </span>
                    </p>

                    <p className="text-sm text-slate-500 mb-3">
                      Email:{" "}
                      <a
                        href={`mailto:${item.email}`}
                        className="font-bold text-[#065F2F] hover:text-[#0B7A3E]"
                      >
                        {item.email}
                      </a>
                    </p>

                    <p className="text-slate-700 leading-7 whitespace-pre-line">
                      {item.message}
                    </p>

                    <p className="text-xs text-slate-400 mt-4">
                      Received: {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {item.status === "unread" && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(item.id)}
                        className="h-10 w-10 rounded-full bg-[#E9FFF3] text-[#065F2F] flex items-center justify-center hover:bg-[#065F2F] hover:text-white transition"
                        title="Mark as read"
                      >
                        <FaCheckCircle />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                      title="Delete message"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Inbox;