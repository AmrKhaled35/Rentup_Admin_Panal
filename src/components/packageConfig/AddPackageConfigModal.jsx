import Modal from "../ui/Modal";
import { useFieldArray, useForm } from "react-hook-form";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const AddPackageConfigModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const { token } = useAuth();
  const { register, handleSubmit, control, reset } = useForm({
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

  const onSubmit = (data) => {
    const toastId = toast.loading("جاري التحميل...");
    const { features, ...rest } = data;
    const submitableData = {
      ...rest,
      status: 1,
      package_advantage: features,
    };

    myAxios
      .post("/admin/package/add", submitableData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          reset();
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

  const titl = (
    <div  dir="rtl" className="flex justify-between items-center">
      <p>إضافة باقة</p>
      <div className="flex gap-4">
        <button
          onClick={() => setIsOpen(false)}
          className="text-red bg-light-red border border-red rounded-md px-6 py-1"
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
          <label className="text-sm font-medium text-[#4D5464]">
            سعر شهر واحد
          </label>
          <input
            {...register("one_month_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            سعر 6 أشهر
          </label>
          <input
            {...register("six_month_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            سعر سنة واحدة
          </label>
          <input
            {...register("one_year_price")}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            حد العقارات
          </label>
          <input
            {...register("property_count", { valueAsNumber: true })}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="القيمة"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            حد الإعلانات
          </label>
          <input
            {...register("advert_count", { valueAsNumber: true })}
            type="number"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1 outline-none"
            placeholder="القيمة"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">
            مميزات الباقة
          </label>
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

export default AddPackageConfigModal;
