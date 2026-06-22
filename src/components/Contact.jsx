import { useRef, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { MdOutlinePublic } from "react-icons/md";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";

const Contact = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendMessageToFirestore = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);

    const payload = {
      fullName: formData.get("user_name") || "",
      email: formData.get("user_email") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message") || "",
      status: "unread",
      source: "website-contact-form",
      createdAt: serverTimestamp(),
    };

    try {
      setSending(true);

      await addDoc(
        collection(db, "newDawn", "the-new-dawn", "inbox"),
        payload
      );

      toast.success("Message sent successfully");
      e.target.reset();
    } catch (error) {
      console.error("Error sending message to Firestore:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#E9FFF3]">
      <div className="container mx-auto px-4 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Contact & Enquiries
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5">
            Get in Touch
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            For media enquiries, partnership discussions, documentary access,
            archive submissions, or public engagement information, reach out to
            The New Dawn communication team.
          </p>

          <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8 items-stretch">
          <form
            ref={form}
            onSubmit={sendMessageToFirestore}
            className="w-full lg:w-1/2 p-6 md:p-8 border border-[#C9F5DC] bg-white shadow-xl rounded-2xl"
          >
            <h3 className="text-2xl font-extrabold text-[#065F2F] mb-6">
              Send a Message
            </h3>

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="user_email"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              rows="6"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
              required
            ></textarea>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#065F2F] text-white py-3 rounded-lg font-bold hover:bg-[#0B7A3E] transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="w-full lg:w-1/2 bg-[#065F2F] text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-extrabold mb-4">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <FaPhoneAlt className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-white/80">+234 902 471 5023</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-white/80">nigernewdawn@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <GoLocation className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-white/80">Niger State, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start">
                <MdOutlinePublic className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Website</p>
                  <a
                    href="https://www.nigerstate-newdawn.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:text-[#F2B705] transition"
                  >
                    www.nigerstate-newdawn.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <FaWhatsapp className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">WhatsApp</p>
                  <a
                    href="https://wa.me/2349024715023?text=Hello%20The%20New%20Dawn%20team%2C%20I%20would%20like%20to%20make%20an%20enquiry."
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:text-[#F2B705] transition"
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/20">
              <p className="font-bold mb-4">Follow Us</p>

              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#065F2F] transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#065F2F] transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://www.youtube.com/@user-mk4hc2xh3r"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#065F2F] transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;