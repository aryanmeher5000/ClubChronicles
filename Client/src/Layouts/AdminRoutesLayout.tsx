import { Outlet } from "react-router-dom";
import AuthorizationDeniedPage from "../ErrorPages/AuthorizationDeniedPage";
import useClientStateManagement from "../store";

const AdminRoutesLayout = () => {
  const { profile } = useClientStateManagement();
  if (!profile || !profile.isAdmin) return <AuthorizationDeniedPage />;

  return <Outlet />;
};

export default AdminRoutesLayout;
