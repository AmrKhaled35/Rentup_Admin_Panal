import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "./../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddCountryModal from "../components/country/AddCountryModal";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import UpdateCountryModal from "../components/country/UpdateCountryModal";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const CountryList = () => {
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/country/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCountries(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = countries?.filter((item) =>
    item.country_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "country-list");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "country-list");
    return route?.delete;
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26C870",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/country/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              Swal.fire("تم الحذف!", "تم حذف الدولة بنجاح.", "success");
              setRefetch((prev) => !prev);
            }
          });
      }
    });
  };

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  const columns = [
    {
      name: "اسم الدولة",
      selector: (row) => row?.country_name,
      sortable: true,
    },
    {
      name: "التاريخ",
      selector: (row) => dayjs(row?.created_at).format("D MMM YYYY"),
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status ? "text-[#26C870] bg-[#26C870]/10" : "text-red bg-light-red"
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
      width: "120px",
    },
  ];

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن الدولة..."
    />
  );

  return (
    <div dir="rtl" className="text-right">
      <p className="text-2xl text-dark font-medium">الدول</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#26C870]">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">الدول</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-[#26C870]"
            >
              <img src={plus} />
              <span>إضافة دولة</span>
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
            pagination={true}
            subHeaderComponent={subHeaderComponent}
            customStyles={{
              headCells: { style: { textAlign: "right" } },
              cells: { style: { textAlign: "right" } },
            }}
          />
        )}
      </div>
      <AddCountryModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateCountryModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default CountryList;
