import { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import { Link } from "react-router-dom";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ManageFooter = () => {
  const [data, setData] = useState({});
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [mail, setMail] = useState("");
  const [copyright, setCopyright] = useState("");
  const [googlePlay, setGooglePlay] = useState("");
  const [appStore, setAppStore] = useState("");
  const [logo, setLogo] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/footer_section/get", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setData(res.data.data);
        setAddress(res.data.data.address);
        setNumber(res.data.data.number);
        setMail(res.data.data.mail);
        setCopyright(res.data.data.copyright);
        setGooglePlay(res.data.data.google_play);
        setAppStore(res.data.data.app_store);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (!validateFields([number, address, mail, copyright, googlePlay, appStore])) {
      return toast.error("يرجى تعبئة جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحميل...");
    const formData = new FormData();
    if (logo) formData.append("footer_logo", logo);
    formData.append("number", number);
    formData.append("address", address);
    formData.append("mail", mail);
    formData.append("copyright", copyright);
    formData.append("google_play", googlePlay);
    formData.append("app_store", appStore);

    myAxios
      .post("/admin/footer_section/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          toast.success("تم التحديث بنجاح");
          setRefetch((p) => !p);
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
    const route = permissions?.find((route) => route.name === "footer");
    return route?.edit;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة الفوتر</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} alt=">" />
        <p className="text-light-dark">إدارة الفوتر</p>
      </div>
      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8">
              <p className="text-xl font-medium text-dark">إضافة شعار</p>
              <div className="bg-green-500 mt-4 p-2 w-max rounded-lg">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/${data?.footer_logo}`}
                  alt="شعار الفوتر"
                  className="w-72 h-auto"
                />
              </div>
              <input
                onChange={(e) => setLogo(e.target.files[0])}
                type="file"
                accept="image/*"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark"
              />
              <p className="text-xl font-medium text-dark mt-5">العنوان</p>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">رقم الهاتف</p>
              <input
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">البريد الإلكتروني</p>
              <input
                onChange={(e) => setMail(e.target.value)}
                value={mail}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">حقوق النشر</p>
              <input
                onChange={(e) => setCopyright(e.target.value)}
                value={copyright}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">رابط Google Play</p>
              <input
                onChange={(e) => setGooglePlay(e.target.value)}
                value={googlePlay}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">رابط App Store</p>
              <input
                onChange={(e) => setAppStore(e.target.value)}
                value={appStore}
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

export default ManageFooter;
