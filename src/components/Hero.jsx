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

  return (
    <section
      id="home"
      className="relative w-full min-h-screen pt-[170px] md:pt-[155px] lg:pt-[145px] flex items-center justify-center text-center overflow-hidden"
    >
      <style>{`
        @keyframes introFadeAway {
          0% { opacity: 0; transform: translateY(24px) scale(0.98); }
          12% { opacity: 1; transform: translateY(0) scale(1); }
          72% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-18px) scale(0.98); visibility: hidden; }
        }

        @keyframes heroSettleIn {
          0% { opacity: 0; transform: translateY(20px); }
          55% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
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

        .new-dawn-intro-card {
          animation: introFadeAway 9s ease-in-out forwards;
        }

        .new-dawn-main-content {
          animation: heroSettleIn 7.5s ease-out forwards;
        }

        .new-dawn-progress-ribbon {
          animation: ribbonReveal 8s ease-out forwards;
        }

        .new-dawn-ticker-track {
          animation: newDawnTicker 48s linear infinite;
        }
      `}</style>

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

      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none">
        <div className="new-dawn-intro-card max-w-4xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-8 md:px-10 md:py-10 shadow-2xl">
          <p className="text-[#F2B705] text-xs md:text-sm font-extrabold uppercase tracking-[0.35em] mb-4">
            The New Dawn
          </p>

          <p className="text-white text-base md:text-xl lg:text-2xl leading-relaxed font-medium">
            A strategic multimedia programme for public engagement and
            enlightenment dedicated to the good people of Niger State. The New
            Dawn captures governance in motion and documents the development
            trajectory under the leadership of His Excellency, Farmer Governor
            Mohammed Umaru Bago — ensuring transparency, continuity, and a
            coherent narrative of progress.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl px-6 md:px-12 pb-28 md:pb-32 new-dawn-main-content">
        <div className="flex justify-center mt-6 md:mt-10 mb-5">
          <div className="bg-white/90 rounded-full p-3 md:p-4 shadow-xl">
            <img
              src="/images/New-DawnLogo.png"
              alt="The New Dawn Logo"
              className="h-20 w-20 md:h-28 md:w-28 object-contain"
            />
          </div>
        </div>

        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-wide drop-shadow-lg">
          THE NEW DAWN
        </h1>

        <p className="text-[#F2B705] text-base md:text-xl font-semibold italic mb-7">
          Leadership in Action, A State in Motion
        </p>

        <div className="flex items-center justify-center">
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