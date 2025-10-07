import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const AddAdminModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [adminTypes, setAdminTypes] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    myAxios("/admin/admin-type/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAdminTypes(res.data.data))
      .catch((err) => console.log(err));
  }, [token]);

  const AddAdmin = () => {
    if (!validateFields([name, email, password, role])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }
    myAxios
      .post(
        "/admin/admin/add",
        {
          username: name,
          email,
          password,
          admin_type_id: role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(res.data.message);
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setName("");
          setEmail("");
          setPassword("");
          setRole("");
        }
      })
      .catch((err) => toast.error(err?.response?.data?.message));
  };

  const title = (
    <div dir="rtl" className="flex justify-between items-center">
      <p>إضافة مسؤول</p>
      <div className="flex gap-4">
        <button
          onClick={AddAdmin}
          className="text-[#3EA570] text-base bg-[#3EA570]/10 border border-[#3EA570] rounded-md px-6 py-1"
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
        <p className="text-sm font-medium text-[#4D5464]">الاسم</p>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="أضف الاسم"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          required
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">البريد الإلكتروني</p>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أضف البريد الإلكتروني"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          required
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">كلمة المرور</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أضف كلمة المرور"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          required
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">الدور</p>
        <select
          onChange={(e) => setRole(e.target.value)}
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark form-select focus:ring-0 focus:border-gray"
          required
        >
          <option selected disabled>
            اختر الدور
          </option>
          {adminTypes?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.type}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
};

export default AddAdminModal;
