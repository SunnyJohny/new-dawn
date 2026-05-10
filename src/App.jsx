import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Documentary from "./components/Documentary";
import Archives from "./components/Archives"; // ✅ ADD THIS
import AboutUs from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppIcon from "./components/watsappComponent";

function App() {
  return (
    <>
      <div className="mt-[1px]">
        {/* NAV */}
        <Navbar />

        {/* HERO */}
        <Hero />

        {/* DOCUMENTARY */}
        <Documentary />

        {/* ✅ ARCHIVES (NEW SECTION ADDED HERE) */}
        <Archives />

        {/* ABOUT */}
        <AboutUs />

        {/* CONTACT */}
        <Contact />

        {/* FLOATING WHATSAPP */}
        <WhatsAppIcon />

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}

export default App;