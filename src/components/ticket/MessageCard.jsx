import dayjs from "dayjs";
import { Link } from "react-router-dom";
import adminAttachment from "../../assets/images/admin-attachment.svg";
import userAttachment from "../../assets/images/user-attachment.svg";
import dui from "../../assets/images/defaultUser.jpg";

const MessageCard = ({ data }) => {
  const { user_id, message, created_at, attachments, user } = data;
  const userImg = user?.user_img
    ? `${import.meta.env.VITE_IMG_URL}/${user?.user_img}`
    : dui;

  return (
    <div
      className={`${
        user_id
          ? "border-skyBlue bg-skyBlue/10"
          : "border-[#E46A11] bg-[#E46A11]/10"
      } border p-4 grid lg:grid-cols-[200px_1fr]`}
    >
      <div
        className={`lg:border-r pr-4 text-xl font-semibold flex lg:justify-center items-center gap-5 ${
          user_id ? "border-skyBlue" : "border-[#E46A11]"
        }`}
      >
        <img
          src={userImg}
          alt=""
          width={34}
          height={34}
          className={`rounded-full border-2 ${
            user_id ? "border-skyBlue" : "border-[#E46A11]"
          }`}
        />
        <p
          className={`my-2 text-dark ${
            user_id ? "text-skyBlue" : "text-[#E46A11]"
          }`}
        >
          {user_id ? user?.name : "Admin"}
        </p>
      </div>
      <div className="pl-4">
        <p className="font-semibold text-dark my-2">
          Posted on {dayjs(created_at).format("dddd, D MMMM YYYY [@] hh:mm A")}
        </p>
        <p className="text-light-dark">{message}</p>
        {attachments.length > 0 &&
          attachments.map((item, index) => (
            <Link
              key={item.id}
              to={`${import.meta.env.VITE_IMG_URL}/${item.file}`}
              className="text-skyBlue mt-2 flex items-center gap-2"
            >
              <img
                src={user_id ? userAttachment : adminAttachment}
                alt=""
                width={14}
                height={14}
              />
              Attachment {index + 1}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MessageCard;
