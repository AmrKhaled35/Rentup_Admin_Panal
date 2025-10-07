import React, { useState } from "react";
import Modal from "../ui/Modal";

const SendReportModal = ({ isOpen, setIsOpen }) => {
  const [reportTitle, setReportTitle] = useState("");
  const [description, setDescription] = useState("");

  const title = (
    <div className="flex justify-between items-center">
      <p>Send report</p>
      <div className="flex gap-4">
        <button className="text-skyBlue text-base bg-skyBlue/10 border border-skyBlue rounded-md px-6 py-1">
          Send
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red text-base bg-light-red border border-red rounded-md px-6 py-1"
        >
          Close
        </button>
      </div>
    </div>
  );
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">Title</label>
          <input
            onChange={(e) => setReportTitle(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="Report title"
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-[#4D5464]">Details</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="h-36 w-full resize-none border border-gray bg-medium-gray rounded-lg px-3 py-2 mt-1"
            placeholder="Describe details here"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default SendReportModal;
