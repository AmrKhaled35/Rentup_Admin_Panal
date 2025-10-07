import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import { Country } from "country-state-city";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateCountryModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [countryName, setCountryName] = useState("");
  const { token } = useAuth();
  const countries = Country.getAllCountries();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/country/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setCountryName(res.data.data.country_name);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const selectedCountry = countries.find(
    (country) => country?.name === countryName
  );

  const updateCountry = (id) => {
    if (!validateFields([countryName])) {
      return toast.error("يرجى ملء جميع الحقول");
    }

    const toastId = toast.loading("جارٍ التحميل...");
    myAxios
      .post(
        `/admin/country/update/${id}`,
        {
          status: "1",
          country_name: countryName,
          iso_code: selectedCountry?.isoCode,
          phone_code: selectedCountry?.phonecode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
    <div className="flex justify-between items-center">
      <p className="text-right">تعديل الدولة</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateCountry(id)}
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
      <div dir="rtl" className="border border-gray rounded-lg p-6 mt-12 text-right">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">اسم الدولة</label>
          <select
            onChange={(e) => setCountryName(e.target.value)}
            className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm form-select focus:ring-0 focus:border-gray"
            value={countryName}
            required
          >
            <option selected disabled>
              اختر الدولة
            </option>
            {countries.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">رمز ISO</label>
          <input
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="رمز ISO"
            value={selectedCountry?.isoCode}
            readOnly
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">كود الهاتف</label>
          <input
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="كود الهاتف"
            value={selectedCountry?.phonecode}
            readOnly
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCountryModal;
