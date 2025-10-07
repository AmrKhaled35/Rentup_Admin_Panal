import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const AddCurrencyModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [currency_code, setCurrency_code] = useState("");
  const [currency_symbol, setCurrency_symbol] = useState("");
  const [value, setValue] = useState("");
  const { token } = useAuth();

  const AddCurrency = () => {
    if (!validateFields([currency_code, currency_symbol, value])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جارٍ التحميل...");
    const body = {
      currency_code,
      currency_symbol,
      value,
      status: 1,
    };
    myAxios
      .post("/admin/currency/add", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          toast.success("تمت الإضافة بنجاح");
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setCurrency_code("");
          setCurrency_symbol("");
          setValue("");
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  const title = (
    <div dir="rtl" className="flex justify-between items-center">
      <p>إضافة عملة</p>
      <div className="flex gap-4">
        <button
          onClick={AddCurrency}
          className="text-[#26C870] text-base bg-[#26C870]/10 border border-[#26C870] rounded-md px-6 py-1"
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">العملة</label>
          <input
            type="text"
            onChange={(e) => setCurrency_code(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="مثال: USD"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">سعر مقابل الدولار</label>
          <input
            type="number"
            onChange={(e) => setValue(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="0"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">رمز العملة</label>
          <input
            type="text"
            onChange={(e) => setCurrency_symbol(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="مثال: $"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCurrencyModal;
