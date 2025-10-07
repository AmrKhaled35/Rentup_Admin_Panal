import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loading from "../components/shared/Loading";
import { useForm } from "react-hook-form";
import myAxios from "../utils/myAxios";
import toast from "react-hot-toast";
import { paths } from "../constants";

const generateDefaultValues = (data) => {
  return paths.reduce((acc, path) => {
    const route = data?.find((item) => item.name === path);
    if (route) {
      acc.push({
        name: path,
        view: route.view,
        edit: route.edit,
        delete: route.delete,
      });
    }
    return acc;
  }, []);
};

const EditRolePermission = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const { token } = useAuth();

  const routes = useMemo(
    () => generateDefaultValues(data?.role_parameters),
    [data]
  );

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    setLoading(true);
    myAxios(`/admin/admin-type/get-one/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [token, refetch]);

  useEffect(() => {
    setValue("type", data.type);
  }, [data, setValue]);

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
      .post(`/admin/admin-type/update/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          toast.success("تم تحديث الصلاحية بنجاح");
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
    <form dir="rtl" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xl font-medium text-dark">اسم الصلاحية</p>
      <input
        {...register("type")}
        type="text"
        className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none mt-5 text-sm text-light-dark px-5"
        required
      />
      <div className="border border-gray rounded-lg mt-6">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={routes} pagination={false} />
        )}
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

export default EditRolePermission;
