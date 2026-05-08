import React from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaVideo,
  FaUsers,
  FaBullhorn,
  FaArchive,
  FaChartLine,
} from "react-icons/fa";

const pillarsData = [
  {
    icon: FaBookOpen,
    title: "Foundational Documentation",
    description:
      "Research, stakeholder engagement, leadership interviews, archival verification, content development, and perception audit.",
  },
  {
    icon: FaVideo,
    title: "Documentary & Digital Platforms",
    description:
      "Cinematic documentary production, digital platform development, and structured rollout of trailers and short-form content.",
  },
  {
    icon: FaUsers,
    title: "Public Engagement",
    description:
      "Curated stakeholder forums across the three senatorial zones, community engagement, and structured distribution across all 25 LGAs.",
  },
  {
    icon: FaBullhorn,
    title: "Strategic Amplification",
    description:
      "Coordinated release and amplification of documentary and supporting media content across digital and broadcast platforms.",
  },
  {
    icon: FaArchive,
    title: "Archives",
    description:
      "A structured repository for records, videos, leadership content, platforms, public reactions, and verified documentation.",
  },
  {
    icon: FaChartLine,
    title: "Public Accountability",
    description:
      "Preserving progress in a disciplined, accessible framework that strengthens clarity, continuity, and public understanding.",
  },
];

const iconAnimations = [
  {
    animate: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 2 },
    },
  },
  {
    animate: {
      scale: [1, 1.12, 1],
      transition: { repeat: Infinity, duration: 2.2 },
    },
  },
  {
    animate: {
      x: [0, -6, 6, 0],
      transition: { repeat: Infinity, duration: 2.5 },
    },
  },
  {
    animate: {
      rotate: [0, 8, -8, 0],
      transition: { repeat: Infinity, duration: 2.4 },
    },
  },
  {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: { repeat: Infinity, duration: 2.1 },
    },
  },
  {
    animate: {
      y: [0, -6, 0],
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 2.6 },
    },
  },
];

const AboutUs = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-[#f8fafc] text-gray-800 py-20 px-5 md:px-20"
    >
      {/* Title Section */}
      <div className="mb-14 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c7922b] mb-3">
          About The Initiative
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#064e3b] mb-5 tracking-tight">
          The New Dawn
        </h2>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A strategic multimedia programme for public engagement and
          enlightenment dedicated to the good people of Niger State.
        </p>

        <div className="w-24 h-1 bg-[#c7922b] mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Main Info Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
        {/* Image */}
        <div className="relative">
          <img
            src="/images/New-DawnLogo.png"
            alt="The New Dawn"
            className="w-full max-h-[520px] rounded-2xl shadow-xl object-contain bg-[#064e3b] p-8"
          />

          <div className="absolute -bottom-6 left-6 right-6 bg-white shadow-xl rounded-xl p-5 border-l-4 border-[#c7922b]">
            <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
              Slogan
            </p>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#064e3b]">
              Leadership in Action, A State in Motion.
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="pt-8 lg:pt-0">
          <h3 className="text-3xl font-extrabold text-[#064e3b] mb-5">
            Capturing Governance in Motion
          </h3>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong className="text-[#064e3b]">The New Dawn</strong> is an
            initiative of{" "}
            <strong className="text-[#c7922b]">
              Shevet-city Communications
            </strong>{" "}
            in conjunction with the Niger State Government, created to celebrate
            the development agenda and progress of Niger State under the
            leadership of{" "}
            <strong className="text-[#064e3b]">
              His Excellency, Farmer Governor Mohammed Umaru Bago.
            </strong>
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The platform integrates documentation, visual storytelling, digital
            accessibility, and public engagement to ensure that this period is
            recorded not as isolated achievements, but as a coherent trajectory
            of development.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Through human-centred storytelling and structured digital
            dissemination across web, social media, and broadcast platforms, The
            New Dawn strengthens credibility, visibility, and broad-based public
            enlightenment.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#064e3b] text-white rounded-xl p-5 text-center">
              <h4 className="text-2xl font-extrabold">25</h4>
              <p className="text-sm text-white/80">LGAs</p>
            </div>

            <div className="bg-[#c7922b] text-white rounded-xl p-5 text-center">
              <h4 className="text-2xl font-extrabold">3</h4>
              <p className="text-sm text-white/80">Senatorial Zones</p>
            </div>

            <div className="bg-[#022c22] text-white rounded-xl p-5 text-center">
              <h4 className="text-2xl font-extrabold">1</h4>
              <p className="text-sm text-white/80">Shared Narrative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Programme Pillars */}
      <div id="programme" className="text-center mb-20">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c7922b] mb-3">
          Programme Framework
        </p>

        <h2 className="text-3xl md:text-4xl font-extrabold text-[#064e3b] mb-6">
          Human-Centred Storytelling & Public Enlightenment
        </h2>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          The New Dawn is structured around documentation, storytelling,
          engagement, amplification, and archiving — ensuring that governance
          progress is communicated clearly, credibly, and sustainably.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {pillarsData.map((pillar, index) => {
            const IconComponent = pillar.icon;

            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-7 border border-emerald-900/10 hover:shadow-2xl hover:border-[#c7922b]/50 transition"
              >
                <motion.div
                  className="flex justify-center mb-5"
                  animate={iconAnimations[index % iconAnimations.length].animate}
                >
                  <div className="w-16 h-16 rounded-full bg-[#064e3b] flex items-center justify-center">
                    <IconComponent size={30} className="text-[#c7922b]" />
                  </div>
                </motion.div>

                <h3 className="text-xl font-extrabold text-[#064e3b] mb-3">
                  {pillar.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="bg-white rounded-3xl p-6 md:p-12 mb-20 shadow-md border border-emerald-900/10">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#064e3b] text-center uppercase tracking-wide mb-10">
          Vision & Mission
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-2xl font-bold text-[#064e3b] mb-4">Vision</h4>
            <p className="text-lg text-gray-700 bg-[#f8fafc] p-6 border-l-4 border-[#c7922b] rounded-xl shadow-md leading-relaxed">
              To position The New Dawn as a structured leadership platform that
              captures governance in motion, preserves verified progress, and
              communicates Niger State’s development journey through credible,
              accessible, and human-centred storytelling.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-[#064e3b] mb-4">Mission</h4>
            <p className="text-lg text-gray-700 bg-[#f8fafc] p-6 border-l-4 border-[#064e3b] rounded-xl shadow-md leading-relaxed">
              To document, package, and disseminate the administration’s
              development agenda through research, documentary production,
              public engagement, digital platforms, archives, and strategic
              media amplification.
            </p>
          </div>
        </div>
      </div>

    
{/* Outcomes Section */}
      <div className="bg-[#064e3b] text-white rounded-3xl p-8 md:p-14 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c7922b] mb-3 text-center">
          Expected Outcome
        </p>

        <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
          A Coherent Trajectory of Development
        </h3>

        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto text-center">
          By integrating documentation, visual storytelling, digital
          accessibility, stakeholder engagement, and archives, The New Dawn
          ensures that the work undertaken is not only documented but effectively
          communicated to a wider audience — preserving continuity, clarity, and
          efficiency in execution as a way of strengthening public accountability.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;