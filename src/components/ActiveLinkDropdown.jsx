import { NavLink } from "react-router-dom";

const ActiveLinkDropdown = ({ to, text, setSidebarOpen }) => {
  return (
    <NavLink
      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-green-500 pl-11 py-2 flex"
          : "flex gap-2 pl-11 py-2 text-light-dark"
      }
    >
      <span>{text}</span>
    </NavLink>
  );
};

export default ActiveLinkDropdown;
