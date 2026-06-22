import React from "react";
import {
  FaFileAlt,
  FaVideo,
  FaUsers,
  FaBullhorn,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

const programmeItems = [
  {
    id: "documentation",
    title: "Foundational Documentation",
    icon: <FaFileAlt />,
    description:
      "Capturing the vision, policies, programmes, and development milestones of The New Dawn initiative in a structured and accessible format.",
  },
  {
    id: "media",
    title: "Media & Digital Platforms",
    icon: <FaVideo />,
    description:
      "Using documentary, video, photography, online platforms, and digital storytelling to communicate the activities and progress of the initiative.",
  },
  {
    id: "engagement",
    title: "Public Engagement",
    icon: <FaUsers />,
    description:
      "Creating channels for citizens, stakeholders, and communities to understand, follow, and participate in the development conversation.",
  },
  {
    id: "amplification",
    title: "Strategic Amplification",
    icon: <FaBullhorn />,
    description:
      "Promoting key achievements, policy direction, and public-interest information through coordinated communication and media visibility.",
  },
  {
    id: "accountability",
    title: "Public Accountability",
    icon: <FaShieldAlt />,
    description:
      "Presenting records, progress reports, and development updates in a way that strengthens transparency and public trust.",
  },
  {
    id: "impact",
    title: "Expected Outcome",
    icon: <FaChartLine />,
    description:
      "Building a credible public record of leadership, development, and institutional progress across Niger State.",
  },
];

const Programme = () => {
  return (
    <section id="programme" className="bg-white py-20 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#F2B705] mb-3">
            Programme Framework
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#065F2F] mb-5">
            The New Dawn Programme
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The programme is designed to document, communicate, preserve, and
            amplify the development agenda of Niger State through strategic
            media, public engagement, and institutional records.
          </p>

          <div className="w-24 h-1 bg-[#F2B705] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmeItems.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-[#E9FFF3] border border-[#C9F5DC] rounded-2xl p-6 shadow-md hover:shadow-2xl transition scroll-mt-32"
            >
              <div className="w-14 h-14 rounded-full bg-[#065F2F] text-[#F2B705] flex items-center justify-center text-2xl mb-5">
                {item.icon}
              </div>

              <h3 className="text-2xl font-extrabold text-[#065F2F] mb-3">
                {item.title}
              </h3>

              <p className="text-slate-600 leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programme;