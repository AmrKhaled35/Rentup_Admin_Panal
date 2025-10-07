import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateAdminModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [adminTypes, setAdminTypes] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/admin/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setName(res.data.data.username);
          setEmail(res.data.data.email);
          setRole(res.data.data.admin_type_id);
        })
        .catch((error) => console.log(error));

      myAxios("/admin/admin-type/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setAdminTypes(res.data.data))
        .catch((err) => console.log(err));
    }
  }, [id, token]);

  const updateAdmin = (id) => {
    if (!validateFields([name, email, role])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جارٍ التحميل...");
    myAxios
      .post(
        `/admin/admin/update/${id}`,
        {
          username: name,
          email,
          password,
          admin_type_id: role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
      <p>تحديث المسؤول</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateAdmin(id)}
          className="text-[#3EA570] text-base bg-[#3EA570]/10 border border-green-500 rounded-md px-6 py-1"
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
        <p className="text-sm font-medium text-[#4D5464]">الاسم</p>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="أضف الاسم"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          defaultValue={name}
          value={name}
          required
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">البريد الإلكتروني</p>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أضف البريد الإلكتروني"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
          defaultValue={email}
          value={email}
          required
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">كلمة المرور</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أضف كلمة المرور"
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm"
        />

        <p className="text-sm font-medium text-[#4D5464] mt-4">الدور</p>
        <select
          onChange={(e) => setRole(e.target.value)}
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark form-select focus:ring-0 focus:border-gray"
          required
          value={role}
          key={role}
        >
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

export default UpdateAdminModal;
