import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import AddFacilityModal from "../components/facilities/AddFacilityModal";
import UpdateFacilityModal from "../components/facilities/UpdateFacilityModal";

const Facilities = () => {
  const [searchText, setSearchText] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/facility/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setFacilities(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = facilities.filter((facility) =>
    facility.title.toLowerCase().match(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "facilities");
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "facilities");
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "اسم الميزة",
      selector: (row) => row.title,
    },
    {
      name: "الأيقونة",
      selector: (row) => (
        <div className="flex items-center gap-2 text-start">
          {row?.icon ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.icon}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}
        </div>
      ),
    },
    {
      name: "النوع",
      selector: (row) => row.type,
    },
    {
      name: "معلومات إضافية",
      selector: (row) => row.additional_info,
    },
    {
      name: "إجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/facility/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف البيانات بنجاح.", "success");
            }
          });
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
      dir="rtl"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن الميزة..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إدارة المزايا</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">المزايا</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} />
              <span>إضافة ميزة</span>
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
          />
        )}
      </div>
      <AddFacilityModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateFacilityModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Facilities;
