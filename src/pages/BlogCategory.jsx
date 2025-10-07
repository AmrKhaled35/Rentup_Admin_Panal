import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import plus from "../assets/images/plus.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import AddBlogCategoryModal from "../components/blogCategory/AddBlogCategoryModal";
import UpdateBlogCategoryModal from "../components/blogCategory/UpdateBlogCategoryModal";
import toast from "react-hot-toast";

const BlogCategory = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();

  useEffect(() => {
    myAxios("/admin/blog/category/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = categories?.filter((item) =>
    item.name.toLowerCase().match(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find(
      (route) => route.name === "blog-category-list"
    );
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find(
      (route) => route.name === "blog-category-list"
    );
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "Category name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row.id)}>
              <img src={pen} />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row.id)}>
              <img src={trash} />
            </button>
          )}
        </div>
      ),
      width: "100px",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3EA570",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        myAxios
          .delete(`/admin/blog/category/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status === "success") {
              setRefetch((prev) => !prev);
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          })
          .catch((err) => toast.error(err?.response?.data?.message));
      }
    });
  };

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="Search blog category..."
    />
  );
  return (
    <div>
      <p className="text-2xl text-dark font-medium">Blog Categories</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-skyBlue">Dashboard</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">Blog_categories</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-xs lg:text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-2 lg:px-[14px] py-[10px] bg-skyBlue"
            >
              <img src={plus} />
              <span>Add Blog Category</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex w-80 h-10">
          <img
            src={iconSearch}
            className="bg-white border-l border-l-gray border-y border-y-gray rounded-l-lg"
          />
          {subHeaderComponent}
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          pagination={true}
          subHeaderComponent={subHeaderComponent}
        />
      </div>
      <AddBlogCategoryModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <UpdateBlogCategoryModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default BlogCategory;
