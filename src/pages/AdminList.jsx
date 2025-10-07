import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddAdminModal from "../components/admin/AddAdminModal";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import Swal from "sweetalert2";
import UpdateAdminModal from "../components/admin/UpdateAdminModal";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";

const AdminList = () => {
  const [searchText, setSearchText] = useState("");
  const [admins, setAdmins] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, role } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/admin/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAdmins(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = admins?.filter((item) =>
    item.username.toLowerCase().match(searchText.toLowerCase())
  );

  const columns = [
    { name: "المسؤول", selector: (row) => row.username },
    { name: "البريد الإلكتروني", selector: (row) => row.email },
    { name: "نوع المسؤول", selector: (row) => row.admin_type?.type },
    { name: "تاريخ الإضافة", selector: (row) => dayjs(row.created_at).format("D MMM YYYY") },
    {
      name: "إجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {role === "Super" && (
            <>
              <button onClick={() => handleModal(row.id)}>
                <img src={pen} />
              </button>
              <button onClick={() => handleDelete(row.id)}>
                <img src={trash} />
              </button>
            </>
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
      confirmButtonColor: "#3EA570", 
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/admin/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف المسؤول بنجاح.", "success");
            }
          })
          .catch((err) => toast.error(err?.response?.data?.message));
      }
    });
  };

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن مسؤول..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">المسؤولين</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">قائمة المسؤولين</p>
        </div>
        <div>
          {role === "Super" && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} />
              <span>إضافة مسؤول</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex w-80 h-10">
        {subHeaderComponent}
          <img
            src={iconSearch}
            className="bg-white border-l border-l-gray border-y border-y-gray rounded-l-lg"
          />
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pagination
            subHeaderComponent={subHeaderComponent}
          />
        )}
      </div>
      <AddAdminModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateAdminModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default AdminList;
