import React, { useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import ActiveLink from "../ActiveLink";
import ActiveLinkDropdown from "../ActiveLinkDropdown";
import {
  RxGlobe,
  RxMixerHorizontal,
  RxExclamationTriangle,
  RxGear,
  RxQuestionMarkCircled,
} from "react-icons/rx";
import {
  LuUsers,
  LuUser,
  LuFileText,
  LuWallet,
  LuLayoutDashboard,
  LuNetwork,
  LuPackage,
  LuTicket,
  LuPlusSquare,
  LuQuote,
  LuSquareEqual,
  LuSquareStack,
  LuDoorOpen,
  LuMessageSquare,
} from "react-icons/lu";
import useAuth from "../../hooks/useAuth";
import myAxios from "../../utils/myAxios";

const SideNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { permissions, token } = useAuth();
  const [config, setConfig] = useState(false);
  const [manage, setManage] = useState(false);
  const [listing, setListing] = useState(false);
  const [blog, setBlog] = useState(false);
  const [country, setCountry] = useState(false);
  const [payment, setPayment] = useState(false);
  const [logo, setLogo] = useState(null);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const isViewable = (name) => {
    const route = permissions?.find((route) => route.name === name);
    if (route?.view) return true;
  };

  useEffect(() => {
    myAxios("/admin/hero_section/get", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setLogo(res.data.data.logo))
      .catch((error) => console.log(error));
  }, [token]);

  useEffect(() => {
    setListing(
      ["property-listing", "listing-type"].includes(path)
    );
    setBlog(
      ["blog-list", "blog-category-list"].includes(path)
    );
    setCountry(
      ["country-list", "city-list"].includes(path)
    );
    setPayment(
      ["currency", "payment-gateways", "payment-history"].includes(path)
    );
    setManage(
      [
        "hero",
        "our-advantage",
        "about-us",
        "footer",
        "app-setting",
        "social",
        "ads",
      ].includes(path)
    );
    setConfig(
      ["mail-config", "pusher-config", "google-config"].includes(path)
    );
  }, [path]);

  const disclosureBtnClass = (isActive) =>
    `flex w-full justify-between px-3 py-2 rounded-lg ${
      isActive
        ? "bg-green-500 text-white"
        : "text-light-dark hover:bg-green-500 hover:text-white"
    }`;

  return (
    <div className="px-[18px] bg-white shadow-[4_4px_30px_0px_rgba(131,98,234,0.05)] border-r border-[#F0F1F3]">
      <Link to="/">
        <img
          src={`${import.meta.env.VITE_IMG_URL}/${logo}`}
          alt="logo"
          className="my-7 w-full"
        />
      </Link>
      <nav className="mt-5 h-[calc(100vh-124px)] overflow-y-auto no-scrollbar">
        <ul className="text-sm font-semibold space-y-6">
          {isViewable("dashboard") && (
            <li>
              <ActiveLink
                to="/dashboard"
                icon={<LuLayoutDashboard className="w-6 h-6" />}
                text="لوحة التحكم"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Manage */}
          <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureBtnClass(manage)}>
                    <div className="flex items-center gap-2">
                      <RxMixerHorizontal className="h-6 w-6" />
                      <span>الإعدادات</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && manage ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("app-setting") && (
                        <ActiveLinkDropdown
                          to="/app-setting"
                          text="إعدادات التطبيق"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("hero") && (
                        <ActiveLinkDropdown
                          to="/hero"
                          text="الهيرو"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("our-advantage") && (
                        <ActiveLinkDropdown
                          to="/our-advantage"
                          text="مميزاتنا"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("about-us") && (
                        <ActiveLinkDropdown
                          to="/about-us"
                          text="من نحن"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("social") && (
                        <ActiveLinkDropdown
                          to="/social"
                          text="وسائل التواصل"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("footer") && (
                        <ActiveLinkDropdown
                          to="/footer"
                          text="تذييل الصفحة"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("ads") && (
                        <ActiveLinkDropdown
                          to="/ads"
                          text="الإعلانات"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li>

          {/* Facilities */}
          {isViewable("facilities") && (
            <li>
              <ActiveLink
                to="/facilities"
                icon={<LuFileText className="w-6 h-6" />}
                text="المرافق"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}
          {isViewable("outdoor-facilities") && (
            <li>
              <ActiveLink
                to="/outdoor-facilities"
                icon={<LuDoorOpen className="w-6 h-6" />}
                text="المرافق الخارجية"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}
          {isViewable("category") && (
            <li>
              <ActiveLink
                to="/category"
                icon={<LuNetwork className="w-6 h-6" />}
                text="التصنيفات"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Property Listing */}
          <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={disclosureBtnClass(listing)}
                  >
                    <div className="flex items-center gap-2">
                      <LuPlusSquare className="h-6 w-6" />
                      <span>قائمة العقارات</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && listing ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("property-listing") && (
                        <ActiveLinkDropdown
                          to="/property-listing"
                          text="قائمة العقارات"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("listing-type") && (
                        <ActiveLinkDropdown
                          to="/listing-type"
                          text="نوع القائمة"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li>

          {/* Users */}
          {isViewable("users") && (
            <li>
              <ActiveLink
                to="/users"
                icon={<LuUsers className="h-6 w-6" />}
                text="المستخدمون"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Blogs */}
          {/* <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureBtnClass(blog)}>
                    <div className="flex items-center gap-2">
                      <LuSquareEqual className="h-6 w-6" />
                      <span>المدونة</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && blog ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("blog-list") && (
                        <ActiveLinkDropdown
                          to="/blog-list"
                          text="قائمة المقالات"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("blog-category-list") && (
                        <ActiveLinkDropdown
                          to="/blog-category-list"
                          text="تصنيفات المدونة"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li> */}

          {/* Country */}
          <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureBtnClass(country)}>
                    <div className="flex items-center gap-2">
                      <RxGlobe className="h-6 w-6" />
                      <span>الدول</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && country ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("country-list") && (
                        <ActiveLinkDropdown
                          to="/country-list"
                          text="قائمة الدول"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("city-list") && (
                        <ActiveLinkDropdown
                          to="/city-list"
                          text="قائمة المدن"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li>

          {/* Payment */}
          <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureBtnClass(payment)}>
                    <div className="flex items-center gap-2">
                      <LuWallet className="h-6 w-6" />
                      <span>الدفع</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && payment ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("currency") && (
                        <ActiveLinkDropdown
                          to="/currency"
                          text="العملة"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("payment-gateways") && (
                        <ActiveLinkDropdown
                          to="/payment-gateways"
                          text="بوابات الدفع"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("payment-history") && (
                        <ActiveLinkDropdown
                          to="/payment-history"
                          text="تاريخ الدفع"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li>

          {/* Support Ticket */}
          {isViewable("support-ticket") && (
            <li>
              <ActiveLink
                to="/support-ticket"
                icon={<LuTicket className="h-6 w-6" />}
                text="تذاكر الدعم"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Package */}
          {isViewable("package") && (
            <li>
              <ActiveLink
                to="/package"
                icon={<LuPackage className="h-6 w-6" />}
                text="الحزم"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Report */}
          {isViewable("report") && (
            <li>
              <ActiveLink
                to="/report"
                icon={<RxExclamationTriangle className="h-6 w-6" />}
                text="التقارير"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* FAQ */}
          {isViewable("faq") && (
            <li>
              <ActiveLink
                to="/faq"
                icon={<RxQuestionMarkCircled className="h-6 w-6" />}
                text="الأسئلة الشائعة"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Client Query */}
          {isViewable("client-query") && (
            <li>
              <ActiveLink
                to="/client-query"
                icon={<LuMessageSquare className="h-6 w-6" />}
                text="استفسارات العملاء"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Testimonial */}
          {isViewable("testimonial") && (
            <li>
              <ActiveLink
                to="/testimonial"
                icon={<LuQuote className="h-6 w-6" />}
                text="آراء العملاء"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Pages */}
          {isViewable("pages") && (
            <li>
              <ActiveLink
                to="/pages"
                icon={<LuSquareStack className="h-6 w-6" />}
                text="الصفحات"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}

          {/* Configuration */}
          <li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureBtnClass(config)}>
                    <div className="flex items-center gap-2">
                      <RxGear className="h-6 w-6" />
                      <span>الإعدادات العامة</span>
                    </div>
                    <FaChevronDown
                      className={`${open && "rotate-180 transform"} ${
                        !open && config ? "text-white" : ""
                      } h-6 w-4 transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      {isViewable("mail-config") && (
                        <ActiveLinkDropdown
                          to="/mail-config"
                          text="إعداد البريد"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("pusher-config") && (
                        <ActiveLinkDropdown
                          to="/pusher-config"
                          text="إعداد Pusher"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {isViewable("google-config") && (
                        <ActiveLinkDropdown
                          to="/google-config"
                          text="إعداد Google"
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </li>

          {/* Roles & Admin */}
          {isViewable("create-role") && (
            <li>
              <ActiveLink
                to="/create-role"
                icon={<LuUser className="h-6 w-6" />}
                text="إنشاء دور"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}
          {isViewable("admin-list") && (
            <li>
              <ActiveLink
                to="/admin-list"
                icon={<LuUser className="h-6 w-6" />}
                text="قائمة المديرين"
                setSidebarOpen={setSidebarOpen}
              />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
