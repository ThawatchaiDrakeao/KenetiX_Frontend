import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
    const { user } = useAuth();


    const isAdmin = user && (
        user.role === "ADMIN" ||
        user.role === "admin" ||
        user.userRank === "admin"
    );

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
}