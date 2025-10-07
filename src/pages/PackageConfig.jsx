import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import plus from "../assets/images/plus.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import AddPackageConfigModal from "../components/packageConfig/AddPackageConfigModal";
import UpdatePackageConfigModal from "../components/packageConfig/UpdatePackageConfigModal";

const PackageConfig = () => {
  const [data, setData] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/package/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "package");
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "package");
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "الاسم",
      selector: (row) => row?.title,
    },
    {
      name: "المدة",
      selector: (row) => row?.duration,
    },
    {
      name: "السعر",
      selector: (row) => row?.price,
    },
    {
      name: "حد العقارات",
      selector: (row) => row?.property_count,
    },
    {
      name: "حد الإعلانات",
      selector: (row) => row?.advert_count,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status ? "text-[#3EA570] bg-[#3EA570]/10" : "text-red bg-light-red"
          } rounded-full px-3 py-1`}
        >
          {row?.status ? "مفعل" : "معطل"}
        </p>
      ),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row?.id)}>
              <img src={pen} alt="Edit" />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row?.id)}>
              <img src={trash} alt="Delete" />
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
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/package/delete/${id}`, {
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

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إعدادات الباقات</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#3EA570]">الرئيسية</p>
          </Link>
          <img src={iconChevronRight} alt="chevron" />
          <p className="text-light-dark">إعدادات الباقات</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-[#3EA570]"
            >
              <img src={plus} alt="Add" />
              <span>إضافة باقة</span>
            </button>
          )}
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pagination={false}
          />
        )}
      </div>
      <AddPackageConfigModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdatePackageConfigModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default PackageConfig;
