import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddListingTypeModal from "../components/propertyListing/AddListingTypeModal";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import UpdateListingTypeModal from "../components/propertyListing/UpdateListingTypeModal";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const ListingType = () => {
  const [searchText, setSearchText] = useState("");
  const [listingTypes, setListingTypes] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/listing-types/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setListingTypes(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = listingTypes.filter((listingType) =>
    listingType.listing_name.toLowerCase().match(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "listing-type");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "listing-type");
    return route?.delete;
  };

  const columns = [
    {
      name: "نوع العقار",
      selector: (row) => row?.listing_name,
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
      text: "لا يمكنك التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/listing-types/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف النوع بنجاح.", "success");
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
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن نوع العقار..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">أنواع العقارات</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">الرئيسية</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">نوع العقار</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} />
              <span>إضافة نوع عقار</span>
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
      <AddListingTypeModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateListingTypeModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default ListingType;
