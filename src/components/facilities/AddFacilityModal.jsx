import React, { useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const AddFacilityModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(null);
  const [icon, setIcon] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const { token } = useAuth();

  const handleAddFacility = () => {
    if (!validateFields([title, type, icon])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("icon", icon);
    formData.append("additional_info", additionalInfo);

    const toastId = toast.loading("جارٍ التحميل...");
    myAxios
      .post("/admin/facility/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setTitle("");
          setAdditionalInfo("");
          toast.success("تمت الإضافة بنجاح!");
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
    <div dir="rtl" className="flex justify-between items-center">
      <p>إضافة ميزة</p>
      <div className="flex gap-4">
        <button
          onClick={handleAddFacility}
          className="text-green-500 text-base bg-green-500/10 border border-green-500 rounded-md px-6 py-1"
        >
          إضافة
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red text-base bg-light-red border border-red rounded-md px-6 py-1"
        >
          إغلاق
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl}>
      <div  className="border border-gray rounded-lg p-6 mt-12 flex flex-col gap-4">
        <div className="flex flex-col items-end">
          <label className="text-sm font-medium text-[#4D5464] text-right">العنوان</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            // dir="rtl"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 text-right"
            placeholder="العنوان"
            required
          />
        </div>
        <div className="flex flex-col items-end">
          <label className="text-sm font-medium text-[#4D5464] text-right">النوع</label>
          <select
            onChange={(e) => setType(e.target.value)}
            // dir="rtl"
            className="w-full h-10 px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm form-select text-right"
            required
          >
            <option disabled selected>
              اختر
            </option>
            <option value="text">نص</option>
            <option value="number">رقم</option>
            <option value="textarea">مساحة نصية</option>
            <option value="radiobutton">زر اختيار</option>
            <option value="checkbox">خانة اختيار</option>
          </select>
        </div>
        <div className="flex flex-col items-end">
          <label className="text-sm font-medium text-[#4D5464] text-right">الأيقونة</label>
          <input
            onChange={(e) => setIcon(e.target.files[0])}
            type="file"
            accept="image/*"
            className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
            required
          />
        </div>
        <div className="flex flex-col items-end">
          <label className="text-sm font-medium text-[#4D5464] text-right">معلومات إضافية</label>
          <textarea
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="h-20 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 text-right"
            placeholder="معلومات إضافية"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddFacilityModal;
