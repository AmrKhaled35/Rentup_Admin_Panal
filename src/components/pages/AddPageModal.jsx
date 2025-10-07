import React, { useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import Editor from "../Editor";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const AddPageModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [title, setTitle] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const { token } = useAuth();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", fullDescription);

  const AddPage = () => {
    if (!validateFields([title, fullDescription])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    myAxios
      .post("/admin/more-page/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setTitle("");
          toast.success("تم الإضافة بنجاح!");
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
      <p>إضافة صفحة</p>
      <div className="flex gap-4">
        <button
          onClick={AddPage}
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
      <div className="border border-gray rounded-lg p-6 mt-12">
        <p className="text-sm font-medium text-[#4D5464]">العنوان</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="أضف العنوان"
          className="h-10 w-full px-3 bg-[#f9f9fc] rounded-lg border border-gray outline-none mt-1 text-sm"
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">الوصف الكامل</p>
        <div>
          <Editor
            fullDescription={fullDescription}
            setFullDescription={setFullDescription}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddPageModal;
