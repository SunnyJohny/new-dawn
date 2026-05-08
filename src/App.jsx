import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Documentary from "./components/Documentary"; // ✅ ADD THIS
import AboutUs from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppIcon from "./components/watsappComponent";

// import SearchBar from "./components/SearchBar";
// import foodData from "./data/foodData";

function App() {
  return (
    <>
      {/* Search Bar (optional) */}
      {/* <SearchBar products={foodData} /> */}

      <div className="mt-[1px]">
        {/* NAV */}
        <Navbar />

        {/* HERO */}
        <Hero />

        {/* ✅ DOCUMENTARY SECTION (NEW DAWN CORE) */}
        <Documentary />

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