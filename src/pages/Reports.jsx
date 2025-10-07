import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import Loading from "../components/shared/Loading";
import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import eye from "../assets/images/eye.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import ListingDetailsModal from "../components/propertyListing/ListingDetailsModal";
import Swal from "sweetalert2";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/reports/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setReports(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "report");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "report");
    return route?.delete;
  };

  const columns = [
    {
      name: "اسم التقرير",
      cell: (row) => row.title,
      width: "250px",
    },
    {
      name: "الوصف",
      cell: (row) => row?.description,
      minWidth: "250px",
    },
    {
      name: "المستخدم",
      cell: (row) => (
        <Link to={`/users/${row?.user_id}`}>
          <p>{row?.user?.name}</p>
          <p className="mt-1">{row?.user?.email}</p>
        </Link>
      ),
      width: "250px",
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button
              onClick={() => handleModal(row?.property_id)}
              className="text-green-500"
            >
              <img src={eye} />
            </button>
          )}
          {isDeletable() && (
            <button
              onClick={() => handleDelete(row?.id)}
              className="text-red-500"
            >
              <img src={trash} />
            </button>
          )}
        </div>
      ),
      width: "120px",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570", // أخضر
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/reports/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف التقرير بنجاح.", "success");
            }
          });
      }
    });
  };

  const handleModal = (id) => {
    setIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">التقارير</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">الرئيسية</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">التقارير</p>
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 !overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={reports} pagination={true} />
        )}
      </div>
      <ListingDetailsModal
        id={modalId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Reports;
