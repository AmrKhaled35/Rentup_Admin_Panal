import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import myAxios from "../utils/myAxios";
import MessageCard from "../components/ticket/MessageCard";
import toast from "react-hot-toast";

const TicketDetails = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [messageData, setMessageData] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      myAxios(`/customer/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setMessageData(res.data.data))
        .catch((err) => console.log(err.message));
    }
  }, [token, refetch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    files?.forEach((file, index) => {
      formData.append(`file[${index}]`, file);
    });
    formData.append("message", message);
    formData.append("ticket_id", id);

    myAxios
      .post("/customer/messages", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessage("");
        setFiles([]);
        if (res.data.status === "success") {
          setRefetch((p) => !p);
        }
      })
      .catch((err) => console.log(err?.response?.data?.message));
  };

  const handleCloseTicket = () => {
    const toastId = toast.loading("جاري التحديث...");

    myAxios(`/admin/close-tickets/${id}`, {
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
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">الرد على التذكرة</p>
      <div className="bg-white rounded-md shadow-sm mt-6">
        <div className="flex justify-between items-center px-5 py-3">
          <p>رقم التذكرة: {messageData[0]?.support_ticket?.ticket_id}</p>
          <button
            onClick={handleCloseTicket}
            className="text-red bg-light-red border border-red px-3 py-2 rounded-md text-xs"
          >
            إغلاق التذكرة
          </button>
        </div>
        <hr className="border-gray" />
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div>
              <p className="font-medium">الرسالة</p>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-40 px-5 py-2 mt-3 border border-[#E6E6EB] rounded-lg resize-none focus:ring-0 focus:border-[#E6E6EB] form-textarea"
                value={message}
                required
              />
            </div>
            <div className="mt-5">
              <p className="font-medium">المرفقات</p>
              <input
                onChange={(e) => setFiles([...e.target.files])}
                type="file"
                multiple
                className="w-full text-sm text-grayA6 border border-[#E6E6EB] rounded-lg cursor-pointer mt-3 file:mr-4 file:h-11 file:px-4 file:border-0 file:text-sm file:bg-slate-100"
              />
            </div>
            <button
              type="submit"
              className="mt-7 py-2 w-full bg-[#3EA570] text-white font-medium rounded-lg disabled:bg-[#3EA570]/50"
              disabled={!messageData[0]?.support_ticket?.status}
            >
              إرسال الرد
            </button>
          </div>
        </form>
        {messageData.length > 0 && (
          <div className="p-5 rounded-md space-y-4 mt-5">
            {messageData.map((item) => (
              <MessageCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
