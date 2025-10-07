import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddCategoryModal from "../components/category/AddCategoryModal";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import UpdateCategoryModal from "../components/category/UpdateCategoryModal";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";

const Category = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/categories/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));

    myAxios("/admin/facility/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setFacilities(res.data.data))
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const isEditable = () => permissions?.some((r) => r.name === "category" && r.edit);
  const isDeletable = () => permissions?.some((r) => r.name === "category" && r.delete);

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/categories/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف الملف بنجاح.", "success");
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

  const columns = [
    {
      name: "اسم التصنيف",
      selector: (row) => (
        <div className="py-4 w-[250px] text-end flex items-center gap-2" dir="rtl">
          {row?.banner ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.banner}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}
          <span>{row?.category_name}</span>
        </div>
      ),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4" dir="rtl">
          {isEditable() && (
            <button onClick={() => handleModal(row.id)}>
              <img src={pen} />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row.id)}>
              <img src={trash} />
            </button>
          )}
        </div>
      ),
      width: "100px",
    },
  ];

  const subHeaderComponent = (
    <div className="flex w-80 h-10" dir="rtl">
      <input
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        name="search"
        placeholder="ابحث عن التصنيف..."
        className="outline-none border-y border-y-gray border-l border-l-gray rounded-l-lg w-full text-right px-3"
      />
      <img
        src={iconSearch}
        className="bg-white border-r border-r-gray border-y border-y-gray rounded-r-lg"
      />
    </div>
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">التصنيفات</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium" dir="rtl">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">التصنيفات</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} />
              <span>إضافة تصنيف</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 border border-gray rounded-lg overflow-hidden">
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

      <AddCategoryModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
        facilities={facilities}
      />
      <UpdateCategoryModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
        facilities={facilities}
      />
    </div>
  );
};

export default Category;
