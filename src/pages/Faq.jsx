import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddFaqModal from "../components/faq/AddFaqModal";
import UpdateFaqModal from "../components/faq/UpdateFaqModal";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const Faq = () => {
  const [searchText, setSearchText] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/faq/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setFaqs(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  // فلترة الأسئلة حسب النص المدخل
  const filtered = faqs.filter((faq) =>
    faq?.qua?.toLowerCase().includes(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "faq");
    return route?.edit;
  };

  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "faq");
    return route?.delete;
  };

  const columns = [
    {
      name: "السؤال",
      selector: (row) => row.qua,
      width: "300px",
    },
    {
      name: "الإجابة",
      cell: (row) => row.ans,
      minWidth: "300px",
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4 justify-end pr-6 w-24">
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
      width: "120px",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفها!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/faq/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف السؤال بنجاح.", "success");
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
      <p className="text-2xl text-dark font-medium">الأسئلة الشائعة</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">الرئيسية</p>
          </Link>
          <img src={iconChevronRight} alt=">" />
          <p className="text-light-dark">الأسئلة الشائعة</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} alt="إضافة" />
              <span>إضافة سؤال</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex w-80 h-10">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            name="search"
            className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full px-3"
            placeholder="ابحث عن سؤال..."
          />
          <img
            src={iconSearch}
            alt="بحث"
            className="bg-white border-l border-l-gray border-y border-y-gray rounded-l-lg p-2"
          />
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={filtered} pagination={true} />
        )}
      </div>
      <AddFaqModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateFaqModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Faq;
