import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import check from "../../assets/images/checkg.svg";
import cross from "../../assets/images/crossRed.svg";
import location from "../../assets/images/location2.svg";
// import SendReportModal from "./SendReportModal";
import clock from "../../assets/images/time-circle.svg";
import vector from "../../assets/images/vector.svg";
import myAxios from "../../utils/myAxios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Review from "./Review";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import FacilityItem from "./FacilityItem";

dayjs.extend(relativeTime);

const ListingDetailsModal = ({ id, isOpen, setIsOpen, setRefetch }) => {
  const [data, setData] = useState({});
  const { token } = useAuth();
  const {
    property_title,
    get_title_image,
    get_gallery_image,
    address,
    property_description,
    get_facility,
    get_outdoor_facility,
    is_boosting,
    price,
    created_at,
    status,
  } = data || {};

  useEffect(() => {
    if (id) {
      myAxios(`/admin/property/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setData(res.data.data))
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const handleApprove = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، الموافقة!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .post(
            "/admin/property/approve-reject",
            { property_id: id, status: "active" },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              setIsOpen(false);
            }
          });
        Swal.fire("تمت الموافقة!", "تمت الموافقة على العقار.", "success");
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، الرفض!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .post(
            "/admin/property/approve-reject",
            { property_id: id, status: "rejected" },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              setIsOpen(false);
            }
          });
        Swal.fire("تم الرفض!", "تم رفض العقار.", "success");
      }
    });
  };

  const titl = (
    <div   dir = "rtl" className="flex justify-between items-center">
      <p>تفاصيل العقار</p>
      <div className="flex flex-wrap gap-4">
        {status === "pending" ? (
          <>
            <button
              onClick={handleApprove}
              className="text-green-500 bg-green-500/10 border border-green-500 rounded-md px-6 py-1 text-base"
            >
              الموافقة
            </button>
            <button
              onClick={handleReject}
              className="text-rose-600 bg-light-red border border-red rounded-md px-6 py-1 text-base"
            >
              الرفض
            </button>
          </>
        ) : status === "active" ? (
          <button
            onClick={handleReject}
            className="text-rose-600 bg-light-red border border-red rounded-md px-6 py-1 text-base"
          >
            الرفض
          </button>
        ) : status === "rejected" ? (
          <button
            onClick={handleApprove}
            className="text-green-500 bg-green-500/10 border border-green-500 rounded-md px-6 py-1 text-base"
          >
            الموافقة
          </button>
        ) : (
          ""
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="text-red bg-light-red border border-red rounded-md px-6 py-1 text-base"
        >
          إغلاق
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl} dir="rtl">
      <div  className="mt-8 bg-white rounded-xl p-5 shadow-[0_10.5px_14.25px_0px_rgba(0,65,31,0.10)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-none h-max">
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${get_title_image?.title_img}`}
              className="w-full lg:w-60 h-60 object-cover rounded-md"
            />
          </div>
          <div className="flex-1 flex flex-wrap gap-3">
            {get_gallery_image?.map((image) => (
              <img
                key={image.id}
                src={`${import.meta.env.VITE_IMG_URL}/${image.img}`}
                className="w-auto h-28 object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-[6px]">
            <img src={clock} />
            <p className="text-xs text-[#444]">{dayjs(created_at).fromNow()}</p>
          </div>
          {is_boosting && (
            <div className="flex items-center gap-2 px-2 py-1 bg-[#FFE58A] rounded-md">
              <img src={vector} />
              <p className="text-xs text-dark font-medium">معزز</p>
            </div>
          )}
        </div>
        <p className="text-xl text-dark font-bold mt-5">{property_title}</p>
        <p className="text-green-500 text-2xl font-bold">
          $ <span>{price}</span>
        </p>
        <div className="flex items-center gap-1 my-4">
          <img src={location} />
          <p className="text-sm text-[#444]">{address}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl p-5 shadow-[0_10.5px_14.25px_0px_rgba(0,65,31,0.10)]">
        <h1 className="text-green-500 text-xl font-bold">الوصف:</h1>
        <div className="text-sm text-[#444] space-y-3 mt-2">
          <p>{property_description}</p>
        </div>
      </div>

      <div className="mt-7">
        <p className="text-green-500 text-xl font-bold mb-4">التفاصيل:</p>
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl p-5 shadow-[0_10.5px_14.25px_0px_rgba(0,65,31,0.10)]">
            <h2 className="text-lg text-dark font-semibold mb-6">المرافق الداخلية</h2>
            <div className="grid lg:grid-cols-2 gap-4">
              {get_facility?.map((item) => (
                <FacilityItem
                  key={item.id}
                  icon={`${import.meta.env.VITE_IMG_URL}/${item.f_icon}`}
                  title={item.f_title}
                  value={item.f_value}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-[0_10.5px_14.25px_0px_rgba(0,65,31,0.10)]">
            <h2 className="text-lg text-dark font-semibold mb-6">المرافق الخارجية</h2>
            <div className="grid lg:grid-cols-2 gap-4">
              {get_outdoor_facility?.map((item) => (
                <FacilityItem
                  key={item.id}
                  icon={`${import.meta.env.VITE_IMG_URL}/${item.of_icon}`}
                  title={item.of_title}
                  value={item.of_value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* {get_review?.length > 0 &&
        get_review.map((item) => <Review key={item.id} item={item} />)} */}
    </Modal>
  );
};

export default ListingDetailsModal;
