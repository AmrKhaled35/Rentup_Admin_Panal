import { useEffect, useState } from "react";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ManageAboutUs = () => {
  const [data, setData] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [propertySale, setPropertySale] = useState(null);
  const [propertyRent, setPropertyRent] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);
  const [image, setImage] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/about_section/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setSectionTitle(res.data.data.section_title);
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
        setPropertySale(res.data.data.property_sale);
        setPropertyRent(res.data.data.property_rent);
        setRating(res.data.data.rating);
        setReview(res.data.data.review);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (
      !validateFields([
        sectionTitle,
        title,
        content,
        propertySale,
        propertyRent,
        rating,
        review,
      ])
    ) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جار التحميل...");
    const formData = new FormData();
    formData.append("section_title", sectionTitle);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("property_sale", propertySale);
    formData.append("property_rent", propertyRent);
    formData.append("rating", rating);
    formData.append("review", review);
    if (image) {
      formData.append("img", image);
    }

    myAxios
      .post("/admin/about_section/update", formData, {
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
        toast.error(err?.response?.data?.message || "حدث خطأ ما");
      });
  };

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "about-us");
    if (route?.edit) return true;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة قسم من نحن</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} alt=">" />
        <p className="text-light-dark">من نحن</p>
      </div>
      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8">
              <p className="text-xl font-medium text-dark">عنوان القسم</p>
              <input
                onChange={(e) => setSectionTitle(e.target.value)}
                value={sectionTitle}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">العنوان</p>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">المحتوى</p>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="w-full lg:w-3/5 h-28 px-5 py-2 mt-4 border border-gray rounded-lg resize-none outline-none text-sm text-light-dark"
              />
              <p className="text-xl font-medium text-dark mt-5">
                عدد العقارات المباعة
              </p>
              <input
                onChange={(e) => setPropertySale(e.target.value)}
                value={propertySale}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">
                عدد العقارات للإيجار
              </p>
              <input
                onChange={(e) => setPropertyRent(e.target.value)}
                value={propertyRent}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">التقييم</p>
              <input
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">المراجعات</p>
              <input
                onChange={(e) => setReview(e.target.value)}
                value={review}
                type="text"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
              />
              <p className="text-xl font-medium text-dark mt-5">إضافة صورة</p>
              <img
                src={`${import.meta.env.VITE_IMG_URL}/${data?.img}`}
                alt="الصورة"
                className="w-72 h-auto mt-4"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                accept="image/*"
                className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark"
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

export default ManageAboutUs;
