import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const UserDetailsModal = ({ id, isOpen, setIsOpen }) => {
  const [userData, setUserData] = useState({});
  const { token } = useAuth();
  const {
    name,
    user_image,
    email,
    phone,
    country,
    city,
    is_verified,
    created_at,
  } = userData;
  useEffect(() => {
    if (id) {
      myAxios(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUserData(res.data.data))
        .catch((error) => console.log(error));
    }
  }, [id, token]);
  console.log(userData)

  const title = <p className="text-center">User Details</p>;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="divide-gray">
        <hr className="my-6 text-gray" />
        <div className="flex items-center gap-10">
          <img
            src={`${import.meta.env.VITE_IMG_URL}/${user_image}`}
            alt={name}
            className="w-28 h-28 rounded-md"
          />
          <div>
            <p className="text-light-dark font-medium">Name</p>
            <p className="mt-[6px] text-dark text-xl font-medium">{name}</p>
          </div>
          <Link
            to={`/admin/users-listings/${id}`}
            className="text-skyBlue bg-skyBlue/10 border border-skyBlue rounded-md px-6 py-1 ms-auto block"
          >
            View User's listings
          </Link>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">Email:</p>
          <p className="text-light-dark font-medium">{email}</p>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">Phone:</p>
          <p className="text-light-dark font-medium">{phone}</p>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">Country:</p>
          <p className="text-light-dark font-medium">{country?.country_name}</p>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">City:</p>
          <p className="text-light-dark font-medium">{city?.city_name}</p>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">Status:</p>
          <p
            className={`${
              is_verified
                ? "text-skyBlue bg-skyBlue/10"
                : "text-red bg-light-red"
            } rounded-full px-3 py-1`}
          >
            {is_verified ? "Verified" : "Not Verified"}
          </p>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-light-dark font-medium">Date:</p>
          <p className="text-light-dark font-medium">
            {dayjs(created_at).format("D MMM YYYY")}
          </p>
        </div>
        <hr className="mt-6 mb-14" />
        <div className="text-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-red bg-light-red border border-red rounded-md px-6 py-1"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
