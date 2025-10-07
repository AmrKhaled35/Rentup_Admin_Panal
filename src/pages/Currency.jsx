import { Link } from "react-router-dom";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import iconChevronRight from "../assets/images/chevron-right.svg";
import plus from "../assets/images/plus.svg";
import iconSearch from "../assets/images/search.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import AddCurrencyModal from "../components/currency/AddCurrencyModal";
import UpdateCurrencyModal from "../components/currency/UpdateCurrencyModal";
import myAxios from "../utils/myAxios";
import Swal from "sweetalert2";

const Currency = () => {
  const [searchText, setSearchText] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, role, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/currency/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCurrencies(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = currencies.filter((currency) =>
    currency.currency_code.toLowerCase().includes(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "currency");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "currency");
    return route?.delete;
  };

  const columns = [
    {
      name: "العملة",
      selector: (row) => row?.currency_code,
    },
    {
      name: "سعر مقابل الدولار",
      selector: (row) => row?.value,
    },
    {
      name: "رمز العملة",
      selector: (row) => row?.currency_symbol,
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
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26C870",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/currency/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              Swal.fire("تم الحذف!", "تم حذف العملة بنجاح.", "success");
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

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن العملة..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">العملات</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#26C870]">الرئيسية</p>
          </Link>
          <img src={iconChevronRight} alt=">" />
          <p className="text-light-dark">العملات</p>
        </div>
        {role === "Super" && isEditable() && (
          <div>
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-[#26C870]"
            >
              <img src={plus} alt="إضافة" />
              <span>إضافة عملة</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex w-80 h-10">
        {subHeaderComponent}
          <img
            src={iconSearch}
            alt="بحث"
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

      <AddCurrencyModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateCurrencyModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Currency;
