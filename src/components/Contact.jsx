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
    <section id="contact" className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4 md:px-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c7922b] mb-3">
            Contact & Enquiries
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#064e3b] mb-5">
            Get in Touch
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            For media enquiries, partnership discussions, documentary access,
            archive submissions, or public engagement information, reach out to
            The New Dawn communication team.
          </p>

          <div className="w-24 h-1 bg-[#c7922b] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8 items-stretch">
          {/* Form Section */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full lg:w-1/2 p-6 md:p-8 border border-emerald-900/10 bg-white shadow-xl rounded-2xl"
          >
            <h3 className="text-2xl font-extrabold text-[#064e3b] mb-6">
              Send a Message
            </h3>

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#c7922b] focus:border-[#c7922b]"
              placeholder="Enter your full name"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="user_email"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#c7922b] focus:border-[#c7922b]"
              placeholder="Enter your active email"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Enquiry Type
            </label>
            <select
              name="enquiry_type"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#c7922b] focus:border-[#c7922b] bg-white"
              required
            >
              <option value="">Select enquiry type</option>
              <option value="Media Enquiry">Media Enquiry</option>
              <option value="Partnership">Partnership</option>
              <option value="Documentary Access">Documentary Access</option>
              <option value="Archive Submission">Archive Submission</option>
              <option value="Public Engagement">Public Engagement</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-[#c7922b] focus:border-[#c7922b]"
              placeholder="Message subject"
              required
            />

            <label className="block text-sm font-bold mb-2 text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              rows="6"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#c7922b] focus:border-[#c7922b]"
              placeholder="Write your message here..."
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#064e3b] text-white text-lg font-bold py-3 rounded-lg hover:bg-[#c7922b] transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details Section */}
          <div className="w-full lg:w-1/2 bg-[#064e3b] text-white p-8 md:p-10 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-extrabold mb-4">
              Contact Information
            </h3>

            <p className="mb-8 text-white/80 leading-relaxed">
              The New Dawn is a strategic multimedia programme powered by
              Shevet-city Communications in conjunction with the Niger State
              Government. Connect with us for official communication, media
              collaboration, and public engagement support.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <FaPhoneAlt className="text-[#c7922b] text-2xl mr-4 mt-1" />
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-white/80">+2348038652949</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-[#c7922b] text-2xl mr-4 mt-1" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-white/80">info@shevet-citymedia.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <GoLocation className="text-[#c7922b] text-2xl mr-4 mt-1" />
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-white/80">Niger State, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start">
                <MdOutlinePublic className="text-[#c7922b] text-2xl mr-4 mt-1" />
                <div>
                  <p className="font-bold">Website</p>
                  <a
                    href="https://shevet-citymedia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[#c7922b] transition"
                  >
                    shevet-citymedia.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <FaWhatsapp className="text-[#c7922b] text-2xl mr-4 mt-1" />
                <div>
                  <p className="font-bold">WhatsApp</p>
                  <a
                    href="https://wa.me/2348038652949?text=Hello%20The%20New%20Dawn%20team%2C%20I%20would%20like%20to%20make%20an%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[#c7922b] transition"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-white/20">
              <p className="font-bold mb-4">Follow The New Dawn</p>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c7922b] transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c7922b] transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c7922b] transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Note */}
            <div className="mt-10 bg-white/10 rounded-xl p-5 border-l-4 border-[#c7922b]">
              <h4 className="font-extrabold mb-2">Public Submissions</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Members of the public, media partners, and stakeholders may
                submit records, videos, reactions, and verified materials for
                possible inclusion in the archives and public engagement
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;