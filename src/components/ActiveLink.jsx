import React from "react";
import { NavLink } from "react-router-dom";
// import {RxDashboard} from 'react-icons/rx'

const ActiveLink = ({ to, icon, text, setSidebarOpen }) => {
  return (
    <NavLink
      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
      to={to}
      className={({ isActive }) =>
        isActive
          ? "bg-green-500 text-white rounded-lg px-[9px] py-2 flex items-center gap-2"
          : "flex items-center gap-2 px-[9px] py-2 text-light-dark"
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

export default ActiveLink;
