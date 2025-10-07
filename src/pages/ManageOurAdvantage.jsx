import { useEffect, useState } from "react";
import pen from "../assets/images/pen.svg";
import iconChevronRight from "../assets/images/chevron-right.svg";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import myAxios from "../utils/myAxios";
import UpdateManageOurAdvantageModal from "../components/manage/UpdateManageOurAdvantageModal";

const ManageOurAdvantage = () => {
  const [data, setData] = useState([]);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/our-advantages/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "our-advantage");
    if (route?.edit) return true;
  };

  const columns = [
    {
      name: "العنوان",
      selector: (row) => row.title,
      width: "250px",
    },
    {
      name: "الوصف",
      cell: (row) => <p>{row.description}</p>,
      minWidth: "250px"
    },
    {
      name: "الأيقونة",
      selector: (row) => (
        <img
          src={`${import.meta.env.VITE_IMG_URL}/${row.icon}`}
          width={44}
          height={44}
          alt="Icon"
        />
      ),
      width: "150px",
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="flex items-center gap-2 py-4">
          {isEditable() && (
            <button onClick={() => handleModal(row.id)}>
              <img src={pen} alt="Edit" />
            </button>
          )}
        </div>
      ),
      width: "80px",
    },
  ];

  const handleModal = (id) => {
    setUpdateIsOpen(true);
    setModalId(id);
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">مميزاتنا</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-green-500">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} alt=">" />
          <p className="text-light-dark">مميزاتنا</p>
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pagination={false}
          />
        )}
      </div>
      <UpdateManageOurAdvantageModal
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
        id={modalId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default ManageOurAdvantage;
