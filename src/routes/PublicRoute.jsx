import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // if (loading) {
  //   return <div className="text-center text-2xl font-medium">Loading...</div>;
  // }

  return !loading && !token ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
