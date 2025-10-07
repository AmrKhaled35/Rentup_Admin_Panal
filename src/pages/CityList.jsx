import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddCityModal from "../components/city/AddCityModal";
import Swal from "sweetalert2";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import UpdateCityModal from "../components/city/UpdateCityModal";
import DataTable from "react-data-table-component";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";

const CityList = () => {
  const [searchText, setSearchText] = useState("");
  const [cities, setCities] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/city/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCities(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = cities.filter((city) =>
    city.city_name.toLowerCase().match(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "city-list");
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "city-list");
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "المدينة",
      selector: (row) => row?.city_name,
    },
    {
      name: "الدولة",
      selector: (row) => row?.country?.country_name,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status
              ? "text-[#26C870] bg-[#26C870]/10"
              : "text-red bg-light-red"
          } rounded-full px-3 py-1`}
        >
          {row?.status ? "متاحة" : "غير متاحة"}
        </p>
      ),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row?.id)}>
              <img src={pen} />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row?.id)}>
              <img src={trash} />
            </button>
          )}
        </div>
      ),
      width: "100px",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26C870",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/city/delete/${id}`, {
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

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن مدينة..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">المدن</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#26C870]">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">قائمة المدن</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-[#26C870]"
            >
              <img src={plus} />
              <span>إضافة مدينة</span>
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
        <div className="flex items-center gap-4"></div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pagination={true}
            subHeaderComponent={subHeaderComponent}
          />
        )}
      </div>
      <AddCityModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateCityModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        setRefetch={setRefetch}
        id={modalId}
      />
    </div>
  );
};

export default CityList;
