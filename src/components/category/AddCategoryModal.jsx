import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const customStyles = {
  control: () => ({
    border: "1px solid #E0E2E7",
    borderRadius: "6px",
    height: "40px",
    marginTop: "4px",
    display: "flex",
    direction: "rtl",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E0E2E7",
  }),
};

const AddCategoryModal = ({ isOpen, setIsOpen, setRefetch, facilities }) => {
  const [categoryName, setCategoryName] = useState("");
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [facility, setFacility] = useState([]);
  const [image, setImage] = useState(null);
  const { token } = useAuth();

  const selectedFacilities = facility.length > 0 && facility.map((m) => m.value).toString();

  useEffect(() => {
    const options = facilities?.map((item) => ({
      value: item.title,
      label: item.title,
    }));
    setFacilityOptions(options);
  }, [facilities]);

  const handleAddCategory = () => {
    if (!validateFields([categoryName, selectedFacilities]) || !image) {
      return toast.error("الرجاء تعبئة جميع الحقول!");
    }

    const formData = new FormData();
    formData.append("banner", image);
    formData.append("category_name", categoryName);
    formData.append("facilities", selectedFacilities);
    formData.append("status", 1);

    const toastId = toast.loading("جارٍ التحميل...");
    myAxios
      .post("/admin/categories/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setCategoryName("");
          setFacility([]);
          setImage(null);
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

  const title = (
    <div className="flex justify-between items-center" dir="rtl">
      <p>إضافة تصنيف</p>
      <div className="flex gap-4">
        <button
          onClick={handleAddCategory}
          className="text-green-500 text-base bg-green-500/10 border border-green-500 rounded-md px-6 py-1"
        >
          إضافة
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
      <div className="border border-gray rounded-lg p-6 mt-12" >
        <div>
          <label className="text-sm font-medium text-[#4D5464] mb-1 block">المرافق</label>
          <Select
            isMulti
            options={facilityOptions}
            onChange={(value) => setFacility(value)}
            styles={customStyles}
            placeholder="اختر المرافق..."
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">اسم التصنيف</label>
          <input
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="اسم التصنيف"
            value={categoryName}
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">صورة التصنيف</label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            accept="image/*"
            className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
