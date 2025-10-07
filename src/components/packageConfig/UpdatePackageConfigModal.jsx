import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useAuth from "../../hooks/useAuth";
import { useFieldArray, useForm } from "react-hook-form";
import myAxios from "../../utils/myAxios";
import toast from "react-hot-toast";

const UpdatePackageConfigModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [data, setData] = useState({});
  const {
    package_advantage,
    title,
    one_month_price,
    six_month_price,
    one_year_price,
    property_count,
    advert_count,
    status,
  } = data;
  const { token } = useAuth();

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      features: [{ icon_type: "", title: "" }],
    },
  });

  const {
    fields: featuresFields,
    append: appendfeature,
    remove: removefeature,
  } = useFieldArray({
    name: "features",
    control,
  });

  useEffect(() => {
    if (id) {
      myAxios(`/admin/package/get-one/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setData(res.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  useEffect(() => {
    const defaultFeatues =
      package_advantage?.map((item) => ({
        icon_type: item.icon_type,
        title: item.title,
        price: 0,
      })) || [];

    setValue("features", defaultFeatues);
    setValue("title", title);
    setValue("one_month_price", one_month_price);
    setValue("six_month_price", six_month_price);
    setValue("one_year_price", one_year_price);
    setValue("property_count", property_count);
    setValue("advert_count", advert_count);
  }, [data]);

  const onSubmit = (data) => {
    const toastId = toast.loading("جاري التحميل...");

    const { features, ...rest } = data;
    const submitableData = {
      ...rest,
      status: 1,
      package_advantage: features,
    };

    myAxios
      .post(`/admin/package/update/${id}`, submitableData, {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  const handleEnable = () => {
    const toastId = toast.loading("جاري التحميل...");

    myAxios
      .post(
        `/admin/package/status-update/${id}`,
        { status: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          toast.dismiss(toastId);
          toast.success("تم التمكين بنجاح!");
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  const handleDisable = () => {
    const toastId = toast.loading("جاري التحميل...");

    myAxios
      .post(
        `/admin/package/status-update/${id}`,
        { status: 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          toast.dismiss(toastId);
          toast.success("تم التعطيل بنجاح!");
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  const titl = (
    <div dir="rtl" className="flex justify-between items-center">
      <p>تحديث الباقة</p>
      <div className="flex gap-4">
        {status ? (
          <button
            onClick={handleDisable}
            className="text-rose-600 bg-light-red border border-red rounded-md px-6 py-1 text-base"
          >
            تعطيل
          </button>
        ) : (
          <button
            onClick={handleEnable}
            className="text-white bg-[#3EA570] border border-[#3EA570] rounded-md px-6 py-1 text-base"
          >
            تمكين
          </button>
        )}
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray rounded-lg p-6 mt-12"
        
      >
        <div>
          <label className="text-sm font-medium text-[#4D5464]">اسم الباقة</label>
          <input
            {...register("title")}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">سعر شهر واحد</label>
          <input
            {...register("one_month_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">سعر 6 أشهر</label>
          <input
            {...register("six_month_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">سعر سنة واحدة</label>
          <input
            {...register("one_year_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">حد العقارات</label>
          <input
            {...register("property_count", { valueAsNumber: true })}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="القيمة"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">حد الإعلانات</label>
          <input
            {...register("advert_count", { valueAsNumber: true })}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="القيمة"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">مميزات الباقة</label>
          <div className="flex flex-col gap-5 mt-5">
            {featuresFields.map((field, index) => (
              <div className="flex items-center gap-5" key={field.id}>
                <select
                  {...register(`features.${index}.icon_type`)}
                  className="form-select focus:ring-0 focus:border-gray border-gray bg-medium-gray h-10 rounded-lg w-3/12 text-dark"
                >
                  <option value="">اختر</option>
                  <option value="check">صح</option>
                  <option value="cross">خطأ</option>
                </select>
                <input
                  {...register(`features.${index}.title`)}
                  type="text"
                  className="rounded-lg p-1 overflow-hidden h-10 form-input focus:ring-0 focus:border-gray border-gray bg-medium-gray w-9/12 text-dark px-3"
                />
                <button
                  onClick={() => removefeature(index)}
                  type="button"
                  className="bg-red text-white px-6 h-10 text-xs font-medium rounded-lg"
                >
                  إزالة
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => appendfeature({})}
            type="button"
            className="bg-[#3EA570] text-white px-8 py-2 font-medium rounded-lg mt-4"
          >
            إضافة
          </button>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#3EA570] px-8 py-2 text-white font-medium rounded-lg mt-4"
          >
            حفظ
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePackageConfigModal;
