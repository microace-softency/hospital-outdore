import React, { useEffect, useState } from "react";
import { useGlobalState } from "../context/GlobalStateContext";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import background from "../assets/images/hospitalBodyImg.jpg";

const MainContent = ({ children }) => {
  const { token } = useAuth();
  const { state } = useGlobalState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);

  // Check if the route is /login, then render a blank div
  if (location.pathname === "/login") {
    return <div />;
  }

  return (
    <main
      className={`bg-cover w-full min-h-[100vh] pt-16 ${
        sidebarOpen ? "md:pl-[250px]" : ""
      }`}
      style={{
        backgroundImage: `url('${background}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {children}
    </main>
  );
};

export default MainContent;
