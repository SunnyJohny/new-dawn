import React from "react";
import {
  FaYoutube,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const socialMediaLinks = [
  {
    name: "YouTube",
    icon: <FaYoutube />,
    url: "https://youtube.com/@james-healpam?si=p_VnmAI5V70FI1kH",
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp />,
    url: "https://wa.me/2349069060610",
  },
  { name: "Facebook", icon: <FaFacebook />, url: "#" },
  { name: "LinkedIn", icon: <FaLinkedin />, url: "#" },
  { name: "TikTok", icon: <FaTiktok />, url: "#" },
];

const quickLinks = [
  { link: "Home", path: "home" },
  { link: "About", path: "about" },
  { link: "Programme", path: "programme" },
  { link: "Documentary", path: "documentary" },
  { link: "Archives", path: "archives" },
  { link: "News", path: "news" },
  { link: "Contact", path: "contact" },
];

const programmeLinks = [
  { link: "Foundational Documentation", path: "documentation" },
  { link: "Media & Digital Platforms", path: "media" },
  { link: "Public Engagement", path: "engagement" },
  { link: "Strategic Amplification", path: "amplification" },
];

const archiveLinks = [
  { link: "Records", path: "records" },
  { link: "Videos", path: "videos" },
  { link: "Leadership Hub", path: "leadership-hub" },
  { link: "Platforms", path: "platforms" },
];

const handleScrollAdjust = (e, path) => {
  e.preventDefault();
  const target = document.getElementById(path);

  if (target) {
    const offset = 100;
    const elementPosition = target.offsetTop - offset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

const Footer = () => {
  return (
    <footer className="bg-[#065F2F] text-white pt-14 pb-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/New-DawnLogo.png"
                alt="The New Dawn Logo"
                className="h-14 w-14 object-contain"
              />

              <div>
                <h2 className="text-2xl font-extrabold uppercase">
                  The New Dawn
                </h2>
                <p className="text-[#F2B705] text-sm italic font-semibold">
                  Leadership in Action - A State in Motion
                </p>
              </div>
            </div>

            <p className="text-white/80 leading-relaxed mb-5">
              A strategic multimedia programme for public engagement and
              enlightenment dedicated to the people of Niger State.
            </p>

            <div className="space-y-2 text-white/80">
              <p>Email: info@nigerstate-newdawn.com</p>
              <p>Phone: +234 906 906 0610</p>
              <p>Location: Niger State, Nigeria</p>
              <p>Website: www.nigerstate-newdawn.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-[#F2B705]">
              Quick Links
            </h2>

            <ul className="space-y-2">
              {quickLinks.map(({ link, path }) => (
                <li key={path}>
                  <a
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-white/75 hover:text-[#F2B705] transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-[#F2B705]">
              Programme
            </h2>

            <ul className="space-y-2">
              {programmeLinks.map(({ link, path }) => (
                <li key={path}>
                  <a
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-white/75 hover:text-[#F2B705] transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-[#F2B705]">
              Archives
            </h2>

            <ul className="space-y-2 mb-6">
              {archiveLinks.map(({ link, path }) => (
                <li key={path}>
                  <a
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-white/75 hover:text-[#F2B705] transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mb-4 text-[#F2B705]">
              Follow Us
            </h2>

            <div className="flex space-x-4">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F2B705] hover:text-[#065F2F] transition text-xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#C9F5DC]/40 pt-5 text-center">
          <p className="text-sm text-white/80">
            &copy; {new Date().getFullYear()} The New Dawn. All rights reserved.
          </p>

          <p className="text-xs italic text-white/60 mt-2">
            Powered by Shevet-city Communications.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;