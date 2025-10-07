import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import { useMemo } from "react";
import { paths } from "../constants";

const generateDefaultValues = () =>
  paths.reduce((acc, path) => {
    acc.push({ name: path, view: 1, edit: 1, delete: 1 });
    return acc;
  }, []);

const AddRolePermission = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const routes = useMemo(() => generateDefaultValues(), []);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const toastId = toast.loading("جاري التحميل...");
    const { type, ...rest } = data;
    const role_parameters = Object.entries(rest).map(
      ([name, { view, edit, delete: del }]) => ({
        name,
        view: view ? 1 : 0,
        edit: edit ? 1 : 0,
        delete: del ? 1 : 0,
      })
    );

    const body = {
      type,
      role_parameters,
    };

    myAxios
      .post("/admin/admin-type/add", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          toast.success("تم إضافة الصلاحية بنجاح");
          navigate("/create-role");
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message || "حدث خطأ ما");
      });
  };

  const columns = [
    {
      name: "اسم المسار",
      selector: (row) => row.name,
    },
    {
      name: "عرض",
      selector: (row) => (
        <input
          {...register(`${row.name}.view`, { valueAsNumber: true })}
          type="checkbox"
          className="form-checkbox rounded-md text-green-500 focus:ring-0"
          defaultChecked={row.view}
        />
      ),
    },
    {
      name: "تعديل",
      selector: (row) => (
        <input
          {...register(`${row.name}.edit`, { valueAsNumber: true })}
          type="checkbox"
          className="form-checkbox rounded-md text-green-500 focus:ring-0"
          defaultChecked={row.edit}
        />
      ),
    },
    {
      name: "حذف",
      selector: (row) => (
        <input
          {...register(`${row.name}.delete`, { valueAsNumber: true })}
          type="checkbox"
          className="form-checkbox rounded-md text-green-500 focus:ring-0"
          defaultChecked={row.delete}
        />
      ),
    },
  ];

  return (
    <form  dir= "rtl" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xl font-medium text-dark">اسم الصلاحية</p>
      <input
        {...register("type")}
        type="text"
        className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
        required
      />
      <div className="border border-gray rounded-lg mt-6">
        <DataTable columns={columns} data={routes} pagination={false} />
      </div>
      <div className="text-end w-full">
        <button
          type="submit"
          className="bg-green-500 text-white px-10 py-2 text-lg font-semibold rounded-lg mt-10"
        >
          حفظ
        </button>
      </div>
    </form>
  );
};

export default AddRolePermission;
