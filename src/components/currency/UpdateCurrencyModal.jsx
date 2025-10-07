import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useAuth from "../../hooks/useAuth";
import myAxios from "../../utils/myAxios";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateCurrencyModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [currency_code, setCurrency_code] = useState("");
  const [currency_symbol, setCurrency_symbol] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/currency/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setCurrency_code(res.data.data.currency_code);
          setCurrency_symbol(res.data.data.currency_symbol);
          setValue(res.data.data.value);
          setStatus(res.data.data.status);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateCurrency = (id) => {
    if (!validateFields([currency_code, currency_symbol, value])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جارٍ التحميل...");
    const body = {
      currency_code,
      currency_symbol,
      value,
      status,
    };
    myAxios
      .post(`/admin/currency/update/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          toast.success("تم التحديث بنجاح");
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
      <p>تعديل العملة</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateCurrency(id)}
          className="text-[#26C870] text-base bg-[#26C870]/10 border border-[#26C870] rounded-md px-6 py-1"
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">العملة</label>
          <input
            type="text"
            onChange={(e) => setCurrency_code(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="مثال: USD"
            value={currency_code}
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            السعر مقابل الدولار
          </label>
          <input
            type="number"
            onChange={(e) => setValue(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="0"
            value={value}
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">رمز العملة</label>
          <input
            type="text"
            onChange={(e) => setCurrency_symbol(e.target.value)}
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            value={currency_symbol}
            placeholder="مثال: $"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">الحالة</label>
          <select
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm form-select"
            value={status}
            required
          >
            <option value={1}>متاحة</option>
            <option value={0}>غير متاحة</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCurrencyModal;
