import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const customStyles = {
  control: () => ({
    border: "1px solid #E0E2E7",
    borderRadius: "6px",
    minHeight: "40px",
    marginTop: "4px",
    display: "flex",
    direction: "rtl",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E0E2E7",
  }),
};

const UpdateCategoryModal = ({ isOpen, setIsOpen, id, setRefetch, facilities }) => {
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

  useEffect(() => {
    if (id) {
      myAxios(`/admin/categories/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setCategoryName(res.data.data.category_name);
          res?.data?.data?.facilities &&
            setFacility(
              res.data.data.facilities.split(",").map((item) => ({
                label: item,
                value: item,
              }))
            );
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateCategory = () => {
    if (!validateFields([categoryName, selectedFacilities])) {
      return toast.error("الرجاء تعبئة جميع الحقول!");
    }

    const formData = new FormData();
    formData.append("category_name", categoryName);
    formData.append("facilities", selectedFacilities);
    if (image) formData.append("banner", image);

    const toastId = toast.loading("جارٍ التحديث...");
    myAxios
      .post(`/admin/categories/update/${id}`, formData, {
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

  const title = (
    <div className="flex justify-between items-center" dir="rtl">
      <p>تحديث التصنيف</p>
      <div className="flex gap-4">
        <button
          onClick={updateCategory}
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12" >
        <div>
          <label className="text-sm font-medium text-[#4D5464] mb-1 block">المرافق</label>
          <Select
            isMulti
            options={facilityOptions}
            onChange={(value) => setFacility(value)}
            styles={customStyles}
            value={facility}
            placeholder="اختر المرافق..."
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">اسم التصنيف</label>
          <input
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none "
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
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCategoryModal;
