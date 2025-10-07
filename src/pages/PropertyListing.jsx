import React, { useEffect, useRef, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import iconFilter from "../assets/images/filter.svg";
import { Link, useSearchParams } from "react-router-dom";
import myAxios from "../utils/myAxios";
import eye from "../assets/images/eye.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import ListingDetailsModal from "../components/propertyListing/ListingDetailsModal";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const PropertyListingRTL = () => {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [properties, setProperties] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [status, setStatus] = useState(searchParams.get("status"));
  const featured = searchParams.get("featured");
  const filterButtonRef = useRef(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (featured) params.append("featured", featured);

    myAxios(`/admin/property/get-all?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setProperties(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token, status, featured]);

  const filtered = properties?.filter((item) =>
    item?.property_title?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setFilterIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [filterButtonRef]);

  const isEditable = () => permissions?.some(r => r.name === "property-listing" && r.edit);
  const isDeletable = () => permissions?.some(r => r.name === "property-listing" && r.delete);

  const getStatusClass = (status) => {
    switch(status) {
      case "active": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-500 bg-yellow-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "disabled": return "text-gray-500 bg-gray-200";
      default: return "text-gray-500 bg-gray-200";
    }
  };

  const columns = [
    {
      name: "العقار",
      selector: (row) => (
        <div className="py-4 flex items-center gap-2 text-end">
          {row?.get_title_image?.title_img ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.get_title_image?.title_img}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}
          <div className="text-right">
            <p className="text-sm text-dark font-medium mb-1">
              {row?.property_title}
            </p>
            <p className="text-xs text-light-dark">
              {row?.get_breed_type?.breed_name}
            </p>
          </div>
        </div>
      ),
    },
    { name: "الفئة", cell: (row) => row?.get_category?.category_name },
    {
      name: "المدينة",
      selector: (row) => (
        <div className="text-end">
          <p className="text-sm text-light-dark font-medium">{row?.get_city?.city_name}</p>
          <p className="text-xs text-light-dark">{row?.get_city?.city_name}</p>
        </div>
      ),
    },
    { name: "السعر", selector: (row) => <p>${row?.price}</p> },
    {
      name: "الحالة",
      selector: (row) => (
        <p className={`${getStatusClass(row?.status)} rounded-full px-3 py-1`}>
          {row?.status === "active" ? "نشط" :
           row?.status === "pending" ? "قيد الانتظار" :
           row?.status === "rejected" ? "مرفوض" :
           row?.status === "disabled" ? "معطل" : row?.status}
        </p>
      ),
    },
    { name: "الحالة المميزة", selector: (row) => (row?.is_boosting ? "مميز" : "غير مميز") },
    {
      name: "المستخدم",
      selector: (row) => (
        <Link to={`/users-properties/${row?.get_property_user?.id}`} className="text-sky-600">
          {row?.get_property_user?.name}
        </Link>
      ),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row?.id)}>
              <img src={eye} />
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/property/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف العقار بنجاح.", "success");
            }
          });
      }
    });
  };

  const handleModal = (id) => {
    setIsOpen(true);
    setModalId(id);
  };

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-l border-l-gray rounded-l-lg w-full text-right"
      placeholder="ابحث عن العقار..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">جميع العقارات</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium flex-row-reverse">
        <Link to="/">
          <p className="text-green-600">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">قائمة العقارات</p>
      </div>
      <div className="flex justify-between items-center gap-4 mt-6">
        <div className="flex lg:max-w-xs h-10">
          
        <img src={iconSearch} className="bg-white border-r border-r-gray border-y border-y-gray rounded-r-lg" />
        {subHeaderComponent}
        </div>
        <div className="flex items-center gap-4">
          <button
            ref={filterButtonRef}
            onClick={() => setFilterIsOpen((prev) => !prev)}
            className="flex items-center border border-gray rounded-lg px-[14px] h-10 bg-white text-light-dark outline-none relative"
          >
            <img src={iconFilter} />
            <span>الفلاتر</span>
            {filterIsOpen && (
              <div className="absolute top-10 left-0 min-w-[150px] rounded-lg bg-white shadow-[0_14px_19px_0px_rgba(0,83,40,0.16)] z-10">
                <div className="py-2" role="menu" aria-orientation="vertical">
                  <p onClick={() => setStatus("")} className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-600 cursor-pointer block">الكل</p>
                  <p onClick={() => setStatus("active")} className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-600 cursor-pointer block">نشط</p>
                  <p onClick={() => setStatus("pending")} className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-600 cursor-pointer block">قيد الانتظار</p>
                  <p onClick={() => setStatus("rejected")} className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-600 cursor-pointer block">مرفوض</p>
                  <p onClick={() => setStatus("disabled")} className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-600 cursor-pointer block">معطل</p>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pagination
            subHeaderComponent={subHeaderComponent}
            responsive
            direction="rtl"
          />
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

export default PropertyListingRTL;
