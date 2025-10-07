import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import myAxios from "../utils/myAxios";
import { Link, useSearchParams } from "react-router-dom";
import iconChevronRight from "../assets/images/chevron-right.svg";
import iconFilter from "../assets/images/filter.svg";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PaymentHistory = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [status, setStatus] = useState(searchParams.get("status"));
  const filterButtonRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios(`/admin/total-payments${status ? `?status=${status}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [token, status]);

  const columns = [
    {
      name: "البوابة | المعاملة",
      selector: (row) => (
        <div className="my-2">
          <p className="text-[#3EA570] font-semibold">{row?.payment_method}</p>
          <p className="mt-1 text-xs">{row?.transaction_id}</p>
        </div>
      ),
    },
    {
      name: "تاريخ البداية",
      selector: (row) => (
        <div>
          <p>{dayjs(row?.initiated).format("YYYY-MM-D hh:mm A")}</p>
          <p className="mt-1 text-xs">{dayjs(row?.initiated).fromNow()}</p>
        </div>
      ),
    },
    {
      name: "المستخدم",
      selector: (row) => (
        <Link to={`/users/${row?.user_id}`}>
          <p>{row?.user?.name}</p>
          <p className="mt-1">{row?.user?.email}</p>
        </Link>
      ),
    },
    {
      name: "المبلغ",
      selector: (row) => <p>{row?.credits || 0} دولار</p>,
    },
    {
      name: "التحويل",
      selector: (row) => (
        <div>
          <p>{row?.conversion}</p>
          <p className="mt-1 font-semibold">
            {row?.amount} {row?.currency}
          </p>
        </div>
      ),
    },
    {
      name: "الحالة",
      selector: (row) => (
        <p
          className={`px-3 py-1 ${
            row?.status === "success"
              ? "bg-light-green text-green-500"
              : row?.status === "pending"
              ? "bg-light-red text-red"
              : row?.status === "cancel"
              ? ""
              : ""
          } rounded-full`}
        >
          {row?.status === "success"
            ? "ناجحة"
            : row?.status === "pending"
            ? "قيد الانتظار"
            : row?.status === "cancel"
            ? "مرفوضة"
            : ""}
        </p>
      ),
      width: "150px",
    },
  ];

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">تاريخ المدفوعات</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to="/">
            <p className="text-[#3EA570]">لوحة التحكم</p>
          </Link>
          <img src={iconChevronRight} />
          <p className="text-light-dark">تاريخ المدفوعات</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            ref={filterButtonRef}
            onClick={() => setFilterIsOpen((prev) => !prev)}
            className="flex items-center border border-gray rounded-lg px-[14px] h-10 bg-white text-light-dark outline-none relative"
          >
            <img src={iconFilter} />
            <span>المرشحات</span>
            {filterIsOpen && (
              <div className="absolute top-10 right-0 min-w-[150px] rounded-lg bg-white shadow-[0_14px_19px_0px_rgba(0,83,40,0.16)] z-10">
                <div
                  className="py-2"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <p
                    onClick={() => setStatus("")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-[#3EA570] cursor-pointer block"
                    role="menuitem"
                  >
                    <span>الكل</span>
                  </p>
                  <p
                    onClick={() => setStatus("success")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-[#3EA570] cursor-pointer block"
                    role="menuitem"
                  >
                    <span>ناجحة</span>
                  </p>
                  <p
                    onClick={() => setStatus("pending")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-[#3EA570] cursor-pointer block"
                    role="menuitem"
                  >
                    <span>قيد الانتظار</span>
                  </p>
                  <p
                    onClick={() => setStatus("rejected")}
                    className="px-[30px] py-1 text-dark hover:bg-medium-gray hover:text-[#3EA570] cursor-pointer block"
                    role="menuitem"
                  >
                    <span>مرفوضة</span>
                  </p>
                </div>
              </div>
            )}
          </button>
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

export default PaymentHistory;
