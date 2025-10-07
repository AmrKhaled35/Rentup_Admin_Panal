import { Link } from "react-router-dom";
import arrowRight from "../../assets/images/arrow-right.svg";

const Card = ({ title, count, icon, bg, link }) => {
  return (
    <div
      className="px-6 py-7 !bg-white border border-[#F0F2F5] rounded-md flex items-center gap-4 shadow-sm"
      style={{
        background: `url(${bg}) no-repeat bottom right`,
      }}
    >
      <img src={icon} alt="" width={42} height={42} className="rounded" />
      <div>
        <p className="text-sm font-medium text-[#8081A2]">{title}</p>
        <p className="text-xl font-semibold mt-[6px]">{count}</p>
      </div>
      {link && (
        <Link to={link} className="ms-auto">
          <img src={arrowRight} alt="" width={11} height={6} />
        </Link>
      )}
    </div>
  );
};

export default Card;
