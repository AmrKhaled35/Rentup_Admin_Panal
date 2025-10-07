import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Modal from "../ui/Modal";
import myAxios from "../../utils/myAxios";
import Editor from "../Editor";
import useAuth from "../../hooks/useAuth";
import validateFields from "../../utils/validateFields";
import toast from "react-hot-toast";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const customStyles = {
  // Example custom styles for the control (input area)
  control: () => ({
    border: "1px solid #E0E2E7",
    borderRadius: "6px",
    height: "40px",
    marginTop: "4px",
    display: "flex",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E0E2E7",
  }),
};

const AddBlogModal = ({ isOpen, setIsOpen, setRefetch }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [keywordInputValue, setKeywordInputValue] = useState("");
  const [keywordValue, setKeywordValue] = useState([]);
  const [metaInputValue, setMetaInputValue] = useState("");
  const [metaValue, setMetaValue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const { token } = useAuth();

  const keywords =
    metaValue.length > 0 && metaValue.map((m) => m.value).toString();
  const meta =
    keywordValue.length > 0 && keywordValue.map((m) => m.value).toString();

  const formData = new FormData();
  formData.append("blog_title", title);
  formData.append("blog_content", fullDescription);
  formData.append("blog_category_id", categoryId);
  formData.append("blog_thumb_img", image);
  formData.append("keyword", keywords);
  formData.append("meta_tag", meta);
  formData.append("meta_description", metaDescription);

  const handleKeyDownKeyword = (event) => {
    if (!keywordInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setKeywordValue((prev) => [...prev, createOption(keywordInputValue)]);
        setKeywordInputValue("");
        event.preventDefault();
    }
  };
  const handleKeyDownMeta = (event) => {
    if (!metaInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setMetaValue((prev) => [...prev, createOption(metaInputValue)]);
        setMetaInputValue("");
        event.preventDefault();
    }
  };

  const AddBlog = () => {
    if (!validateFields([title, categoryId, metaDescription]) || !image) {
      return toast.error("Please fill all the fields!");
    }

    const toastId = toast.loading("Loading...");
    myAxios
      .post("/admin/blog/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status == "success") {
          setRefetch((prev) => !prev);
          setIsOpen(false);
          setTitle("");
          setMetaDescription("");
          setKeywordValue("");
          setMetaValue("");
          setFullDescription("");
          setImage(null);
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

  useEffect(() => {
    myAxios("/admin/blog/category/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.log(err));
  }, [token]);

  const titl = (
    <div className="flex justify-between items-center">
      <p>Add Blog</p>
      <div className="flex gap-4">
        <button
          onClick={AddBlog}
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={titl}>
      <div className="border border-gray rounded-lg p-6 mt-12">
        <p className="text-sm font-medium text-[#4D5464]">Title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Add title"
          className="h-10 w-full px-3 bg-[#f9f9fc] rounded-lg border border-gray outline-none mt-1 text-sm"
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">Thumbnail</p>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          accept="image/*"
          placeholder="Notification details"
          className="h-10 w-full bg-white rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark"
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">Category</p>
        <select
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-10 w-full px-3 bg-medium-gray rounded-lg border border-gray outline-none mt-1 text-sm text-light-dark form-select focus:ring-0 focus:border-gray"
          required
        >
          <option selected disabled>
            Select
          </option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="text-sm font-medium text-[#4D5464] mt-4">Keywords</p>
        <CreatableSelect
          components={components}
          inputValue={keywordInputValue}
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={(newValue) => setKeywordValue(newValue)}
          onInputChange={(newValue) => setKeywordInputValue(newValue)}
          onKeyDown={handleKeyDownKeyword}
          placeholder="Type something and press enter..."
          value={keywordValue}
          styles={customStyles}
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">Meta Tag</p>
        <CreatableSelect
          components={components}
          inputValue={metaInputValue}
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={(newValue) => setMetaValue(newValue)}
          onInputChange={(newValue) => setMetaInputValue(newValue)}
          onKeyDown={handleKeyDownMeta}
          placeholder="Type something and press enter..."
          value={metaValue}
          styles={customStyles}
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">
          Meta Description
        </p>
        <textarea
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Meta Description"
          defaultValue={metaDescription}
          className="h-36 w-full px-3 py-2 bg-[#f9f9fc] rounded-lg border border-gray outline-none mt-1 text-sm resize-none"
          required
        />
        <p className="text-sm font-medium text-[#4D5464] mt-4">
          Full Description
        </p>
        <div className="mt-1">
          <Editor
            fullDescription={fullDescription}
            setFullDescription={setFullDescription}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddBlogModal;
