import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const employee = JSON.parse(localStorage.getItem("pssemployee"));

  if (!employee) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {/* You can add common layout here like header, sidebar, etc. */}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default AuthLayout;
