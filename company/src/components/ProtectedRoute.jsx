import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");

      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  }, [token, navigate]);

  if (!token) return null;

  return children;
};

export default ProtectedRoute;
