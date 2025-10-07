import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateFacilityModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/outdoor-facility/get-one/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setTitle(res.data.data.title);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateFacility = (id) => {
    if (!validateFields([title])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جارٍ التحميل...");
    const formData = new FormData();
    formData.append("title", title);
    if (icon) {
      formData.append("icon", icon);
    }

    myAxios
      .post(`/admin/outdoor-facility/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          toast.success("تم التحديث بنجاح!");
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  const titl = (
    <div className="flex justify-between items-center" dir="rtl">
      <p>تعديل الميزة الخارجية</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateFacility(id)}
          className="text-green-500 text-base bg-green-500/10 border border-green-500 rounded-md px-6 py-1"
        >
          تحديث
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red text-base bg-light-red border border-red rounded-md px-6 py-1"
        >
          إلغاء
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl}>
      <div className="border border-gray rounded-lg p-6 mt-12" >
        <div>
          <label className="text-sm font-medium text-[#4D5464]">العنوان</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none "
            placeholder="العنوان"
            value={title}
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">الأيقونة</label>
          <input
            onChange={(e) => setIcon(e.target.files[0])}
            type="file"
            accept="image/*"
            className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateFacilityModal;
