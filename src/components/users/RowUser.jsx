import React, { useState } from "react";
import eye from "../../assets/images/eye.svg";
import pen from "../../assets/images/pen.svg";
import trash from "../../assets/images/trash.svg";
import Swal from "sweetalert2";
import myAxios from "../../utils/myAxios";
import UserDetailsModal from "./UserDetailsModal";
import dayjs from "dayjs";

const RowUser = ({ user, setRefetch }) => {
  const {
    id,
    name,
    user_image,
    email,
    phone,
    country,
    city,
    user_type,
    is_verified,
    created_at,
  } = user;
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios.delete(`/users/${id}`).then((res) => {
          console.log(res);
          setRefetch((prev) => !prev);
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
    <tr className="border-b border-b-[#F0F1F3] flex items-center justify-between">
      <td className="pl-6 pr-2 ">
        <input type="checkbox" name="" />
      </td>
      <td className="py-4 flex items-center gap-2 min-w-[150px] text-start ">
        {user_image ? (
          <img
            src={`${import.meta.env.VITE_IMG_URL}/${user_image}`}
            width={44}
            height={44}
          />
        ) : (
          <div className="h-11 w-11 bg-gray rounded-lg"></div>
        )}
        <p className="text-sm text-dark font-medium">{name}</p>
      </td>
      <td className=" w-[130px] text-sm text-light-dark text-start truncate">
        {email}
      </td>
      <td className=" w-[120px] text-sm text-light-dark text-start ">
        {phone}
      </td>
      <td className=" w-[120px] text-start">
        <p className="text-sm text-light-dark font-medium">
          {country?.country_name}
        </p>
        <p className="text-xs text-light-dark">{city?.city_name}</p>
      </td>
      <td className="text-sm text-light-dark font-medium min-w-[120px]">
        {user_type?.type}
      </td>
      <td className=" w-[130px]">
        <span
          className={`${
            is_verified ? "text-skyBlue bg-skyBlue/10" : "text-red bg-light-red"
          } rounded-full px-3 py-1`}
        >
          {is_verified ? "Verified" : "Not Verified"}
        </span>
      </td>
      <td className="text-sm text-light-dark font-medium w-[110px]">
        {dayjs(created_at).format("D MMM YYYY")}
      </td>
      <td className="flex items-center gap-2 py-4 justify-end pr-6 w-[120px]">
        <button onClick={() => setIsOpen(true)}>
          <img src={eye} />
        </button>
        <UserDetailsModal id={id} isOpen={isOpen} setIsOpen={setIsOpen} />
        <button>
          <img src={pen} />
        </button>
        <button onClick={() => handleDelete(id)}>
          <img src={trash} />
        </button>
      </td>
    </tr>
  );
};

export default RowUser;
