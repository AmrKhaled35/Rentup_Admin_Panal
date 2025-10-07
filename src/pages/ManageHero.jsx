import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";

import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ManageHero = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/hero_section/get", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setData(res.data.data);
        setTitle(res.data.data.hero_title);
        setDescription(res.data.data.hero_description);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (!validateFields([title, description])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جار التحميل...");
    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    if (banner) formData.append("banner", banner);
    formData.append("hero_title", title);
    formData.append("hero_description", description);

    myAxios
      .post("/admin/hero_section/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((p) => !p);
          toast.success("تم التحديث بنجاح");
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message || "حدث خطأ ما");
      });
  };

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "hero");
    if (route?.edit) return true;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة القسم الرئيسي</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} alt=">" />
        <p className="text-light-dark">إدارة القسم الرئيسي</p>
      </div>
      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8">
              <p className="text-xl font-medium text-dark">إضافة الشعار</p>
              <img
                src={`${import.meta.env.VITE_IMG_URL}/${data?.logo}`}
                alt="Logo"
                className="w-72 h-auto mt-4"
              />
              <input
                onChange={(e) => setLogo(e.target.files[0])}
                type="file"
                accept="image/*"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark"
              />

              <p className="text-xl font-medium text-dark mt-5">العنوان</p>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">الوصف</p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full lg:w-3/5 h-28 px-5 py-2 mt-4 border border-gray rounded-lg resize-none outline-none text-sm text-light-dark"
              />

              <p className="text-xl font-medium text-dark mt-5">إضافة البانر</p>
              <img
                src={`${import.meta.env.VITE_IMG_URL}/${data?.banner}`}
                alt="Banner"
                className="w-72 h-auto mt-4"
              />
              <input
                onChange={(e) => setBanner(e.target.files[0])}
                type="file"
                accept="image/*"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark"
              />
            </div>

            <div className="text-end w-full lg:w-3/5">
              {isEditable() && (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-10 py-2 text-lg font-semibold rounded-lg mt-10"
                >
                  تحديث
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHero;
