import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAuthStore.getState().auth.username;

  if (!username) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};
