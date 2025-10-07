import React, { useEffect, useState } from "react";
import myAxios from "../../utils/myAxios";
import Modal from "../ui/Modal";
import DOMPurify from "dompurify";
import useAuth from "../../hooks/useAuth";

const PageDetailsModal = ({ id, isOpen, setIsOpen }) => {
  const [page, setPage] = useState({});
  const { token } = useAuth();

  const { title, content } = page || {};

  useEffect(() => {
    if (id) {
      myAxios(`/admin/more-page/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setPage(res.data.data))
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const titl = <p dir="rtl" className="text-center">تفاصيل الصفحة</p>;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl}>
      <div className="divide-gray">
        <hr className="my-6 text-gray" />
        <div className="flex items-center gap-10">
          <p className="text-dark text-xl font-medium">{title}</p>
        </div>
        <hr className="my-6" />
        <div>
          <p className="text-light-dark font-medium">المحتوى الكامل</p>
          <div
            className="text-light-dark mt-3 prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          />
        </div>
        <hr className="mt-6 mb-14" />
        <div className="text-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-red bg-light-red border border-red rounded-md px-6 py-1"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PageDetailsModal;
