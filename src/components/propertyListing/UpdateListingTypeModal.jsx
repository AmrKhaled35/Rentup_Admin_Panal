import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateListingTypeModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [listingName, setListingName] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/listing-types/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setListingName(res.data.data.listing_name))
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateListing = (id) => {
    if (!validateFields([listingName])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحديث...");
    myAxios
      .post(
        `/admin/listing-types/update/${id}`,
        {
          listing_name: listingName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
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
      <p>تحديث نوع العقار</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateListing(id)}
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
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">
            اسم نوع العقار
          </label>
          <input
            onChange={(e) => setListingName(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="ادخل اسم نوع العقار"
            value={listingName}
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateListingTypeModal;
