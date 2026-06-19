import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

const CustomerProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default CustomerProtectedRoute;
