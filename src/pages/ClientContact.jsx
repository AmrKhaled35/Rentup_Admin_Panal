import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import trash from "../assets/images/trash.svg";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import Swal from "sweetalert2";

const ClientContact = () => {
  const [query, setQuery] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "client-query");
    return route?.delete;
  };

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/contact-us-data", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setQuery(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [token, refetch]);

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
          .delete(`/admin/contact-us-data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              Swal.fire("تم الحذف!", "تم حذف الرسالة بنجاح.", "success");
              setRefetch((prev) => !prev);
            }
          });
      }
    });
  };

  const columns = [
    {
      name: "الاسم",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      width: "200px",
    },
    {
      name: "البريد الإلكتروني",
      selector: (row) => row.email,
      width: "200px",
    },
    {
      name: "الرسالة",
      cell: (row) => row.details,
      minWidth: "250px",
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isDeletable() && (
            <button onClick={() => handleDelete(row?.id)}>
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
      <p className="text-2xl text-dark font-medium">استفسارات العملاء</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">استفسارات العملاء</p>
      </div>

      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={query} pagination={true} />
        )}
      </div>
    </div>
  );
};

export default ClientContact;
