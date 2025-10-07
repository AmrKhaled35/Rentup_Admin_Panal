import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import DataTable from "react-data-table-component";
import myAxios from "../utils/myAxios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const UsersLogins = () => {
  const { id } = useParams();
  const [logins, setLogins] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myAxios(`/admin/logins/data/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setLogins(res.data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [token, id]);

  const columns = [
    {
      name: "المستخدم",
      selector: (row) => row?.user,
      sortable: true,
    },
    {
      name: "تاريخ الدخول",
      selector: (row) => dayjs(row?.login_at).format("YYYY-MM-DD hh:mm A"),
      sortable: true,
    },
    {
      name: "IP",
      selector: (row) => row?.ip,
    },
    {
      name: "المدينة",
      selector: (row) => (
        <>
          <p className="text-sm text-light-dark font-medium">{row?.city?.city_name}</p>
        </>
      ),
    },
    {
      name: "المتصفح / النظام",
      selector: (row) => row?.browser_os,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        textAlign: "right",
      },
    },
    cells: {
      style: {
        textAlign: "right",
      },
    },
  };

  return (
    <div dir="rtl" className="text-right">
      <p className="text-2xl text-dark font-medium">سجل دخول المستخدم</p>
      <div className="border border-gray rounded-lg mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={logins}
            pagination={true}
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
};

export default UsersLogins;
