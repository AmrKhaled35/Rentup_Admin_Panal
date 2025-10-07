import { useEffect, useState } from "react";
import myAxios from "../../utils/myAxios";
import Modal from "../ui/Modal";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateTestimonialModal = ({ isOpen, setIsOpen, setRefetch, id }) => {
  const [reviewer_name, setReviewer_name] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [designation, setDesignation] = useState("");
  const [img, setImg] = useState(null);
  const { token } = useAuth();
  const formData = new FormData();
  formData.append("reviewer_name", reviewer_name);
  formData.append("reviewer_designation", designation);
  formData.append("message", message);
  formData.append("title", title);
  if (img) {
    formData.append("img", img);
  }

  useEffect(() => {
    if (id) {
      myAxios(`/admin/testimonial/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setDesignation(res.data.data.reviewer_designation);
          setReviewer_name(res.data.data.reviewer_name);
          setMessage(res.data.data.message);
          setTitle(res.data.data.title);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateTestimonial = (id) => {
    if (!validateFields([title, message, reviewer_name, designation])) {
      return toast.error("يرجى تعبئة جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    myAxios
      .post(`/admin/testimonial/update/${id}`, formData, {
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
    <div dir="rtl" className="flex justify-between items-center">
      <p>تحديث الشهادة</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateTestimonial(id)}
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
        <p className="text-sm font-medium text-[#4D5464]">اسم المراجع</p>
        <input
          type="text"
          onChange={(e) => setReviewer_name(e.target.value)}
          placeholder="الاسم"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          value={reviewer_name}
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">صورة المراجع</p>
        <input
          type="file"
          multiple={false}
          onChange={(e) => setImg(e.target.files[0])}
          accept="image/*"
          placeholder="صورة المراجع"
          className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">وظيفة المراجع</p>
        <input
          type="text"
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="الوظيفة"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          value={designation}
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">العنوان</p>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="العنوان"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          value={title}
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">الرسالة</p>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب الرسالة"
          className="h-28 w-full px-3 py-2 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm resize-none"
          value={message}
          required
        />
      </div>
    </Modal>
  );
};

export default UpdateTestimonialModal;
