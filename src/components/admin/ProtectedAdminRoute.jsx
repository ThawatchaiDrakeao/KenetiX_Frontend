import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
    const { admin } = useAdminAuth();
    const { user } = useAuth();

    const isAdmin =
        (admin && admin.role === "ADMIN") ||
        (user && user.role === "ADMIN");

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
