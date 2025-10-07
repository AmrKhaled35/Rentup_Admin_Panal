import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import Card from "../components/home/Card";
import currentPlan from "../assets/images/current-plan.svg";
import payments from "../assets/images/payments.svg";
import properties from "../assets/images/properties.svg";
import approvedProperties from "../assets/images/approved-properties (2).svg";
import pendingProperties from "../assets/images/pending-properties (2).svg";
import disabledProperties from "../assets/images/disabled-properties.svg";
import rejectedProperties from "../assets/images/rejected-properties.svg";
import currentPlanBg from "../assets/images/current-plan-bg.svg";
import paymentsBg from "../assets/images/payments-bg.svg";
import propertiesBg from "../assets/images/properties-bg.svg";
import approvedPropertiesBg from "../assets/images/approved-properties-bg.svg";
import pendingPropertiesBg from "../assets/images/pending-properties-bg.svg";
import disabledPropertiesBg from "../assets/images/disabled-properties-bg.svg";
import rejectedPropertiesBg from "../assets/images/rejected-properties-bg.svg";
import logins from "../assets/images/logins.svg";
import banUser from "../assets/images/ban-user.svg";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [propertiesData, setPropertiesData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const { token, role } = useAuth();

  const { register, handleSubmit, setValue, getValues, watch } = useForm();

  const pendingPropertiesData = propertiesData.filter(
    (item) => item.status === "pending"
  );
  const activePropertiesData = propertiesData.filter(
    (item) => item.status === "active"
  );
  const disabledPropertiesData = propertiesData.filter(
    (item) => item.status === "disabled"
  );
  const rejectedPropertiesData = propertiesData.filter(
    (item) => item.status === "rejected"
  );

  const {
    name,
    email,
    phone,
    address,
    city_id,
    user_package,
    wallet,
    country_id,
    is_email_verified,
    is_number_verified,
  } = userData;

  useEffect(() => {
    myAxios(`/admin/get-property-by-user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserData(res.data.data.user);
        setPropertiesData(res.data.data.propertyByUser);
      })
      .catch((error) => console.log(error));

    myAxios("/admin/country/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCountries(res.data.data);
      })
      .catch((error) => console.log(error));

    myAxios("/admin/city/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCities(res.data.data);
      })
      .catch((error) => console.log(error));
  }, [id, token]);

  useEffect(() => {
    setValue("name", name);
    setValue("email", email);
    setValue("phone", phone);
    setValue("address", address);
    setValue("country_id", country_id);
    setValue("city_id", city_id);
    setValue("is_email_verified", is_email_verified);
    setValue("is_number_verified", is_number_verified);
  }, [userData]);

  const onSubmit = (data) => {
    const toastId = toast.loading("جارٍ التحميل...");
    myAxios
      .post(`/admin/update-user-data/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
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

  const filteredCities = cities?.filter(
    (item) => item?.country_id == watch("country_id")
  );

  const city = filteredCities?.find((item) => item.id == getValues("city_id"));

  const handleBanUser = () => {
    myAxios
      .post(
        `/admin/update-user-data/${id}`,
        { status: 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم حظر المستخدم!",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div dir="rtl" className="text-right">
      <div className="mt-6 grid xl:grid-cols-4 gap-6">
        <Card
          title="الخطة الحالية"
          count={user_package?.package_name}
          icon={currentPlan}
          bg={currentPlanBg}
        />
        <Card
          title="الرصيد"
          count={wallet?.balance}
          icon={payments}
          bg={paymentsBg}
        />
        <Card
          title="العقارات"
          count={propertiesData.length}
          icon={properties}
          bg={propertiesBg}
          link={`/users-properties/${id}`}
        />
        <Card
          title="العقارات المقبولة"
          count={activePropertiesData?.length}
          icon={approvedProperties}
          bg={approvedPropertiesBg}
          link={`/users-properties/${id}?status=active`}
        />
        <Card
          title="العقارات المعلقة"
          count={pendingPropertiesData?.length}
          icon={pendingProperties}
          bg={pendingPropertiesBg}
          link={`/users-properties/${id}?status=pending`}
        />
        <Card
          title="العقارات المعطلة"
          count={disabledPropertiesData?.length}
          icon={disabledProperties}
          bg={disabledPropertiesBg}
          link={`/users-properties/${id}?status=disabled`}
        />
        <Card
          title="العقارات المرفوضة"
          count={rejectedPropertiesData?.length}
          icon={rejectedProperties}
          bg={rejectedPropertiesBg}
          link={`/users-properties/${id}?status=rejected`}
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6">
        <Link to={`/users/${id}/logins`}>
          <button className="h-9 rounded text-white text-sm font-semibold flex items-center justify-center gap-[10px] bg-[#26C870] w-full">
            <img src={logins} width={12} height={12} />
            تسجيل الدخول
          </button>
        </Link>

        <button
          onClick={handleBanUser}
          className="h-9 rounded text-white text-sm font-semibold flex items-center justify-center gap-[10px] bg-[#26C870] disabled:bg-opacity-50"
          disabled={role !== "Super"}
        >
          <img src={banUser} width={12} height={12} />
          حظر المستخدم
        </button>
      </div>

      <div className="mt-10 border border-[#E4E7E9] rounded-md bg-white">
        <p className="text-xl font-semibold px-10 py-4">معلومات المستخدم</p>
        <hr className="border-gray" />
        <form onSubmit={handleSubmit(onSubmit)} className="px-10">
          <div className="mt-4">
            <label className="text-sm font-semibold text-dark">الاسم الكامل</label>
            <input
              {...register("name")}
              type="text"
              className="h-11 w-full border border-gray bg-medium-gray rounded-lg px-6 mt-2 outline-none"
              placeholder="الاسم"
              required
            />
          </div>

          <div className="mt-4 grid lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-dark">البريد الإلكتروني</label>
              <input
                {...register("email")}
                type="email"
                className="h-11 w-full border border-gray bg-medium-gray rounded-lg px-6 mt-2 outline-none"
                placeholder="email@gmail.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-dark">رقم الهاتف</label>
              <div className="flex mt-2">
                <div className="h-11 leading-[44px] rounded-l-lg border border-gray px-3 bg-gray">
                  {city?.country?.phone_code}
                </div>
                <input
                  {...register("phone")}
                  type="text"
                  className="h-11 w-full border border-gray bg-medium-gray rounded-r-lg px-6 outline-none"
                  placeholder="1354352145"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-dark">العنوان</label>
            <input
              {...register("address")}
              type="text"
              className="h-11 w-full border border-gray bg-medium-gray rounded-lg px-6 mt-2 outline-none"
              placeholder="العنوان"
              required
            />
          </div>

          <div className="mt-4 grid lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-dark block">الدولة</label>
              <select
                {...register("country_id")}
                className="form-select focus:ring-0 border-gray rounded-lg focus:border-gray w-full h-11 mt-2"
              >
                {countries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.country_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-dark block">المدينة</label>
              <select
                {...register("city_id")}
                className="form-select focus:ring-0 border-gray rounded-lg focus:border-gray w-full h-11 mt-2"
                disabled={!getValues("country_id")}
              >
                {filteredCities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.city_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-dark font-semibold">التحقق من البريد الإلكتروني</p>
              <div className="flex">
                <input
                  {...register("is_email_verified")}
                  type="checkbox"
                  id="email-verify"
                  className="peer hidden"
                />
                <label
                  htmlFor="email-verify"
                  className="select-none cursor-pointer rounded-md border border-[#26C870] py-2 w-full text-dark transition-colors duration-200 ease-in-out peer-checked:bg-[#26C870] peer-checked:text-white peer-checked:border-[#26C870] text-center mt-2"
                >
                  تم التحقق
                </label>
              </div>
            </div>

            <div>
              <p className="text-sm text-dark font-semibold">التحقق من الهوية</p>
              <div className="flex">
                <input
                  {...register("is_number_verified")}
                  type="checkbox"
                  id="mobile-verify"
                  className="peer hidden"
                />
                <label
                  htmlFor="mobile-verify"
                  className="select-none cursor-pointer rounded-md border border-[#26C870] py-2 w-full text-dark transition-colors duration-200 ease-in-out peer-checked:bg-[#26C870] peer-checked:text-white peer-checked:border-[#26C870] text-center mt-2"
                >
                  تم التحقق
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 text-white font-medium bg-[#26C870] rounded-md mt-7 mb-7"
          >
            حفظ
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
