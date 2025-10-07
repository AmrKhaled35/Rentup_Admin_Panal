import { useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const AddSocialModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [icon, setIcon] = useState(null);
  const [link, setLink] = useState("");
  const { token } = useAuth();

  const handleAddSocial = () => {
    if (!validateFields([link, icon])) {
      return toast.error("يرجى تعبئة جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    const formData = new FormData();
    formData.append("link", link);
    if (icon) formData.append("icon", icon);

    myAxios
      .post("/admin/socials/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setLink("");
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
    <div className="flex justify-between items-center">
      <p>إضافة موقع تواصل</p>
      <div className="flex gap-4">
        <button
          onClick={handleAddSocial}
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
        <div className="mt-4">
          <p className="text-sm font-medium text-[#4D5464]">الأيقونة</p>
          <input
            onChange={(e) => setIcon(e.target.files[0])}
            type="file"
            accept="image/*"
            className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">الرابط</label>
          <input
            onChange={(e) => setLink(e.target.value)}
            type="url"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="الرابط"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddSocialModal;
