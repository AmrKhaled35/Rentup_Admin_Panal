import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import validateFields from "../../utils/validateFields";

const UpdateBlogCategoryModal = ({ isOpen, setIsOpen, id, setRefetch }) => {
  const [categoryName, setCategoryName] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      myAxios(`/admin/blog/category/get-one/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => setCategoryName(res.data.data.name))
        .catch((error) => console.log(error));
    }
  }, [id, token]);

  const updateCategory = (id) => {
    if (!validateFields([categoryName])) {
      return toast.error("Please fill all the fields!");
    }

    const toastId = toast.loading("Loading...");
    myAxios
      .post(
        `/admin/blog/category/update/${id}`,
        {
          name: categoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          toast.success("Updated successfully");
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  const title = (
    <div className="flex justify-between items-center">
      <p>Update</p>
      <div className="flex gap-4">
        <button
          onClick={() => updateCategory(id)}
          className="text-skyBlue text-base bg-skyBlue/10 border border-skyBlue rounded-md px-6 py-1"
        >
          Update
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red text-base bg-light-red border border-red rounded-md px-6 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <div>
          <label className="text-sm font-medium text-[#4D5464]">
            Category name
          </label>
          <input
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="Category name"
            value={categoryName}
            defaultValue={categoryName}
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateBlogCategoryModal;
