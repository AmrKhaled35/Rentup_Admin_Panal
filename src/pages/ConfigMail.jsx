import { useEffect, useState } from "react";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import iconChevronRight from "../assets/images/chevron-right.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import validateFields from "../utils/validateFields";

const ConfigMail = () => {
  const [mailer, setMailer] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("");
  const [mailFromAddress, setMailFromAddress] = useState("");
  const [mailFromName, setMailFromName] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();

  useEffect(() => {
    setLoading(true);
    myAxios("/admin/mail-config", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data.data;
        setMailer(data.mailer);
        setHost(data.host);
        setPort(data.port);
        setUserName(data.username);
        setPassword(data.password);
        setEncryption(data.encryption);
        setMailFromAddress(data.mail_from_address);
        setMailFromName(data.mail_from_name);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleUpdate = () => {
    if (
      !validateFields([
        host,
        port,
        userName,
        password,
        encryption,
        mailFromAddress,
        mailFromName,
        mailer,
      ])
    ) {
      return toast.error("يرجى ملء جميع الحقول!");
    }

    const toastId = toast.loading("جاري التحديث...");
    const body = {
      host,
      port,
      username: userName,
      password,
      encryption,
      mail_from_address: mailFromAddress,
      mail_from_name: mailFromName,
      mailer,
    };

    myAxios
      .post("/admin/mail-config", body, {
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
    const route = permissions?.find((route) => route.name === "mail-config");
    return route?.edit;
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">إعدادات البريد</p>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
        <Link to="/">
          <p className="text-green-500">لوحة التحكم</p>
        </Link>
        <img src={iconChevronRight} />
        <p className="text-light-dark">إعدادات البريد</p>
      </div>

      <div className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xl font-medium text-dark">البريد الإلكتروني (Mailer)</p>
                <input
                  onChange={(e) => setMailer(e.target.value)}
                  value={mailer}
                  type="text"
                  placeholder="أدخل البريد الإلكتروني"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">المضيف (Host)</p>
                <input
                  onChange={(e) => setHost(e.target.value)}
                  value={host}
                  type="text"
                  placeholder="أدخل المضيف"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">المنفذ (Port)</p>
                <input
                  onChange={(e) => setPort(e.target.value)}
                  value={port}
                  type="text"
                  placeholder="أدخل رقم المنفذ"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">اسم المستخدم</p>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">كلمة المرور</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text"
                  placeholder="أدخل كلمة المرور"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">التشفير (Encryption)</p>
                <input
                  onChange={(e) => setEncryption(e.target.value)}
                  value={encryption}
                  type="text"
                  placeholder="أدخل نوع التشفير"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">البريد المرسل منه (Mail From Address)</p>
                <input
                  onChange={(e) => setMailFromAddress(e.target.value)}
                  value={mailFromAddress}
                  type="text"
                  placeholder="أدخل البريد المرسل منه"
                  className="h-10 w-full lg:w-3/5 bg-white rounded-lg border border-gray outline-none text-sm text-light-dark px-5 mt-2"
                />
              </div>

              <div>
                <p className="text-xl font-medium text-dark">الاسم المرسل منه (Mail From Name)</p>
                <input
                  onChange={(e) => setMailFromName(e.target.value)}
                  value={mailFromName}
                  type="text"
                  placeholder="أدخل الاسم المرسل منه"
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

export default ConfigMail;
