import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import toast from "react-hot-toast";
import Loading from "../components/shared/Loading";

const ManageAds = () => {
  const [homepage_add_1, setHomepage_add_1] = useState(null);
  const [homepage_add_2, setHomepage_add_2] = useState(null);
  const [filter_page_add, setFilter_page_add] = useState(null);
  const [details_page_add, setDetails_page_add] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/google-ads/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setHomepage_add_1(res.data.data.homepage_add_1);
        setHomepage_add_2(res.data.data.homepage_add_2);
        setFilter_page_add(res.data.data.filter_page_add);
        setDetails_page_add(res.data.data.details_page_add);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    const toastId = toast.loading("جاري التحميل...");
    const body = {
      homepage_add_1,
      homepage_add_2,
      filter_page_add,
      details_page_add,
    };

    myAxios
      .post("/admin/google-ads/update", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((p) => !p);
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

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "ads");
    if (route.edit) return true;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة الإعلانات</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">إعدادات الإعلانات</p>
      </div>
      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8">
              <p className="text-xl font-medium text-dark">إعلان الصفحة الرئيسية 1</p>
              <input
                onChange={(e) => setHomepage_add_1(e.target.value)}
                value={homepage_add_1}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">
                إعلان الصفحة الرئيسية 2
              </p>
              <input
                onChange={(e) => setHomepage_add_2(e.target.value)}
                value={homepage_add_2}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">
                إعلان صفحة الفلترة
              </p>
              <input
                onChange={(e) => setFilter_page_add(e.target.value)}
                value={filter_page_add}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">
                إعلان صفحة تفاصيل العقار
              </p>
              <input
                onChange={(e) => setDetails_page_add(e.target.value)}
                value={details_page_add}
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

export default ManageAds;
