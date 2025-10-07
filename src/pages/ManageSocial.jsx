import { useEffect, useState } from "react";
import Loading from "../components/shared/Loading";
import pen from "../assets/images/pen.svg";
import iconChevronRight from "../assets/images/chevron-right.svg";
import plus from "../assets/images/plus.svg";
import trash from "../assets/images/trash.svg";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import myAxios from "../utils/myAxios";
import AddSocialModal from "../components/manage/AddSocialModal";
import UpdateSocialModal from "../components/manage/UpdateSocialModal";
import Swal from "sweetalert2";

const ManageSocial = () => {
  const [data, setData] = useState([]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/socials/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "social");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "social");
    return route?.delete;
  };

  const columns = [
    {
      name: "الأيقونة",
      selector: (row) => (
        <div className="bg-green-500 p-1 rounded-lg">
          <img
            src={`${import.meta.env.VITE_IMG_URL}/${row.icon}`}
            className="w-7 h-auto"
          />
        </div>
      ),
      width: "150px",
    },
    {
      name: "الرابط",
      selector: (row) => row.link,
      minWidth: "250px",
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row.id)}>
              <img src={pen} alt="تعديل" />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row.id)}>
              <img src={trash} alt="حذف" />
            </button>
          )}
        </div>
      ),
      width: "80px",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفها!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/socials/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف العنصر بنجاح.", "success");
            }
          });
      }
    });
  };

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة الوسائط الاجتماعية</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} alt=">" />
          <p className="text-light-dark">الوسائط الاجتماعية</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} alt="إضافة" />
              <span>إضافة وسيلة</span>
            </button>
          )}
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={data} pagination={false} />
        )}
      </div>
      <AddSocialModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateSocialModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default ManageSocial;
