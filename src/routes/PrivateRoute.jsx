import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useMemo } from "react";

const PrivateRoute = ({ children }) => {
  const { user, token, role, loading, permissions } = useAuth();
  const { pathname } = useLocation();

  const isViewable = useMemo(() => {
    if (pathname === "/") return true;

    const routeName = pathname.split("/")[1];
    const route = permissions?.find((route) => route.name === routeName);

    return route?.view ?? false;
  }, [pathname, permissions]);

  // if (loading) {
  //   return <div className="text-center text-2xl font-medium">Loading...</div>;
  // }

  if (!loading && !isViewable) {
    toast.error("You don't have permission");
    return <Navigate to="/dashboard" />;
  }

  if (!loading && !token) {
    return <Navigate to="/" />;
  }

  if (user && token && role) return children;
};

export default PrivateRoute;
