import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import myAxios from "./../utils/myAxios";
import plus from "../assets/images/plus.svg";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import eye from "../assets/images/eye.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import AddPageModal from "../components/pages/AddPageModal";
import PageDetailsModal from "../components/pages/PageDetailsModal";
import UpdatePageModal from "../components/pages/UpdatePageModal";

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [viewIsOpen, setViewIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/more-page/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setPages(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "pages");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "pages");
    return route?.delete;
  };

  const columns = [
    {
      name: "العنوان",
      selector: (row) => row?.title,
    },
    {
      name: "التاريخ",
      selector: (row) => dayjs(row?.created_at).format("D MMM YYYY"),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          <button onClick={() => handleViewModal(row?.slug)}>
            <img src={eye} alt="عرض" />
          </button>
          {isEditable() && (
            <button onClick={() => handleUpdateModal(row?.slug)}>
              <img src={pen} alt="تعديل" />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row?.id)}>
              <img src={trash} alt="حذف" />
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
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a", // green-500
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/more-page/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف الصفحة بنجاح.", "success");
            }
          });
      }
    });
  };

  const handleUpdateModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  const handleViewModal = (id) => {
    setViewIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">جميع الصفحات</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} alt=">" />
          <p className="text-light-dark">الصفحات</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} alt="إضافة" />
              <span>إضافة صفحة</span>
            </button>
          )}
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={pages}
            pagination={false}
          />
        )}
      </div>
      <AddPageModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <PageDetailsModal
        id={modalId}
        isOpen={viewIsOpen}
        setIsOpen={setViewIsOpen}
      />
      <UpdatePageModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Pages;
