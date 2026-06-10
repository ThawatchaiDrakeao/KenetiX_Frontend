import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  const loginAdmin = (adminData, token) => {
    setAdmin({ ...adminData, token });
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() {
  return useContext(AdminAuthContext);
}