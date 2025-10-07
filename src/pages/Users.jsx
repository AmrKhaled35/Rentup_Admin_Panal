import React, { useEffect, useRef, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link, useSearchParams } from "react-router-dom";
import myAxios from "../utils/myAxios";
import eye from "../assets/images/eye.svg";
import trash from "../assets/images/trash.svg";
import iconFilter from "../assets/images/filter.svg";
import defaultUser from "../assets/images/defaultUser.jpg";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const Users = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status"));
  const number = searchParams.get("number");
  const email = searchParams.get("email");
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const filterButtonRef = useRef(null);
  const [refetch, setRefetch] = useState(true);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios(
      `/admin/users${status ? `?status=${status}` : ""}${
        number ? `?is_number_verified=${number}` : ""
      }${email ? `?is_email_verified=${email}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token, status, number, email]);

  const filtered = users.filter((user) =>
    user.name.toLowerCase().match(searchText.toLowerCase())
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

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "users");
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "users");
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "المستخدم",
      selector: (row) => (
        <div className="py-4 flex items-center gap-2 text-start">
          {row?.user_image ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.user_image}`}
              width={44}
              height={44}
            />
          ) : (
            <img src={defaultUser} width={44} height={44} />
          )}
          <p className="text-sm text-dark font-medium">{row?.name}</p>
        </div>
      ),
    },
    {
      name: "البريد الإلكتروني",
      selector: (row) => row?.email,
    },
    {
      name: "الهاتف",
      selector: (row) => row?.phone,
    },
    {
      name: "البلد",
      selector: (row) => (
        <>
          <p className="text-sm text-light-dark font-medium">
            {row?.country?.country_name}
          </p>
          <p className="text-xs text-light-dark">{row?.city?.city_name}</p>
        </>
      ),
    },
    {
      name: "نوع المستخدم",
      selector: (row) => row?.user_type?.type,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status
              ? "text-green-500 bg-green-500/10"
              : "text-red bg-light-red"
          } rounded-full px-3 py-1`}
        >
          {row?.status ? "نشط" : "محظور"}
        </p>
      ),
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) => dayjs(row?.created_at).format("D MMM YYYY"),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <Link to={`/users/${row?.id}`}>
              <button>
                <img src={eye} />
              </button>
            </Link>
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
        myAxios.delete(`/users/${id}`).then((res) => {
          if (res.data.status === "success") {
            setRefetch((prev) => !prev);
            Swal.fire("تم الحذف!", "تم حذف المستخدم بنجاح.", "success");
          }
        });
      }
    });
  };

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="ابحث عن مستخدم..."
    />
  );

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">جميع المستخدمين</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">المستخدمين</p>
      </div>
      <div className="flex justify-between items-center gap-4 mt-6">
        <div className="flex lg:max-w-xs h-10">
        {subHeaderComponent}

          <img
            src={iconSearch}
            className="bg-white border-l border-l-gray border-y border-y-gray rounded-l-lg"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            ref={filterButtonRef}
            onClick={() => setFilterIsOpen((prev) => !prev)}
            className="flex items-center border border-gray rounded-lg px-[14px] h-10 bg-white text-light-dark  outline-none relative"
          >
            <img src={iconFilter} />
            <span>الفلاتر</span>
            {filterIsOpen && (
              <div className="absolute top-10 right-0 min-w-[150px] rounded-lg bg-white shadow-[0_14px_19px_0px_rgba(0,83,40,0.16)] z-10">
                <div
                  className="py-2"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <p
                    onClick={() => setStatus("")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-500 cursor-pointer block"
                    role="menuitem"
                  >
                    <span>الكل</span>
                  </p>
                  <p
                    onClick={() => setStatus("1")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-500 cursor-pointer block"
                    role="menuitem"
                  >
                    <span>نشط</span>
                  </p>
                  <p
                    onClick={() => setStatus("false")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-green-500 cursor-pointer block"
                    role="menuitem"
                  >
                    <span>محظور</span>
                  </p>
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
          <DataTable
            columns={columns}
            data={filtered}
            pagination={true}
            subHeaderComponent={subHeaderComponent}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
