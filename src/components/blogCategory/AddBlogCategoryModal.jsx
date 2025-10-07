import React, { useState } from "react";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const AddBlogCategoryModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [categoryName, setCategoryName] = useState("");
  const { token } = useAuth();

  const handleAddCategory = () => {
    if (!validateFields([categoryName])) {
      return toast.error("Please fill all the fields!");
    }

    const toastId = toast.loading("Loading...");
    myAxios
      .post(
        "/admin/blog/category/add",
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
          toast.success(res.data.message);
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setCategoryName("");
          toast.success("Added successfully!");
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
      <p>Add</p>
      <div className="flex gap-4">
        <button
          onClick={handleAddCategory}
          className="text-skyBlue text-base bg-skyBlue/10 border border-skyBlue rounded-md px-6 py-1"
        >
          Add
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
          <label className="text-sm font-medium text-[#4D5464]">
            Category name
          </label>
          <input
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            className="h-10 w-full border border-gray bg-medium-gray rounded-lg px-3 mt-1"
            placeholder="Category name"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddBlogCategoryModal;
