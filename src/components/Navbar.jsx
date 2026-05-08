import { useEffect, useState } from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMyContext } from "../Context/MyContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const {
    currentUser,
    signInNewDawnUser,
    signUpNewDawnUser,
    logoutNewDawnUser,
  } = useMyContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".desktop-dropdown-area")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setActiveMobileDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown((prev) => (prev === name ? null : name));
  };

  const toggleDesktopDropdown = (e, name) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const scrollToSection = (path) => {
    const target = document.getElementById(path);

    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const handleScrollAdjust = (e, path) => {
    e.preventDefault();

    setActiveDropdown(null);
    setActiveMobileDropdown(null);

    if (isMenuOpen) {
      setIsMenuOpen(false);

      setTimeout(() => {
        scrollToSection(path);
      }, 320);

      return;
    }

    scrollToSection(path);
  };

  const openSignIn = () => {
    setShowSignInModal(true);
    setShowSignUpModal(false);
    closeMobileMenu();
  };

  const openSignUp = () => {
    setShowSignUpModal(true);
    setShowSignInModal(false);
    closeMobileMenu();
  };

  const closeAuthModals = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false);
    setShowPassword(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInNewDawnUser({
        email: signInEmail,
        password: signInPassword,
      });

      toast.success("Signed in successfully");
      setSignInEmail("");
      setSignInPassword("");
      closeAuthModals();
    } catch (error) {
      toast.error(error.message || "Sign in failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signUpNewDawnUser({
        name: signUpName,
        phone: signUpPhone,
        email: signUpEmail,
        password: signUpPassword,
        role: "viewer",
      });

      toast.success("Account created successfully");
      setSignUpName("");
      setSignUpPhone("");
      setSignUpEmail("");
      setSignUpPassword("");
      closeAuthModals();
    } catch (error) {
      toast.error(error.message || "Sign up failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutNewDawnUser();
      toast.info("Logged out successfully");
      closeMobileMenu();
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const displayName =
    currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

  const navItems = [
    { link: "Home", path: "home" },
    { link: "About", path: "about" },
    {
      link: "Programme",
      path: "programme",
      dropdown: [
        { link: "Foundational Documentation", path: "documentation" },
        { link: "Media & Digital Platforms", path: "media" },
        { link: "Public Engagement", path: "engagement" },
        { link: "Strategic Amplification", path: "amplification" },
      ],
    },
    {
      link: "Documentary",
      path: "documentary",
      dropdown: [
        { link: "Watch Documentary", path: "watch-documentary" },
        { link: "Trailers & Clips", path: "trailers" },
        { link: "Behind the Scenes", path: "behind-scenes" },
        { link: "Photo Highlights", path: "photo-highlights" },
        { link: "Releases & Broadcast", path: "broadcast" },
      ],
    },
    {
      link: "Archives",
      path: "archives",
      dropdown: [
        { link: "Records", path: "records" },
        { link: "Videos", path: "videos" },
        { link: "Leadership Hub", path: "leadership-hub" },
        { link: "Platforms", path: "platforms" },
      ],
    },
    { link: "Contact", path: "contact" },
  ];

  return (
    <>
      <ToastContainer />

      <header className="fixed w-full z-50 transition-all duration-300">
        <nav
          className={`py-4 lg:px-24 px-4 transition-all duration-300 ${
            isSticky
              ? "bg-white shadow-lg"
              : "bg-white/95 backdrop-blur-md shadow-sm"
          }`}
        >
          <div className="flex justify-between items-center text-base relative">
            <a
              href="#home"
              onClick={(e) => handleScrollAdjust(e, "home")}
              className="flex items-center gap-3"
            >
              <img
                src="/images/New-DawnLogo.png"
                alt="The New Dawn Logo"
                className="h-12 w-12 object-contain"
              />

              <div className="leading-tight">
                <h1 className="text-lg md:text-xl font-extrabold uppercase text-[#064e3b]">
                  The New Dawn
                </h1>
                <p className="text-xs md:text-sm text-[#c7922b] font-semibold italic">
                  Leadership in Action, A State in Motion
                </p>
              </div>
            </a>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center space-x-6">
              <ul className="flex space-x-6 items-center">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <li
                      key={item.link}
                      className="relative list-none desktop-dropdown-area"
                    >
                      <button
                        type="button"
                        onClick={(e) => toggleDesktopDropdown(e, item.link)}
                        className={`text-sm uppercase font-semibold transition cursor-pointer ${
                          activeDropdown === item.link
                            ? "text-[#c7922b]"
                            : "text-[#181818] hover:text-[#c7922b]"
                        }`}
                      >
                        {item.link}{" "}
                        <span className="text-[#c7922b]">
                          {activeDropdown === item.link ? "−" : "+"}
                        </span>
                      </button>

                      {activeDropdown === item.link && (
                        <div className="absolute top-full left-0 mt-4 w-72 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50">
                          <a
                            href={`#${item.path}`}
                            onClick={(e) => handleScrollAdjust(e, item.path)}
                            className="block px-5 py-3 text-sm font-bold text-[#064e3b] hover:bg-[#064e3b] hover:text-white transition"
                          >
                            Overview
                          </a>

                          {item.dropdown.map(({ link, path }) => (
                            <a
                              key={link}
                              href={`#${path}`}
                              onClick={(e) => handleScrollAdjust(e, path)}
                              className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-[#064e3b] hover:text-white transition"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ) : (
                    <a
                      key={item.link}
                      href={`#${item.path}`}
                      onClick={(e) => handleScrollAdjust(e, item.path)}
                      className="text-sm uppercase font-semibold text-[#181818] hover:text-[#c7922b] transition cursor-pointer"
                    >
                      {item.link}
                    </a>
                  )
                )}
              </ul>

              <a
                href="#watch-documentary"
                onClick={(e) => handleScrollAdjust(e, "watch-documentary")}
                className="bg-[#064e3b] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#c7922b] transition"
              >
                Watch Documentary
              </a>

              {currentUser ? (
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                  <div className="text-right leading-tight">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-[#064e3b]">
                      {displayName}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openSignIn}
                    className="border border-[#064e3b] text-[#064e3b] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#064e3b] hover:text-white transition"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={openSignUp}
                    className="bg-[#c7922b] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#064e3b] transition"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-[#064e3b] p-2 border border-gray-300 rounded-full"
              >
                {isMenuOpen ? (
                  <FaXmark className="h-6 w-6" />
                ) : (
                  <FaBarsStaggered className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <div
            className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#064e3b] transition-transform duration-300 transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } px-4 overflow-y-auto`}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <a
                href="#home"
                onClick={(e) => handleScrollAdjust(e, "home")}
                className="flex items-center gap-3"
              >
                <img
                  src="/images/New-DawnLogo.png"
                  alt="The New Dawn Logo"
                  className="h-12 w-12 object-contain"
                />

                <div>
                  <h1 className="text-white text-lg font-extrabold uppercase">
                    The New Dawn
                  </h1>
                  <p className="text-[#c7922b] text-xs italic">
                    Leadership in Action
                  </p>
                </div>
              </a>

              <button
                onClick={toggleMenu}
                className="text-white p-2 border border-white/30 rounded-full"
              >
                <FaXmark className="h-6 w-6" />
              </button>
            </div>

            <ul className="flex flex-col items-center justify-center mt-10 space-y-5 pb-12">
              {navItems.map((item) =>
                item.dropdown ? (
                  <li key={item.link} className="w-full text-center list-none">
                    <button
                      type="button"
                      onClick={() => toggleMobileDropdown(item.link)}
                      className="text-base uppercase text-white hover:text-[#c7922b] font-semibold transition cursor-pointer"
                    >
                      {item.link}{" "}
                      <span className="text-[#c7922b]">
                        {activeMobileDropdown === item.link ? "−" : "+"}
                      </span>
                    </button>

                    {activeMobileDropdown === item.link && (
                      <div className="mt-4 space-y-3 bg-white/10 rounded-xl py-4 px-3">
                        <a
                          href={`#${item.path}`}
                          onClick={(e) => handleScrollAdjust(e, item.path)}
                          className="block text-sm text-white font-semibold hover:text-[#c7922b] transition"
                        >
                          Overview
                        </a>

                        {item.dropdown.map(({ link, path }) => (
                          <a
                            key={link}
                            href={`#${path}`}
                            onClick={(e) => handleScrollAdjust(e, path)}
                            className="block text-sm text-white/80 hover:text-[#c7922b] font-medium transition"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.link} className="list-none">
                    <a
                      href={`#${item.path}`}
                      onClick={(e) => handleScrollAdjust(e, item.path)}
                      className="text-base uppercase text-white hover:text-[#c7922b] font-semibold transition cursor-pointer"
                    >
                      {item.link}
                    </a>
                  </li>
                )
              )}

              <li className="list-none">
                <a
                  href="#watch-documentary"
                  onClick={(e) => handleScrollAdjust(e, "watch-documentary")}
                  className="inline-block bg-[#c7922b] text-white px-6 py-3 rounded-full font-semibold mt-4"
                >
                  Watch Documentary
                </a>
              </li>

              {currentUser ? (
                <li className="list-none text-center bg-white/10 rounded-xl p-4 w-full">
                  <p className="text-white/70 text-sm">Signed in as</p>
                  <p className="text-[#c7922b] font-bold mb-3">{displayName}</p>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className="list-none flex flex-col gap-3 w-full px-8">
                  <button
                    onClick={openSignIn}
                    className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#064e3b] transition"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={openSignUp}
                    className="bg-[#c7922b] text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#064e3b] transition"
                  >
                    Sign Up
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* SIGN IN MODAL */}
      {showSignInModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeAuthModals}
              className="absolute top-4 right-4 text-red-600 font-bold text-xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-[#064e3b] text-center mb-2">
              Sign In
            </h2>

            <p className="text-gray-500 text-center mb-6">
              Access The New Dawn platform
            </p>

            <form onSubmit={handleSignIn}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                placeholder="Enter email"
                required
              />

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  placeholder="Enter password"
                  required
                />

                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPassword(false)}
                    className="absolute right-4 top-3.5 text-xl cursor-pointer text-gray-500"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-4 top-3.5 text-xl cursor-pointer text-gray-500"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#064e3b] text-white py-3 rounded-lg font-bold hover:bg-[#c7922b] transition"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Don&apos;t have an account?{" "}
              <button
                onClick={openSignUp}
                className="text-[#064e3b] font-bold hover:text-[#c7922b]"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* SIGN UP MODAL */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={closeAuthModals}
              className="absolute top-4 right-4 text-red-600 font-bold text-xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-[#064e3b] text-center mb-2">
              Sign Up
            </h2>

            <p className="text-gray-500 text-center mb-6">
              Create your New Dawn account
            </p>

            <form onSubmit={handleSignUp}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                placeholder="Enter full name"
                required
              />

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                placeholder="Enter phone number"
              />

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                placeholder="Enter email"
                required
              />

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#c7922b]"
                  placeholder="Create password"
                  required
                />

                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPassword(false)}
                    className="absolute right-4 top-3.5 text-xl cursor-pointer text-gray-500"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-4 top-3.5 text-xl cursor-pointer text-gray-500"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#064e3b] text-white py-3 rounded-lg font-bold hover:bg-[#c7922b] transition"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <button
                onClick={openSignIn}
                className="text-[#064e3b] font-bold hover:text-[#c7922b]"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;