import { useEffect, useState } from "react";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ConfigPusher = () => {
  const [pusher_app_id, setPusher_app_id] = useState("");
  const [pusher_app_key, setPusher_app_key] = useState("");
  const [pusher_app_secret, setPusher_app_secret] = useState("");
  const [pusher_host, setPusher_host] = useState("");
  const [pusher_port, setPusher_port] = useState("");
  const [pusher_scheme, setPusher_scheme] = useState("");
  const [pusher_app_cluster, setPusher_app_cluster] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/pusher-config", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data.data;
        setPusher_app_id(data.pusher_app_id);
        setPusher_app_key(data.pusher_app_key);
        setPusher_app_secret(data.pusher_app_secret);
        setPusher_host(data.pusher_host);
        setPusher_port(data.pusher_port);
        setPusher_scheme(data.pusher_scheme);
        setPusher_app_cluster(data.pusher_app_cluster);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (
      !validateFields([
        pusher_app_id,
        pusher_app_key,
        pusher_app_secret,
        pusher_host,
        pusher_port,
        pusher_scheme,
        pusher_app_cluster,
      ])
    ) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحديث...");
    const body = {
      pusher_app_id,
      pusher_app_key,
      pusher_app_secret,
      pusher_host,
      pusher_port,
      pusher_scheme,
      pusher_app_cluster,
    };

    myAxios
      .post("/admin/pusher-config", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          setRefetch((p) => !p);
          toast.success("تم التحديث بنجاح");
        } else {
          toast.error(res.data?.message);
        }
      });
  };

  const isEditable = () => {
    const route = permissions?.find((route) => route.name === "pusher-config");
    return route?.edit;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إعدادات Pusher</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">إعدادات Pusher</p>
      </div>

      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xl font-medium text-dark">App ID</p>
                <input
                  onChange={(e) => setPusher_app_id(e.target.value)}
                  value={pusher_app_id}
                  type="text"
                  placeholder="أدخل App ID"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">App Key</p>
                <input
                  onChange={(e) => setPusher_app_key(e.target.value)}
                  value={pusher_app_key}
                  type="text"
                  placeholder="أدخل App Key"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">App Secret</p>
                <input
                  onChange={(e) => setPusher_app_secret(e.target.value)}
                  value={pusher_app_secret}
                  type="text"
                  placeholder="أدخل App Secret"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">Host</p>
                <input
                  onChange={(e) => setPusher_host(e.target.value)}
                  value={pusher_host}
                  type="text"
                  placeholder="أدخل المضيف"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">Port</p>
                <input
                  onChange={(e) => setPusher_port(e.target.value)}
                  value={pusher_port}
                  type="text"
                  placeholder="أدخل المنفذ"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">Scheme</p>
                <input
                  onChange={(e) => setPusher_scheme(e.target.value)}
                  value={pusher_scheme}
                  type="text"
                  placeholder="أدخل نوع Scheme"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">App Cluster</p>
                <input
                  onChange={(e) => setPusher_app_cluster(e.target.value)}
                  value={pusher_app_cluster}
                  type="text"
                  placeholder="أدخل App Cluster"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>
            </div>

            {isEditable() && (
              <div className="text-end w-full lg:w-3/5">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-10 py-2 text-lg font-semibold rounded-lg mt-10"
                >
                  تحديث
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPusher;
