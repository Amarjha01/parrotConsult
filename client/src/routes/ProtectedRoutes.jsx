import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRole }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = JSON.parse(localStorage.getItem("user")); // ✅ fixed string key

  const isUser = user?.role === "user";          // ✅ safe check
  const isConsultant = user?.role === "consultant"; // ✅ based on role field
  console.log(isUser , isConsultant);
  
  const isAuthorized = {
    admin: !!admin,
    consultant: !!isConsultant,
    user: !!isUser,
  };

  if (isAuthorized[allowedRole]) {
    return children; 
  }

  // ❌ access denied → role-based redirect
  switch (allowedRole) {
    case "admin":
      return <Navigate to="/adminsecuredlogin" />;
    case "consultant":
    case "user":
    default:
      return <Navigate to="/" />;
  }
};

export default ProtectedRoutes;
