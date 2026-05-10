import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppIcon = ({ messageCount = 1 }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <a
          href="https://wa.me/2349069060610?text=Hello%20The%20New%20Dawn%20team%2C%20I%20would%20like%20to%20make%20an%20enquiry."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#087A3D] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:bg-[#12A85C] transition-transform transform hover:scale-105"
        >
          <FaWhatsapp className="text-2xl" />
        </a>

        {/* Notification Badge */}
        {messageCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F2B705] text-[#087A3D] text-xs font-extrabold h-5 w-5 rounded-full flex items-center justify-center shadow-md">
            {messageCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default WhatsAppIcon;