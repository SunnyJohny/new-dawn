import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useMyContext } from "../Context/MyContext";

const Hero = () => {
  const { documentaries = [] } = useMyContext();

  const photoHighlights = documentaries.filter(
    (item) =>
      item.category === "photo-highlights" &&
      item.mediaType === "photo" &&
      item.mediaUrl
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const title = "THE NEW DAWN";
  const subtitle = "Leadership in Action, A State in Motion";

  const progressHighlights = [
    "Documenting governance in motion",
    "Public engagement and enlightenment",
    "Leadership in Action, A State in Motion",
    "Capturing Niger State’s development trajectory",
    "Stories of progress, transparency, and continuity",
    "A strategic multimedia programme for the people",
  ];

  const tickerText = `${progressHighlights.join("   ✦   ")}   ✦   ${progressHighlights.join(
    "   ✦   "
  )}`;

  useEffect(() => {
    if (photoHighlights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === photoHighlights.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [photoHighlights.length]);

  const renderAnimatedLetters = (text, baseDelay = 0) =>
    text.split("").map((letter, index) => (
      <span
        key={`${letter}-${index}`}
        className="intro-letter inline-block"
        style={{
          animationDelay: `${baseDelay + index * 0.07}s`,
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </span>
    ));

  return (
    <section
      id="home"
      className="relative w-full min-h-screen pt-[170px] md:pt-[155px] lg:pt-[145px] flex items-center justify-center text-center overflow-hidden"
    >
      <style>{`
        @keyframes introLogo {
          0% { opacity: 0; transform: scale(0.85); }
          20% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); visibility: hidden; }
        }

        @keyframes letterDropBounce {
          0% {
            opacity: 0;
            transform: translateY(-95px) scale(0.95);
          }
          55% {
            opacity: 1;
            transform: translateY(12px) scale(1.05);
          }
          72% {
            transform: translateY(-8px) scale(0.98);
          }
          88% {
            transform: translateY(4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes introWriteupDisappear {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(30px);
            visibility: hidden;
          }
        }

        @keyframes newDawnTicker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes ribbonReveal {
          0% { opacity: 0; transform: translateY(18px); }
          70% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .intro-logo {
          animation: introLogo 6s ease-in-out forwards;
        }

        .intro-writeup {
          animation: introWriteupDisappear 9.5s ease-in-out forwards;
        }

        .intro-letter {
          opacity: 0;
          animation: letterDropBounce 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .new-dawn-progress-ribbon {
          animation: ribbonReveal 7s ease-out forwards;
        }

        .new-dawn-ticker-track {
          animation: newDawnTicker 48s linear infinite;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {photoHighlights.length > 0 ? (
          photoHighlights.map((item, index) => (
            <img
              key={item.id}
              src={item.mediaUrl}
              alt={item.title || "The New Dawn Photo Highlight"}
              className={`absolute inset-0 w-full h-full object-cover object-[center_top] sm:object-center transition-all duration-[4000ms] ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }`}
            />
          ))
        ) : (
          <img
            src="/images/hero-bg.jpg"
            alt="The New Dawn Background"
            className="absolute inset-0 w-full h-full object-cover object-[center_top] sm:object-center"
          />
        )}

        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55"></div>
      </div>

      {/* LOGO INTRO */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <img
          src="/images/New-DawnLogo.png"
          alt="Intro Logo"
          className="intro-logo w-32 md:w-48 lg:w-56 object-contain"
        />
      </div>

      {/* 🔥 BOUNCING WRITE-UP ONLY */}
      <div className="intro-writeup absolute inset-0 z-20 flex items-end justify-center px-6 pb-44 md:pb-52 pointer-events-none">
        <div className="max-w-4xl">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-wide drop-shadow-lg">
            {renderAnimatedLetters(title, 1.2)}
          </h1>

          <p className="text-[#F2B705] text-base md:text-xl font-semibold italic mb-7 drop-shadow-lg">
            {renderAnimatedLetters(subtitle, 2.3)}
          </p>

          <div className="flex justify-center">
            <Link
              to="about"
              smooth={true}
              duration={500}
              offset={-120}
              className="border border-[#F2B705] text-[#F2B705] px-8 py-3 rounded-full font-bold cursor-pointer hover:bg-[#F2B705] hover:text-[#065F2F] transition shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* PROGRESS RIBBON */}
      <div className="new-dawn-progress-ribbon absolute left-0 right-0 bottom-0 z-30 px-4 pb-5 md:pb-7">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-[#F2B705]/40 bg-white/90 backdrop-blur-md shadow-2xl">
          <div className="flex items-center">
            <div className="shrink-0 bg-[#065F2F] px-4 md:px-6 py-4 text-left">
              <p className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.28em] text-[#F2B705]">
                Progress
              </p>
              <p className="text-xs md:text-sm font-bold text-white">
                Highlights
              </p>
            </div>

            <div className="relative flex-1 overflow-hidden py-4">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white/90 to-transparent z-10"></div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white/90 to-transparent z-10"></div>

              <div
                className="new-dawn-ticker-track whitespace-nowrap text-sm md:text-base font-semibold text-[#065F2F]"
                style={{ display: "inline-block", paddingLeft: "100%" }}
              >
                {tickerText}
              </div>
            </div>

            <div className="hidden md:flex shrink-0 items-center px-5 py-4 border-l border-[#C9F5DC]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0B7A3E] mr-2 animate-pulse"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#065F2F]">
                Live Story
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;