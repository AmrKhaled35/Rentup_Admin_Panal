import { useEffect, useState } from "react";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ConfigGoogle = () => {
  const [google_client_id, setGoogle_client_id] = useState("");
  const [google_client_secret, setGoogle_client_secret] = useState("");
  const [google_redirect_uri, setGoogle_redirect_uri] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/google-config", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data.data;
        setGoogle_client_id(data.google_client_id);
        setGoogle_client_secret(data.google_client_secret);
        setGoogle_redirect_uri(data.google_redirect_uri);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (
      !validateFields([
        google_client_id,
        google_client_secret,
        google_redirect_uri,
      ])
    ) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحديث...");
    const body = {
      google_client_id,
      google_client_secret,
      google_redirect_uri,
    };

    myAxios
      .post("/admin/google-config", body, {
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
    const route = permissions?.find((route) => route.name === "google-config");
    return route?.edit;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إعدادات Google</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">إعدادات Google</p>
      </div>

      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xl font-medium text-dark">Client ID</p>
                <input
                  onChange={(e) => setGoogle_client_id(e.target.value)}
                  value={google_client_id}
                  type="text"
                  placeholder="أدخل Client ID"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">Client Secret</p>
                <input
                  onChange={(e) => setGoogle_client_secret(e.target.value)}
                  value={google_client_secret}
                  type="text"
                  placeholder="أدخل Client Secret"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">Redirect URL</p>
                <input
                  onChange={(e) => setGoogle_redirect_uri(e.target.value)}
                  value={google_redirect_uri}
                  type="text"
                  placeholder="أدخل Redirect URL"
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

export default ConfigGoogle;
