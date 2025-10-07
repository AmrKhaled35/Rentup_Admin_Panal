import React from "react";
import checkBlue from "../../assets/images/check.svg";
import cross from "../../assets/images/crossRed.svg";
import phoneBlack from "../../assets/images/phoneBlack.svg";
import envelopBlack from "../../assets/images/envelopBlack.svg";
import facebook from "../../assets/images/facebook.svg";
import google from "../../assets/images/google.svg";
import check from "../../assets/images/checkg.svg";
import location from "../../assets/images/location2.svg";
import Verified from "./Verified";
import dayjs from "dayjs";

const Review = ({ item }) => {
  const { review_user } = item || {};
  const {
    name,
    email,
    is_verified,
    user_image,
    is_fb_connected,
    is_google_connected,
    is_indivisuals,
    phone,
    address,
    created_at,
  } = review_user || {};

  return (
    <div className="bg-skyBlue/10 border border-skyBlue rounded-xl px-5 py-6 mt-9 flex flex-row justify-between gap-0">
      <div className="flex flex-row-reverse md:flex-row items-start justify-between md:items-center gap-7">
        <img
          src={`${import.meta.env.VITE_IMG_URL}/${user_image}`}
          alt="person"
          height={140}
          width={140}
        />
        <div className="flex flex-col">
          <p className="text-2xl !text-b font-bold">{name}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex gap-2 bg-[#BAEECF] rounded-md px-3 py-1">
              {is_verified ? <img src={checkBlue} /> : <img src={cross} />}
              <p>ID Verified</p>
            </div>
            {is_indivisuals && (
              <div className="bg-[#BAEECF] rounded-md px-3 py-1">
                <p>Individual</p>
              </div>
            )}
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm !text-b">
            <img src={location} width={12} />
            <span>{address}</span>
          </p>
          <p className="text-sm !text-b mt-1">
            Member Since: {dayjs(created_at).fromNow(true)}
          </p>
        </div>
      </div>
      <div className="w-[37%]">
        <p className="!text-b font-semibold mb-3">Verified:</p>
        <div className="flex gap-2">
          <Verified
            imgL={phoneBlack}
            imgR={phone ? check : cross}
            title="Phone"
          />
          <Verified
            imgL={envelopBlack}
            imgR={email ? check : cross}
            title="Email"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Verified
            imgL={facebook}
            imgR={is_fb_connected ? check : cross}
            title="Facebook"
          />
          <Verified
            imgL={google}
            imgR={is_google_connected ? check : cross}
            title="Google"
          />
        </div>
        <div className="bg-skyBlue rounded-full w-full text-white py-2 px-5 text-sm font-bold flex justify-center text-center mt-7">
          Other Adverts (3) From This Breeder
        </div>
      </div>
    </div>
  );
};

export default Review;
