import React, { useEffect, useState } from "react";
import myAxios from "../../utils/myAxios";
import Modal from "../ui/Modal";
import DOMPurify from "dompurify";
import useAuth from "../../hooks/useAuth";

const BlogDetailsModal = ({ id, isOpen, setIsOpen }) => {
  const [blog, setBlog] = useState({});
  const { token } = useAuth();

  const {
    blog_title,
    blog_content,
    blog_thumb_img,
    keyword,
    meta_tag,
    meta_description,
  } = blog || {};
  const keywords = keyword?.split(",");
  const metaTags = meta_tag?.split(",");

  useEffect(() => {
    if (id) {
      myAxios(`/admin/blog/get-one/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setBlog(res.data.data))
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const title = <p className="text-center">Blog Details</p>;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="divide-gray">
        <hr className="my-6 text-gray" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <img
            src={`${import.meta.env.VITE_IMG_URL}/${blog_thumb_img}`}
            className="w-auto h-28 rounded-md"
          />
          <div>
            <p className="text-dark text-xl font-medium">{blog_title}</p>
            <p className="text-light-dark font-medium mt-3">
              Category name: {"to do category name"}
            </p>
          </div>
        </div>
        <hr className="my-6" />
        <div>
          <p className="text-light-dark font-medium">Keywords</p>
          <p className="text-light-dark text-sm mt-4 flex gap-6 flex-wrap">
            {keywords?.map((item, i) => (
              <span key={i} className="bg-gray rounded-md px-4 py-1">
                {item}
              </span>
            ))}
          </p>
        </div>
        <hr className="my-6" />
        <div>
          <p className="text-light-dark font-medium">Meta tags</p>
          <p className="text-light-dark text-sm mt-4 flex gap-6 flex-wrap">
            {metaTags?.map((item, i) => (
              <span key={i} className="bg-gray rounded-md px-4 py-1">
                {item}
              </span>
            ))}
          </p>
        </div>
        <hr className="my-6" />
        <div>
          <p className="text-light-dark font-medium">Meta description</p>
          <p className="text-light-dark text-sm mt-3">{meta_description}</p>
        </div>
        <hr className="my-6" />
        <div>
          <p className="text-light-dark font-medium">Full description</p>
          <div
            className="text-light-dark mt-3 prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog_content),
            }}
          />
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

export default BlogDetailsModal;
