import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import DataTable from "react-data-table-component";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import plus from "../assets/images/plus.svg";
import myAxios from "../utils/myAxios";
import Swal from "sweetalert2";
import AddTestimonialModal from "../components/testimonial/AddTestimonialModal";
import UpdateTestimonialModal from "../components/testimonial/UpdateTestimonialModal";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/testimonial/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setTestimonials(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "testimonial");
    return route?.edit;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "testimonial");
    return route?.delete;
  };

  const columns = [
    {
      name: "المراجع",
      selector: (row) => (
        <div className="py-3 flex items-center gap-2 text-start ">
          {row?.img ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.img}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}

          <div>
            <p className="text-sm text-dark font-medium mb-1">
              {row?.reviewer_name}
            </p>
          </div>
        </div>
      ),
      width: "200px",
    },
    {
      name: "الوظيفة",
      selector: (row) => row?.reviewer_designation,
      width: "150px",
    },
    {
      name: "العنوان",
      cell: (row) => row?.title,
      width: "250px",
    },
    {
      name: "الرسالة",
      cell: (row) => row?.message,
      minWidth: "300px"
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
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء"
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/testimonial/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("تم الحذف!", "تم حذف العنصر بنجاح.", "success");
            }
          })
      }
    });
  };

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">الشهادات</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">الشهادات</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-green-500"
            >
              <img src={plus} />
              <span>إضافة شهادة</span>
            </button>
          )}
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 !overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={testimonials}
            pagination={true}
          />
        )}
      </div>
      <AddTestimonialModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateTestimonialModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default Testimonial;
