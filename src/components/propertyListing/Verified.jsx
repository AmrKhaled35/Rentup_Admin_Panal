import React from "react";

const Verified = ({ imgL, title, imgR }) => {
  return (
    <div className="flex gap-2 bg-white rounded-md p-2 w-fit">
      <img src={imgL} />
      <p className="text-sm text-[#444]">{title}</p>
      <img src={imgR} />
    </div>
  );
};

export default Verified;
