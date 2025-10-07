import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import plus from "../assets/images/plus.svg";
import Swal from "sweetalert2";

const CreateAdminRole = () => {
  const [adminTypes, setAdminTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (token) {
      myAxios("/admin/admin-type/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setAdminTypes(res.data.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refetch]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "create-role");
    return route?.edit;
  };

  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "create-role");
    return route?.delete;
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/admin-type/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف الصلاحية بنجاح.", "success");
            }
          });
      }
    });
  };

  const columns = [
    {
      name: "اسم الصلاحية",
      selector: (row) => row.type,
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button>
              <Link to={`/edit-role/${row.id}`}>
                <img src={pen} alt="تعديل" />
              </Link>
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row.id)}>
              <img src={trash} alt="حذف" />
            </button>
          )}
        </div>
      ),
      width: "100px",
    },
  ];

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">الصلاحيات و الأدوار</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">الصلاحيات و الأدوار</p>
        </div>
        {isEditable() && (
          <Link to="/create-role/new">
            <button className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500">
              <img src={plus} alt="إضافة" />
              <span>إضافة صلاحية</span>
            </button>
          </Link>
        )}
      </div>
      <div className="border border-gray rounded-lg mt-6">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={adminTypes}
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default CreateAdminRole;
