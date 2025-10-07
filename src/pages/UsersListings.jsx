import { Link, useParams, useSearchParams } from "react-router-dom";
import myAxios from "../utils/myAxios";
import { useEffect, useRef, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import iconFilter from "../assets/images/filter.svg";
import eye from "../assets/images/eye.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import ListingDetailsModal from "../components/propertyListing/ListingDetailsModal";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const UsersListings = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [status, setStatus] = useState(searchParams.get("status"));
  const filterButtonRef = useRef(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios(
      `/admin/get-property-by-user/${id}${status ? `?status=${status}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        setProperties(res.data.data.propertyByUser);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, id, token, status]);

  const filtered = properties.filter((item) =>
    item.property_title.toLowerCase().includes(searchText.toLowerCase())
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
  }, []);

  const columns = [
    {
      name: "العقار",
      selector: (row) => (
        <div className="py-4 flex items-center gap-2 text-start">
          {row?.get_title_image?.title_img ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.get_title_image?.title_img}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}
          <div>
            <p className="text-sm text-dark font-medium mb-1">{row?.property_title}</p>
            <p className="text-xs text-light-dark">{row?.get_breed_type?.breed_name}</p>
          </div>
        </div>
      ),
    },
    {
      name: "التصنيف",
      cell: (row) => row?.get_category?.category_name,
    },
    {
      name: "المدينة",
      selector: (row) => row?.get_city?.city_name,
    },
    {
      name: "السعر",
      selector: (row) => <p>${row?.price}</p>,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status === "active"
              ? "text-green-500 bg-green-100"
              : "text-red-500 bg-red-100"
          } rounded-full px-3 py-1`}
        >
          {row?.status === "active"
            ? "نشط"
            : row?.status === "pending"
            ? "معلق"
            : row?.status === "rejected"
            ? "مرفوض"
            : "معطل"}
        </p>
      ),
    },
    {
      name: "تعزيز",
      selector: (row) => (row?.is_boosting ? "معزز" : "غير معزز"),
    },
    {
      name: "المستخدم",
      selector: (row) => (
        <Link to={`/users-properties/${row?.get_property_user?.id}`}>
          {row?.get_property_user?.name}
        </Link>
      ),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          <button onClick={() => handleModal(row?.id)}>
            <img src={eye} />
          </button>
          <button onClick={() => handleDelete(row?.id)}>
            <img src={trash} />
          </button>
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
      confirmButtonText: "نعم، احذفها!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios.delete(`/pet-listings/${id}`).then(() => {
          setRefetch((prev) => !prev);
          Swal.fire("تم الحذف!", "تم حذف العقار بنجاح.", "success");
        });
      }
    });
  };

  const handleModal = (id) => {
    setIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">عقارات المستخدم</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">قائمة العقارات</p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex w-80 h-10">
          <img
            src={iconSearch}
            className="bg-white border-l border-l-gray border-y border-y-gray rounded-l-lg"
          />
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            name="search"
            className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
            placeholder="ابحث عن عقار..."
          />
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
              <div className="absolute top-10 right-0 min-w-[150px] rounded-lg bg-white shadow-[0_14px_19px_0px_rgba(0,83,40,0.16)] z-10">
                <div className="py-2" role="menu" aria-orientation="vertical">
                  {["", "active", "pending", "rejected", "disabled"].map((s) => (
                    <p
                      key={s}
                      onClick={() => setStatus(s)}
                      className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-500 cursor-pointer block"
                    >
                      {s === ""
                        ? "الكل"
                        : s === "active"
                        ? "نشط"
                        : s === "pending"
                        ? "معلق"
                        : s === "rejected"
                        ? "مرفوض"
                        : "معطل"}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={filtered} pagination={true} />
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

export default UsersListings;
