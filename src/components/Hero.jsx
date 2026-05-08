import React from "react";
import { Link } from "react-scroll";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="The New Dawn Background"
          className="w-full h-full object-cover"
        />

        {/* Dark Green Overlay */}
        <div className="absolute inset-0 bg-[#064e3b] bg-opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 md:px-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/New-DawnLogo.png"
            alt="The New Dawn Logo"
            className="h-20 md:h-28 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight tracking-wide">
          THE NEW DAWN
        </h1>

        {/* Slogan */}
        <p className="text-[#c7922b] text-lg md:text-2xl font-semibold italic mb-6">
          Leadership in Action, A State in Motion
        </p>

        {/* Description */}
        <p className="text-gray-200 text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
          A strategic multimedia programme for public engagement and enlightenment
          dedicated to the good people of Niger State. The New Dawn captures governance
          in motion and documents the development trajectory under the leadership of
          His Excellency, Farmer Governor Mohammed Umaru Bago — ensuring transparency,
          continuity, and a coherent narrative of progress.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Primary Button */}
          <Link
            to="watch-documentary"
            smooth={true}
            duration={500}
            offset={-80}
            className="bg-[#c7922b] text-white px-8 py-3 rounded-full font-semibold cursor-pointer hover:bg-[#b3831f] transition shadow-lg"
          >
            Watch Documentary
          </Link>

          {/* Secondary Button */}
          <Link
            to="about"
            smooth={true}
            duration={500}
            offset={-80}
            className="border border-[#c7922b] text-[#c7922b] px-8 py-3 rounded-full font-semibold cursor-pointer hover:bg-[#c7922b] hover:text-white transition shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

     
    </section>
  );
};

export default Hero;