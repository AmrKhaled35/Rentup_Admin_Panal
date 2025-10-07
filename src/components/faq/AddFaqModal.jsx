import React, { useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const AddFaqModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [qn, setQn] = useState("");
  const [ans, setAns] = useState("");
  const { token } = useAuth();

  const AddFqa = () => {
    if (!validateFields([qn, ans])) {
      return toast.error("من فضلك املأ جميع الحقول!");
    }

    const toastId = toast.loading("جاري الإضافة...");
    myAxios
      .post(
        "/admin/faq/add",
        {
          qua: qn,
          ans: ans,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setAns("");
          setQn("");
          toast.success("تمت الإضافة بنجاح ✅");
        } else {
          toast.error(res.data?.message || "حدث خطأ أثناء الإضافة");
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message || "خطأ في الاتصال بالخادم");
      });
  };

  const title = (
    <div dir = "rtl" className="flex justify-between items-center">
      <p>إضافة سؤال شائع</p>
      <div className="flex gap-4">
        <button
          onClick={AddFqa}
          className="text-green-600 text-base bg-green-100 border border-green-600 rounded-md px-6 py-1"
        >
          إضافة
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red-600 text-base bg-red-100 border border-red-600 rounded-md px-6 py-1"
        >
          إغلاق
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">السؤال</label>
          <input
            onChange={(e) => setQn(e.target.value)}
            value={qn}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="أدخل السؤال هنا"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">الإجابة</label>
          <textarea
            onChange={(e) => setAns(e.target.value)}
            value={ans}
            className="h-36 w-full resize-none border border-gray bg-medium-gray rounded-lg px-3 py-2 mt-1 outline-none"
            placeholder="أدخل الإجابة هنا"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddFaqModal;
