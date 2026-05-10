import { useRef } from "react";
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
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        "template_2hgv8sp",
        form.current,
        "6UfHuLSCvF132R-1l"
      )
      .then(
        () => toast.success("Message sent successfully"),
        (error) => toast.error(error.text)
      );

    e.target.reset();
  };

  return (
    <section id="contact" className="py-20 bg-[#E9FFF3]">
      <div className="container mx-auto px-4 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Contact & Enquiries
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#087A3D] mb-5">
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
          {/* FORM */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full lg:w-1/2 p-6 md:p-8 border border-[#C9F5DC] bg-white shadow-xl rounded-2xl"
          >
            <h3 className="text-2xl font-extrabold text-[#087A3D] mb-6">
              Send a Message
            </h3>

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:ring-2 focus:ring-[#12A85C]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="user_email"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:ring-2 focus:ring-[#12A85C]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-5 focus:ring-2 focus:ring-[#12A85C]"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              rows="6"
              className="w-full p-3 border border-[#C9F5DC] rounded-lg mb-6 focus:ring-2 focus:ring-[#12A85C]"
              required
            ></textarea>

            <button className="w-full bg-[#087A3D] text-white py-3 rounded-lg font-bold hover:bg-[#12A85C] transition">
              Send Message
            </button>
          </form>

          {/* CONTACT INFO */}
          <div className="w-full lg:w-1/2 bg-[#087A3D] text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-extrabold mb-4">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <FaPhoneAlt className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-white/80">+234 906 906 0610</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-[#F2B705] mr-4 mt-1" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-white/80">
                    info@nigerstate-newdawn.com
                  </p>
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
                    className="text-white/80 hover:text-[#F2B705]"
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
                    href="https://wa.me/2349069060610"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:text-[#F2B705]"
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/20">
              <p className="font-bold mb-4">Follow Us</p>

              <div className="flex gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#087A3D] transition">
                  <FaFacebookF />
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#087A3D] transition">
                  <FaInstagram />
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#F2B705] hover:text-[#087A3D] transition">
                  <FaYoutube />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;