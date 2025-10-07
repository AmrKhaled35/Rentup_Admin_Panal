import { Link } from "react-router-dom";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import iconChevronRight from "../assets/images/chevron-right.svg";
import pen from "../assets/images/pen.svg";
import myAxios from "../utils/myAxios";

const PaymentGateways = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/gateway", {
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
      (route) => route.name === "payment-gateways"
    );
    if (route.edit) return true;
  };

  const columns = [
    {
      name: "بوابة الدفع",
      selector: (row) => <p className="text-[#26C870]">{row?.gateway_name}</p>,
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`${
            row?.status
              ? "text-[#26C870] bg-[#26C870]/10"
              : "text-red bg-light-red"
          } py-1 px-3 rounded-full font-medium`}
        >
          {row?.status ? "مفتوحة" : "مغلقة"}
        </p>
      ),
    },
    {
      name: "إجراء",
      selector: (row) =>
        isEditable() && (
          <Link to={`/payment-gateways/${row?.alias}`}>
            <img src={pen} alt="تعديل" width={20} height={20} />
          </Link>
        ),
      width: "80px",
    },
  ];

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">بوابات الدفع</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#26C870]">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">بوابات الدفع</p>
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

export default PaymentGateways;
