import { useState } from "react";
import useAuth from "../hooks/useAuth";
import bg from "../assets/images/login-bg.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <div className="bg-white overflow-hidden" dir="rtl">
      <div className="w-full container mx-auto flex justify-center lg:justify-between items-center gap-4 min-h-screen px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[600px] rounded-[20px] px-4 sm:px-10 py-0 sm:py-14 shadow-none sm:shadow-[0_2px_17px_0px_rgba(0,0,0,0.12)] flex-1"
        >
          <div className="w-full text-center text-dark font-bold text-[30px] sm:text-[36px] mb-[40px]">
            تسجيل الدخول
          </div>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[52px] sm:h-[58px] px-5 border border-solid border-[#E6E6EB] rounded-[10px] text-[#787878] text-[16px] sm:text-[20px] font-[400] mb-[15px] text-right"
            placeholder="البريد الإلكتروني"
            required
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[52px] sm:h-[58px] px-5 border border-solid border-[#E6E6EB] rounded-[10px] text-[#787878] text-[16px] sm:text-[20px] font-[400] mb-[15px] text-right"
            placeholder="كلمة المرور"
            required
          />
          <button
            type="submit"
            className="w-full h-[52px] sm:h-[58px] flex justify-center items-center py-[14px] rounded-[10px] text-white bg-green-500 text-[16px] sm:text-[20px] font-[700]"
          >
            تسجيل الدخول
          </button>
        </form>
        <div className="flex-1 hidden lg:flex justify-center">
          <img src={bg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
