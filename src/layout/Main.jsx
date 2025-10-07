import React, { useState } from "react";
import SideNavbar from "../components/shared/SideNavbar";
import TopNavbar from "../components/shared/TopNavbar";
import { Outlet } from "react-router-dom";

const Main = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth < 1024 ? false : true
  );

  return (
    <div
      className={`font-inter grid ${
        sidebarOpen ? "grid-cols-[270px_1fr]" : "grid-cols-[0px_1fr]"
      } transition-all duration-500 max-w-[calc(100vw-0px)] w-full`}
      
    >
      <SideNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="overflow-hidden z-20">
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="px-6 py-8 bg-light-gray h-[calc(100vh-70px)] mt-[70px] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
