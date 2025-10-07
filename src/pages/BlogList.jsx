import React, { useEffect, useState } from "react";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconSearch from "../assets/images/search.svg";
import { Link } from "react-router-dom";
import myAxios from "./../utils/myAxios";
import plus from "../assets/images/plus.svg";
import AddBlogModal from "../components/blog/AddBlogModal";
import UpdateBlogModal from "../components/blog/UpdateBlogModal";
import dayjs from "dayjs";
import BlogDetailsModal from "../components/blog/BlogDetailsModal";
import DataTable from "react-data-table-component";
import eye from "../assets/images/eye.svg";
import pen from "../assets/images/pen.svg";
import trash from "../assets/images/trash.svg";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import toast from "react-hot-toast";

const BlogList = () => {
  const [searchText, setSearchText] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [viewIsOpen, setViewIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/blog/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setBlogs(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const filtered = blogs.filter((blog) =>
    blog.blog_title.toLowerCase().match(searchText.toLowerCase())
  );

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "blog-list");
    if (route.edit) return true;
  };
  const isDeletable = () => {
    const route = permissions?.find((route) => route.name === "blog-list");
    if (route.delete) return true;
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => (
        <div className="py-4 w-[250px] text-start flex items-center gap-2">
          {row?.blog_thumb_img ? (
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${row?.blog_thumb_img}`}
              width={44}
              height={44}
            />
          ) : (
            <div className="h-11 w-11 bg-gray rounded-lg"></div>
          )}

          <span>{row?.blog_title}</span>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => dayjs(row?.created_at).format("D MMM YYYY"),
    },
    // {
    //   name: "Status",
    //   selector: (row) => (
    //     <p className="text-red bg-light-red rounded-full px-3 py-1">
    //       Out of Stock
    //     </p>
    //   ),
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          <button onClick={() => handleViewModal(row?.id)}>
            <img src={eye} />
          </button>
          {isEditable() && (
            <button onClick={() => handleUpdateModal(row?.id)}>
              <img src={pen} />
            </button>
          )}
          {isDeletable() && (
            <button onClick={() => handleDelete(row?.id)}>
              <img src={trash} />
            </button>
          )}
        </div>
      ),
      width: "120px",
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
          .delete(`/admin/blog/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
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

  const handleUpdateModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  const handleViewModal = (id) => {
    setViewIsOpen(true);
    setModalId(id);
  };

  const subHeaderComponent = (
    <input
      onChange={(e) => setSearchText(e.target.value)}
      type="text"
      name="search"
      className="outline-none border-y border-y-gray border-r border-r-gray rounded-r-lg w-full"
      placeholder="Search blog..."
    />
  );

  return (
    <div>
      <p className="text-2xl text-dark font-medium">All Blog</p>
      <div className="flex justify-between items-center">
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-skyBlue">Dashboard</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">Blog</p>
        </div>
        <div>
          {isEditable() && (
            <button
              onClick={() => setAddIsOpen(true)}
              className="text-sm text-white font-semibold flex items-center gap-1 rounded-lg px-[14px] py-[10px] bg-skyBlue"
            >
              <img src={plus} />
              <span>Add Blog</span>
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
        <div className="flex items-center gap-4"></div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pagination={true}
            subHeaderComponent={subHeaderComponent}
          />
        )}
      </div>
      <AddBlogModal
        isOpen={addIsOpen}
        setIsOpen={setAddIsOpen}
        setRefetch={setRefetch}
      />
      <BlogDetailsModal
        id={modalId}
        isOpen={viewIsOpen}
        setIsOpen={setViewIsOpen}
      />
      <UpdateBlogModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default BlogList;
