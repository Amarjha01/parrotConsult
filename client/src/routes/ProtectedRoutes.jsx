import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRole }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const consultant = JSON.parse(localStorage.getItem("consultant"));
  const user = JSON.parse(localStorage.getItem("user"));

  const isAuthorized = {
    admin: !!admin,
    consultant: !!consultant,
    user: !!user,
  };

  if (isAuthorized[allowedRole]) {
    return children;
  }

  // Role-based redirection
  switch (allowedRole) {
    case "admin":
      return <Navigate to="/adminsecuredlogin" />;
    case "consultant":
    case "user":
      return <Navigate to="/" />;
    default:
      return <Navigate to="/" />;
  }
};

export default ProtectedRoutes;
