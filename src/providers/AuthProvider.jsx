import { createContext, useCallback, useEffect, useState } from "react";
import myAxios from "../utils/myAxios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");
    const storedPermissions = JSON.parse(localStorage.getItem("permission"));

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(storedUser);
      setRole(storedRole);
      setPermissions(storedPermissions);
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    const toastId = toast.loading("Loading...");
    const data = { email, password };
    try {
      const res = await myAxios.post("/admins-login", data);
      if (res.data.status === "success") {
        toast.dismiss(toastId);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        const { token, user } = res.data;
        const role = user.admin_type.type;
        const roleParameters = user.admin_type.role_parameters;

        setUser(user);
        setToken(token);
        setRole(role);
        setPermissions(roleParameters);

        localStorage.setItem("userToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);
        localStorage.setItem("permission", JSON.stringify(roleParameters));
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      const res = await myAxios.post(
        "/admin/logout/admin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === "success") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logout successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setUser(null);
      setRole("");
      setToken(null);
      setPermissions([]);
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("permission");
    }
  }, [token]);

  const value = {
    user,
    role,
    token,
    loading,
    loginUser,
    logoutUser,
    permissions,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
