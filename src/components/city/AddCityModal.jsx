import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import { City } from "country-state-city";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const AddCityModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [cityName, setCityName] = useState("");
  const [image, setImage] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    myAxios("/admin/country/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCountries(res.data.data))
      .catch((error) => console.log(error));
  }, [token]);

  const selectedCountry = countries?.find((item) => item.id == countryId);
  const countryName = selectedCountry?.country_name;
  const cities = City.getCitiesOfCountry(selectedCountry?.iso_code);
  const selectedCity = cities?.find((item) => item.name == cityName);

  const AddCity = () => {
    if (!validateFields([cityName, countryId, image])) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري الإضافة...");
    const formData = new FormData();
    formData.append("status", 1);
    formData.append("city_name", cityName);
    formData.append("country_id", countryId.toString());
    formData.append("lat", selectedCity?.latitude);
    formData.append("long", selectedCity?.longitude);
    formData.append("img", image);
    myAxios
      .post("/admin/city/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setCityName("");
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
    <div dir="rtl" className="flex justify-between items-center">
      <p>إضافة مدينة</p>
      <div className="flex gap-4">
        <button
          onClick={AddCity}
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
          <label className="text-sm font-medium text-[#4D5464]">الدولة</label>
          <select
            onChange={(e) => setCountryId(e.target.value)}
            className="w-full h-10 px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm form-select focus:ring-0 focus:border-gray"
            required
          >
            <option selected disabled>
              اختر الدولة
            </option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.country_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">المدينة</label>
          <select
            onChange={(e) => setCityName(e.target.value)}
            className="w-full h-10 px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm form-select focus:ring-0 focus:border-gray"
            disabled={!countryId}
            required
          >
            <option selected disabled>
              اختر المدينة
            </option>
            {countryName === "Palestinian Territory Occupied"
              ? [
                  "القدس",
                  "غزة",
                  "رام الله",
                  "الخليل",
                  "نابلس",
                  "بيت لحم",
                  "جنين",
                  "طولكرم",
                  "قلقيلية",
                  "رفح",
                ].map((city, i) => (
                  <option key={i} value={city}>
                    {city}
                  </option>
                ))
              : cities?.map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name}
                  </option>
                ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">خط العرض</label>
          <input
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="خط العرض"
            value={selectedCity?.latitude}
            required
            readOnly
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">خط الطول</label>
          <input
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="خط الطول"
            value={selectedCity?.longitude}
            required
            readOnly
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            صورة مصغرة
          </label>
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

export default AddCityModal;
