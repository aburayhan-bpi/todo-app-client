import { Navigate, useLocation, useNavigate } from "react-router";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  if (!user && user?.email) {
    return <Loader />;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={location.pathname}></Navigate>;
};

export default PrivateRoute;
