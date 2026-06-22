import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programme from "./components/Programme";
import Documentary from "./components/Documentary";
import Archives from "./components/Archives";
import News from "./components/News";
import AboutUs from "./components/About";
import Contact from "./components/Contact";
import Inbox from "./components/Inbox";
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

        {/* PROGRAMME */}
        <Programme />

        {/* DOCUMENTARY */}
        <Documentary />

        {/* ARCHIVES */}
        <Archives />

        {/* NEWS */}
        <News />

        {/* ABOUT */}
        <AboutUs />

        {/* CONTACT */}
        <Contact />

        {/* ADMIN INBOX */}
        <Inbox />

        {/* FLOATING WHATSAPP */}
        <WhatsAppIcon />

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}

export default App;