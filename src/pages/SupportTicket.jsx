import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import iconChevronRight from "../assets/images/chevron-right.svg";
import eye from "../assets/images/eye.svg";
import { Link } from "react-router-dom";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import myAxios from "../utils/myAxios";

const SupportTicket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/customer/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [token]);

  const isEditable = () => {
    const route = permissions?.find(
      (route) => route.name === "support-ticket"
    );
    if (route.edit) return true;
  };

  const columns = [
    {
      name: "الموضوع",
      selector: (row) => <p className="text-[#3EA570]">{row?.subject}</p>,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status
              ? "text-green-500 bg-light-green"
              : "text-red bg-light-red"
          } py-1 px-3 rounded-full font-medium`}
        >
          {row?.status ? "مفتوح" : "مغلق"}
        </p>
      ),
    },
    {
      name: "الأولوية",
      selector: (row) => (
        <p
          className={`${
            row?.priority === "low"
              ? "text-green-100 bg-green-500"
              : row?.priority === "medium"
              ? "text-[#ffab1a] bg-yellow-100"
              : row?.priority === "high"
              ? "text-red bg-light-red"
              : ""
          } py-1 px-3 rounded-full capitalize font-medium`}
        >
          {row?.priority === "low"
            ? "منخفضة"
            : row?.priority === "medium"
            ? "متوسطة"
            : row?.priority === "high"
            ? "عالية"
            : ""}
        </p>
      ),
    },
    {
      name: "الإجراءات",
      selector: (row) =>
        isEditable() && (
          <Link to={`/support-ticket/${row?.id}`}>
            <img src={eye} alt="" width={20} height={20} />
          </Link>
        ),
      width: "120px",
    },
  ];

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">تذاكر الدعم</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#3EA570]">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">تذاكر الدعم</p>
        </div>
      </div>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={data} pagination={true} />
        )}
      </div>
    </div>
  );
};

export default SupportTicket;
