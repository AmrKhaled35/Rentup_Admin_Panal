import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Loading from "../components/shared/Loading";
import iconChevronRight from "../assets/images/chevron-right.svg";
import myAxios from "../utils/myAxios";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ManageAppSetting = () => {
  const [site_title, setSite_title] = useState("");
  const [meta_description, setMeta_description] = useState("");
  const [currency_id, setCurrency_id] = useState("");
  const [front_end_base_url, setFront_end_base_url] = useState("");
  const [back_end_base_url, setBack_end_base_url] = useState("");
  const [google_analytics_id, setGoogle_analytics_id] = useState("");
  const [facebook_pixel_id, setFacebook_pixel_id] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/app-settings/get-one", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setSite_title(res.data.data.site_title);
        setMeta_description(res.data.data.meta_description);
        setCurrency_id(res.data.data.currency_id);
        setFront_end_base_url(res.data.data.front_end_base_url);
        setBack_end_base_url(res.data.data.back_end_base_url);
        setGoogle_analytics_id(res.data.data.google_analytics_id);
        setFacebook_pixel_id(res.data.data.facebook_pixel_id);
        setLoading(false);
      })
      .catch((error) => console.log(error));

    myAxios("/admin/currency/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCurrencies(res.data.data);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (
      !validateFields([
        site_title,
        meta_description,
        currency_id,
        front_end_base_url,
        back_end_base_url,
      ])
    ) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    const body = {
      site_title,
      meta_description,
      currency_id,
      front_end_base_url,
      back_end_base_url,
      google_analytics_id,
      facebook_pixel_id,
    };

    myAxios
      .post("/admin/app-settings/update", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((p) => !p);
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

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "app-setting");
    if (route?.edit) return true;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة إعدادات التطبيق</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} alt="chevron" />
        <p className="text-light-dark">إعدادات التطبيق</p>
      </div>
      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8">
              <p className="text-xl font-medium text-dark">عنوان الموقع</p>
              <input
                onChange={(e) => setSite_title(e.target.value)}
                value={site_title}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">وصف الميتا</p>
              <input
                onChange={(e) => setMeta_description(e.target.value)}
                value={meta_description}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">العملة</p>
              <select
                onChange={(e) => setCurrency_id(e.target.value)}
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5 form-select focus:ring-0 focus:border-gray"
                value={currency_id}
              >
                {currencies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.currency_code}
                  </option>
                ))}
              </select>

              <p className="text-xl font-medium text-dark mt-5">رابط الموقع الأمامي</p>
              <input
                onChange={(e) => setFront_end_base_url(e.target.value)}
                value={front_end_base_url}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">رابط الموقع الخلفي</p>
              <input
                onChange={(e) => setBack_end_base_url(e.target.value)}
                value={back_end_base_url}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">معرف Google Analytics</p>
              <input
                onChange={(e) => setGoogle_analytics_id(e.target.value)}
                value={google_analytics_id}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />

              <p className="text-xl font-medium text-dark mt-5">معرف Facebook Pixel</p>
              <input
                onChange={(e) => setFacebook_pixel_id(e.target.value)}
                value={facebook_pixel_id}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
            </div>

            <div className="text-end w-full lg:w-3/5">
              {isEditable() && (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-10 py-2 text-lg font-semibold rounded-lg mt-10"
                >
                  تحديث
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppSetting;
