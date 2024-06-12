import React from "react";
import logo from "../assets/logo/msc.png"; // Replace with the path to your logo

const LandingPage = () => {
  return (
    <div className="bg-teal-900 h-screen flex items-center justify-center -mt-12 z-100">
      <img src={logo} alt="Logo" className="mb-4 w-20 h-20" />
    </div>
  );
};

export default LandingPage;
