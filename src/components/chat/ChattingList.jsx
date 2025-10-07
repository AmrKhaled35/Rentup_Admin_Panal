import React from "react";
import dog from "../../assets/images/chatDog.jpg";
import person from "../../assets/images/person.png";
import check from "../../assets/images/check.svg";

const ChattingList = () => {
  return (
    <div
      className="bg-[#EBFBE5] border border-[#BAEECF] rounded-lg p-3 grid grid-cols-[70px_1fr] gap-6"
    >
      <div className="relative">
        <img src={dog} width={70} className="rounded-lg" />
        <img src={person} width={27} className="absolute -right-2 -bottom-1" />
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-2">
          <p className="text-sm !text-[#444] font-bold">James Smith</p>
          <img src={check} width={12} />
        </div>
        <p className="!text-[#444] font-bold truncate">German Shepherd</p>
        <p className="!text-b text-xs truncate">James: Sure! How can I help</p>
      </div>
    </div>
  );
};

export default ChattingList;
