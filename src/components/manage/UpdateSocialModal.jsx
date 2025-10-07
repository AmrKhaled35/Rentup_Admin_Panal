import { useEffect, useState } from "react";
import myAxios from "../../utils/myAxios";
import Modal from "../ui/Modal";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateSocialModal = ({ isOpen, setIsOpen, setRefetch, id }) => {
  const [link, setLink] = useState("");
  const [icon, setIcon] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/socials/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setLink(res.data.data.link);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateSocial = (id) => {
    if (!validateFields([link])) {
      return toast.error("يرجى تعبئة جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    const formData = new FormData();
    if (icon) formData.append("icon", icon);
    formData.append("link", link);

    myAxios
      .post(`/admin/socials/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="flex justify-between items-center">
      <p>تحديث موقع التواصل</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateSocial(id)}
          className="text-green-500 text-base bg-green-500/10 border border-green-500 rounded-md px-6 py-1"
        >
          تحديث
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
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">الرابط</label>
          <input
            onChange={(e) => setLink(e.target.value)}
            value={link}
            type="url"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="الرابط"
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSocialModal;
