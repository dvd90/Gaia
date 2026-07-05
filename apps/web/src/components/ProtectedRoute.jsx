import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
