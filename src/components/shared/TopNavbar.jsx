import iconMenu from "../../assets/images/menu.svg";
import useAuth from "../../hooks/useAuth";
import { LuUser } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const TopNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logoutUser } = useAuth();
  const { username, admin_type } = user || {};
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      className={`bg-white h-[70px] flex justify-center items-center shadow-[4_4px_30px_0px_rgba(131,98,234,0.05)] border border-[#F0F1F3] fixed top-0 right-0 ${
        sidebarOpen ? "left-[270px]" : "left-0"
      } z-10`}
    >
      <div className="w-full px-6 flex items-center justify-between">
        <img
          src={iconMenu}
          onClick={() => setSidebarOpen((p) => !p)}
          className="cursor-pointer"
        />
        <nav>
          <ul className="flex items-center gap-4">
            <li className="relative">
              <div className="border border-gray pl-3">
                <button
                  ref={menuRef}
                  type="button"
                  className="flex items-center gap-3"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {user?.user_image ? (
                    <img
                      src={`${process.env.VITE_IMG_URL}/${user.user_image}`}
                      alt="صورة الملف الشخصي"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <LuUser className="w-8 h-8 text-light-dark ring-2 ring-green-500 rounded-full" />
                  )}
                  <div className="text-sm font-medium text-left">
                    <p>{username}</p>
                    <p className="text-xs text-light-dark">
                      {admin_type?.type}
                    </p>
                  </div>
                  <FaChevronDown className="w-5 h-5 text-light-dark" />
                </button>
              </div>
              {isOpen && (
                <div className="absolute right-0 mt-5 min-w-[200px] rounded-lg bg-white shadow-[0_14px_19px_0px_rgba(0,83,40,0.16)]">
                  <div
                    className="py-2"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      to="/app-setting"
                      className="px-[30px] py-3 text-dark hover:bg-medium-gray hover:text-green-500 block"
                      role="menuitem"
                    >
                      <span>الإعدادات</span>
                    </Link>
                    <p
                      className="px-[30px] py-3 text-dark hover:bg-medium-gray hover:text-green-500 cursor-pointer block"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span>تسجيل الخروج</span>
                    </p>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TopNavbar;
