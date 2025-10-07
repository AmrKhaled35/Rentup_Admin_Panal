import { useEffect, useState } from "react";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateManageOurAdvantageModal = ({
  isOpen,
  setIsOpen,
  id,
  setRefetch,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/our-advantages/get-one/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setTitle(res.data.data.title);
          setDescription(res.data.data.description);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateAdvantage = (id) => {
    if (!validateFields([title, description])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جار التحميل...");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (icon) {
      formData.append("icon", icon);
    }
    myAxios
      .post(`/admin/our-advantages/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          toast.success("تم التحديث بنجاح");
          setRefetch((prev) => !prev);
          setIsOpen(false);
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message || "حدث خطأ ما");
      });
  };

  const titl = (
    <div className="flex justify-between items-center">
      <p>تحديث الميزة</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateAdvantage(id)}
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
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">العنوان</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="العنوان"
            value={title}
            required
          />
        </div>
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
          <p className="text-sm font-medium text-[#4D5464]">الوصف</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="الوصف"
            value={description}
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateManageOurAdvantageModal;
