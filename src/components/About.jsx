import React, { useState } from "react";
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

const senatorialZones = [
  {
    zone: "Niger East Senatorial Zone",
    alias: "Zone B",
    lgas: [
      "Bosso",
      "Chanchaga",
      "Gurara",
      "Munya",
      "Paikoro",
      "Rafi",
      "Shiroro",
      "Suleja",
      "Tafa",
    ],
  },
  {
    zone: "Niger North Senatorial Zone",
    alias: "Zone C",
    lgas: [
      "Agwara",
      "Borgu",
      "Kontagora",
      "Magama",
      "Mariga",
      "Mashegu",
      "Rijau",
      "Wushishi",
    ],
  },
  {
    zone: "Niger South Senatorial Zone",
    alias: "Zone A",
    lgas: [
      "Agaie",
      "Bida",
      "Edati",
      "Gbako",
      "Katcha",
      "Lapai",
      "Lavun",
      "Mokwa",
    ],
  },
];

const allLgas = senatorialZones.flatMap((zone) => zone.lgas);

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
  const [openInfoCard, setOpenInfoCard] = useState(null);

  const toggleInfoCard = (card) => {
    setOpenInfoCard((prev) => (prev === card ? null : card));
  };

  return (
    <section
      id="about"
      className="min-h-screen bg-[#E9FFF3] text-gray-800 py-16 px-4 md:py-20 md:px-20"
    >
      <div className="mb-12 md:mb-14 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
          About The Initiative
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5 tracking-tight">
          The New Dawn
        </h2>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A strategic multimedia programme for public engagement and
          enlightenment dedicated to the good people of Niger State.
        </p>

        <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
        <div className="relative mb-8 lg:mb-0">
          <div className="rounded-2xl shadow-xl bg-[#065F2F] px-4 py-6 sm:px-6 sm:py-8 md:p-10">
            <img
              src="/images/New-DawnLogo.png"
              alt="The New Dawn"
              className="w-full h-auto max-h-[360px] sm:max-h-[430px] md:max-h-[520px] object-contain"
            />
          </div>

          <div className="absolute -bottom-3 left-4 right-4 sm:left-8 sm:right-8 bg-white/95 shadow-md rounded-lg px-3 py-1.5 border-l-4 border-[#F2B705]">
            <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#065F2F] text-center leading-tight">
              Leadership in Action, A State in Motion.
            </h3>
          </div>
        </div>

        <div className="pt-6 lg:pt-0">
          <h3 className="text-3xl font-extrabold text-[#065F2F] mb-5">
            Capturing Governance in Motion
          </h3>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong className="text-[#065F2F]">The New Dawn</strong> is an
            initiative of{" "}
            <strong className="text-[#F2B705]">
              Shevet-city Communications
            </strong>{" "}
            in conjunction with the Niger State Government. It was created to
            showcase the development agenda and progress of Niger State under the
            leadership of{" "}
            <strong className="text-[#065F2F]">
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
            <button
              type="button"
              onClick={() => toggleInfoCard("lgas")}
              className="bg-[#065F2F] text-white rounded-xl p-5 text-center hover:bg-[#0B7A3E] hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">25</h4>
              <p className="text-sm text-white/80">LGAs</p>
              <p className="text-xs text-[#F2B705] font-bold mt-2">
                Click to view
              </p>
            </button>

            <button
              type="button"
              onClick={() => toggleInfoCard("zones")}
              className="bg-[#F2B705] text-[#065F2F] rounded-xl p-5 text-center hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">3</h4>
              <p className="text-sm text-[#065F2F]/80">Senatorial Zones</p>
              <p className="text-xs text-[#065F2F] font-bold mt-2">
                Click to view
              </p>
            </button>

            <button
              type="button"
              onClick={() => toggleInfoCard("narrative")}
              className="bg-[#0B7A3E] text-white rounded-xl p-5 text-center hover:bg-[#065F2F] hover:scale-[1.02] transition shadow-md"
            >
              <h4 className="text-2xl font-extrabold">1</h4>
              <p className="text-sm text-white/80">Shared Narrative</p>
              <p className="text-xs text-[#F2B705] font-bold mt-2">
                Click to view
              </p>
            </button>
          </div>

          {openInfoCard && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 bg-white border border-[#C9F5DC] rounded-2xl shadow-lg p-5"
            >
              {openInfoCard === "lgas" && (
                <div>
                  <h4 className="text-xl font-extrabold text-[#065F2F] mb-3">
                    25 Local Government Areas in Niger State
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allLgas.map((lga, index) => (
                      <span
                        key={lga}
                        className="bg-[#E9FFF3] border border-[#C9F5DC] text-[#065F2F] rounded-lg px-3 py-2 text-sm font-semibold"
                      >
                        {index + 1}. {lga}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {openInfoCard === "zones" && (
                <div>
                  <h4 className="text-xl font-extrabold text-[#065F2F] mb-4">
                    Senatorial Zones and LGAs
                  </h4>

                  <div className="space-y-4">
                    {senatorialZones.map((zone) => (
                      <div
                        key={zone.zone}
                        className="bg-[#E9FFF3] border border-[#C9F5DC] rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h5 className="font-extrabold text-[#065F2F]">
                            {zone.zone}
                          </h5>
                          <span className="text-xs font-bold bg-[#F2B705] text-[#065F2F] px-3 py-1 rounded-full">
                            {zone.alias}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {zone.lgas.map((lga) => (
                            <span
                              key={lga}
                              className="bg-white text-slate-700 border border-[#C9F5DC] rounded-full px-3 py-1 text-xs font-semibold"
                            >
                              {lga}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {openInfoCard === "narrative" && (
                <div>
                  <h4 className="text-xl font-extrabold text-[#065F2F] mb-3">
                    One Shared Narrative
                  </h4>

                  <p className="text-gray-700 leading-relaxed">
                    The New Dawn brings the 25 LGAs and 3 senatorial zones into
                    one coordinated story of leadership, progress, public
                    engagement, documentation, and accountability across Niger
                    State.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div id="programme" className="text-center mb-20">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
          Programme Framework
        </p>

        <h2 className="text-3xl md:text-4xl font-extrabold text-[#065F2F] mb-6">
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
                className="bg-white shadow-lg rounded-2xl p-7 border border-[#C9F5DC] hover:shadow-2xl hover:border-[#F2B705]/70 transition"
              >
                <motion.div
                  className="flex justify-center mb-5"
                  animate={iconAnimations[index % iconAnimations.length].animate}
                >
                  <div className="w-16 h-16 rounded-full bg-[#065F2F] flex items-center justify-center">
                    <IconComponent size={30} className="text-[#F2B705]" />
                  </div>
                </motion.div>

                <h3 className="text-xl font-extrabold text-[#065F2F] mb-3">
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

      <div className="bg-white rounded-3xl p-6 md:p-12 mb-20 shadow-md border border-[#C9F5DC]">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#065F2F] text-center uppercase tracking-wide mb-10">
          Vision & Mission
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-2xl font-bold text-[#065F2F] mb-4">Vision</h4>
            <p className="text-lg text-gray-700 bg-[#E9FFF3] p-6 border-l-4 border-[#F2B705] rounded-xl shadow-md leading-relaxed">
              To position The New Dawn as a structured leadership platform that
              captures governance in motion, preserves verified progress, and
              communicates Niger State’s development journey through credible,
              accessible, and human-centred storytelling.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-[#065F2F] mb-4">Mission</h4>
            <p className="text-lg text-gray-700 bg-[#E9FFF3] p-6 border-l-4 border-[#065F2F] rounded-xl shadow-md leading-relaxed">
              To document, package, and disseminate the administration’s
              development agenda through research, documentary production,
              public engagement, digital platforms, archives, and strategic
              media amplification.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#065F2F] text-white rounded-3xl p-8 md:p-14 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3 text-center">
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