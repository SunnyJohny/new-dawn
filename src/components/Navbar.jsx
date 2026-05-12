import { useEffect, useRef, useState } from "react";
import { BsList, BsX } from "react-icons/bs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMyContext } from "../Context/MyContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [pinnedDropdown, setPinnedDropdown] = useState(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState("home");

  const closeTimeout = useRef(null);

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
    setSelectedDocumentaryCategory,
    setSelectedArchiveCategory,
  } = useMyContext();

  const navItems = [
    { link: "Home", path: "home" },
    {
      link: "About",
      path: "about",
      children: [
        { link: "The Initiative", path: "about" },
        { link: "Programme Framework", path: "programme" },
        { link: "Vision & Mission", path: "vision-mission" },
        { link: "Expected Outcome", path: "expected-outcome" },
      ],
    },
    {
      link: "Programme",
      path: "programme",
      children: [
        { link: "Foundational Documentation", path: "documentation" },
        { link: "Documentary & Digital Platforms", path: "media" },
        { link: "Public Engagement", path: "engagement" },
        { link: "Strategic Amplification", path: "amplification" },
        { link: "Archives", path: "archives-framework" },
        { link: "Public Accountability", path: "accountability" },
      ],
    },
    {
      link: "Documentary",
      path: "documentary",
      children: [
        {
          link: "Overview",
          path: "documentary",
          documentaryCategory: "watch-documentary",
        },
        {
          link: "Watch Documentary",
          path: "documentary",
          documentaryCategory: "watch-documentary",
        },
        {
          link: "Trailers & Clips",
          path: "documentary",
          documentaryCategory: "trailers",
        },
        {
          link: "Behind the Scenes",
          path: "documentary",
          documentaryCategory: "behind-scenes",
        },
        {
          link: "Photo Highlights",
          path: "documentary",
          documentaryCategory: "photo-highlights",
        },
        {
          link: "Releases & Broadcast",
          path: "documentary",
          documentaryCategory: "broadcast",
        },
      ],
    },
    {
      link: "Archives",
      path: "archives",
      children: [
        {
          link: "Overview",
          path: "archives",
          archiveCategory: "records",
        },
        {
          link: "Records",
          path: "archives",
          archiveCategory: "records",
        },
        {
          link: "Videos",
          path: "archives",
          archiveCategory: "videos",
        },
        {
          link: "Leadership Hub",
          path: "archives",
          archiveCategory: "leadership-hub",
        },
        {
          link: "Platforms",
          path: "archives",
          archiveCategory: "platforms",
        },
      ],
    },
    {
      link: "News",
      path: "news",
      children: [
        { link: "Latest News", path: "news" },
        { link: "Announcements", path: "announcements" },
        { link: "Broadcast Updates", path: "broadcast" },
      ],
    },
    {
      link: "Contact",
      path: "contact",
      children: [
        { link: "Contact Us", path: "contact" },
        { link: "Enquiries", path: "enquiries" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName =
    currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setActiveMobileDropdown(null);
  };

  const scrollToSection = (path) => {
    const target = document.getElementById(path);

    if (target) {
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const setGlobalCategoryFromNav = (item) => {
    if (item?.documentaryCategory && setSelectedDocumentaryCategory) {
      setSelectedDocumentaryCategory(item.documentaryCategory);
    }

    if (item?.archiveCategory && setSelectedArchiveCategory) {
      setSelectedArchiveCategory(item.archiveCategory);
    }
  };

  const handleScrollAdjust = (e, itemOrPath) => {
    e.preventDefault();

    const item =
      typeof itemOrPath === "string"
        ? { path: itemOrPath }
        : itemOrPath || { path: "home" };

    setActiveNavItem(
      item.documentaryCategory || item.archiveCategory || item.path
    );
    setActiveDropdown(null);
    setPinnedDropdown(null);
    setActiveMobileDropdown(null);

    setGlobalCategoryFromNav(item);

    if (isMenuOpen) {
      setIsMenuOpen(false);

      setTimeout(() => {
        scrollToSection(item.path);
      }, 320);

      return;
    }

    scrollToSection(item.path);
  };

  const isItemActive = (item) => {
    if (
      activeNavItem === item.path ||
      activeNavItem === item.documentaryCategory ||
      activeNavItem === item.archiveCategory
    ) {
      return true;
    }

    if (Array.isArray(item.children)) {
      return item.children.some(
        (child) =>
          child.path === activeNavItem ||
          child.documentaryCategory === activeNavItem ||
          child.archiveCategory === activeNavItem
      );
    }

    return false;
  };

  const openDropdownFor = (name) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }

    setActiveDropdown(name);
  };

  const scheduleCloseDropdown = (name) => {
    if (pinnedDropdown === name) return;

    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    closeTimeout.current = setTimeout(() => {
      setActiveDropdown((prev) => (prev === name ? null : prev));
      closeTimeout.current = null;
    }, 180);
  };

  const toggleDesktopDropdown = (name) => {
    if (pinnedDropdown === name) {
      setPinnedDropdown(null);
      setActiveDropdown(null);
    } else {
      setPinnedDropdown(name);
      setActiveDropdown(name);
    }
  };

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown((prev) => (prev === name ? null : name));
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

  return (
    <>
      <ToastContainer />

      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div
          className={`w-full transition-all duration-300 ${
            isSticky ? "shadow-lg" : "shadow-sm"
          }`}
        >
          <div className="w-full bg-[#065F2F] text-white text-xs md:text-sm shadow-sm">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 py-2 px-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="font-bold tracking-wide uppercase text-[#F2B705]">
                  The New Dawn
                </span>
                <span className="font-semibold">
                  Leadership in Action - A State in Motion
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {currentUser ? (
                  <>
                    <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E] inline-block" />
                      Logged in
                    </span>

                    <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] md:text-xs font-medium max-w-[220px] truncate">
                      {displayName}
                    </span>

                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white text-xs font-semibold tracking-wide px-4 py-1 rounded-sm uppercase hover:bg-red-600 transition"
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] md:text-xs font-medium">
                      Not logged in
                    </span>

                    <button
                      onClick={openSignIn}
                      className="bg-[#F2B705] text-[#065F2F] text-xs font-bold tracking-wide px-4 py-1 rounded-sm uppercase hover:bg-white transition"
                      type="button"
                    >
                      Get Started / Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full bg-white border-b border-[#C9F5DC]">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
              <a
                href="#home"
                onClick={(e) => handleScrollAdjust(e, "home")}
                className="flex items-center gap-3 min-w-0"
              >
                <img
                  src="/images/New-DawnLogo.png"
                  alt="The New Dawn Logo"
                  className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-lg"
                />

                <div className="hidden sm:block leading-tight">
                  <h1 className="text-base md:text-xl font-extrabold uppercase text-[#065F2F] tracking-wide">
                    The New Dawn
                  </h1>
                  <p className="text-xs md:text-sm text-[#0B7A3E] font-bold italic">
                    Leadership in Action - A State in Motion
                  </p>
                </div>
              </a>

              <nav
                className="hidden lg:flex items-center justify-end flex-1 gap-6 text-sm font-bold text-[#065F2F] relative"
                aria-label="Primary"
              >
                {navItems.map((item) => {
                  const hasChildren =
                    Array.isArray(item.children) && item.children.length > 0;

                  const active = isItemActive(item);

                  if (!hasChildren) {
                    return (
                      <a
                        key={item.link}
                        href={`#${item.path}`}
                        onClick={(e) => handleScrollAdjust(e, item)}
                        className={`cursor-pointer uppercase tracking-wide transition ${
                          active
                            ? "text-[#F2B705]"
                            : "text-[#065F2F] hover:text-[#F2B705]"
                        }`}
                      >
                        {item.link}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={item.link}
                      className="relative"
                      onMouseEnter={() => openDropdownFor(item.link)}
                      onMouseLeave={() => scheduleCloseDropdown(item.link)}
                    >
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === item.link}
                        onClick={() => toggleDesktopDropdown(item.link)}
                        className={`flex items-center gap-2 cursor-pointer uppercase tracking-wide transition ${
                          active || activeDropdown === item.link
                            ? "text-[#F2B705]"
                            : "text-[#065F2F] hover:text-[#F2B705]"
                        }`}
                      >
                        <span>{item.link}</span>

                        <svg
                          className={`w-3 h-3 transition-transform ${
                            active || activeDropdown === item.link
                              ? "text-[#F2B705]"
                              : "text-[#0B7A3E]"
                          } ${
                            activeDropdown === item.link ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div
                        role="menu"
                        aria-label={`${item.link} submenu`}
                        className={[
                          "absolute left-0 mt-3 w-72 bg-white border border-[#C9F5DC] shadow-xl rounded-xl overflow-hidden z-50",
                          activeDropdown === item.link ? "block" : "hidden",
                        ].join(" ")}
                        onMouseEnter={() => openDropdownFor(item.link)}
                        onMouseLeave={() => scheduleCloseDropdown(item.link)}
                      >
                        <ul className="flex flex-col">
                          {item.children.map((child) => (
                            <li key={child.link}>
                              <a
                                href={`#${child.path}`}
                                onClick={(e) => handleScrollAdjust(e, child)}
                                className={`block px-5 py-3 text-sm font-semibold cursor-pointer transition ${
                                  activeNavItem === child.path ||
                                  activeNavItem === child.documentaryCategory ||
                                  activeNavItem === child.archiveCategory
                                    ? "bg-[#F2B705] text-[#065F2F]"
                                    : "text-slate-700 hover:bg-[#F2B705] hover:text-[#065F2F]"
                                }`}
                              >
                                {child.link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </nav>

              <button
                className="lg:hidden text-[#065F2F] text-3xl hover:text-[#F2B705] transition"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                type="button"
              >
                {isMenuOpen ? <BsX /> : <BsList />}
              </button>
            </div>

            {isMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-[#C9F5DC]">
                <nav className="flex flex-col py-3 px-4 text-sm font-bold text-[#065F2F]">
                  <div className="mb-3 rounded-lg bg-[#E9FFF3] border border-[#C9F5DC] px-3 py-2">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#065F2F]">
                      The New Dawn
                    </p>
                    <p className="text-xs text-[#0B7A3E] font-bold italic">
                      Leadership in Action - A State in Motion
                    </p>
                  </div>

                  {navItems.map((item) => {
                    const hasChildren =
                      Array.isArray(item.children) && item.children.length > 0;

                    const active = isItemActive(item);

                    if (!hasChildren) {
                      return (
                        <a
                          key={item.link}
                          href={`#${item.path}`}
                          onClick={(e) => handleScrollAdjust(e, item)}
                          className={`py-3 border-b border-[#E9FFF3] uppercase cursor-pointer transition ${
                            active
                              ? "text-[#F2B705]"
                              : "text-[#065F2F] hover:text-[#F2B705]"
                          }`}
                        >
                          {item.link}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.link}
                        className="border-b border-[#E9FFF3]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.link)}
                          className={`w-full text-left py-3 flex items-center justify-between gap-2 uppercase transition ${
                            active || activeMobileDropdown === item.link
                              ? "text-[#F2B705]"
                              : "text-[#065F2F] hover:text-[#F2B705]"
                          }`}
                          aria-expanded={activeMobileDropdown === item.link}
                        >
                          <span>{item.link}</span>

                          <svg
                            className={`w-3 h-3 transition-transform ${
                              active || activeMobileDropdown === item.link
                                ? "text-[#F2B705]"
                                : "text-[#0B7A3E]"
                            } ${
                              activeMobileDropdown === item.link
                                ? "rotate-180"
                                : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {activeMobileDropdown === item.link && (
                          <div className="pl-4 pb-3 bg-[#E9FFF3] rounded-lg mb-2">
                            {item.children.map((child) => (
                              <a
                                key={child.link}
                                href={`#${child.path}`}
                                onClick={(e) => handleScrollAdjust(e, child)}
                                className={`block py-2 text-sm cursor-pointer transition ${
                                  activeNavItem === child.path ||
                                  activeNavItem === child.documentaryCategory ||
                                  activeNavItem === child.archiveCategory
                                    ? "text-[#F2B705] font-bold"
                                    : "text-slate-700 hover:text-[#F2B705]"
                                }`}
                              >
                                {child.link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="mt-3 mb-2">
                    {currentUser ? (
                      <div className="flex items-center gap-2 text-xs text-[#065F2F] bg-[#E9FFF3] border border-[#C9F5DC] rounded-lg px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-[#0B7A3E] inline-block" />
                        <span className="font-semibold">Logged in:</span>
                        <span className="truncate">{displayName}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        Not logged in
                      </div>
                    )}
                  </div>

                  {currentUser && (
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full bg-red-500 text-white py-2 rounded text-xs font-semibold uppercase hover:bg-red-600 transition"
                      type="button"
                    >
                      Logout
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSignInModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeAuthModals}
              className="absolute top-4 right-4 text-red-600 font-bold text-xl"
              type="button"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-[#065F2F] text-center mb-2">
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
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
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
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
                className="w-full bg-[#065F2F] text-white py-3 rounded-lg font-bold hover:bg-[#0B7A3E] transition"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Don&apos;t have an account?{" "}
              <button
                onClick={openSignUp}
                className="text-[#065F2F] font-bold hover:text-[#F2B705] transition"
                type="button"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={closeAuthModals}
              className="absolute top-4 right-4 text-red-600 font-bold text-xl"
              type="button"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-[#065F2F] text-center mb-2">
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
                placeholder="Enter phone number"
              />

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
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
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E]"
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
                className="w-full bg-[#065F2F] text-white py-3 rounded-lg font-bold hover:bg-[#0B7A3E] transition"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <button
                onClick={openSignIn}
                className="text-[#065F2F] font-bold hover:text-[#F2B705] transition"
                type="button"
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