import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import CheckOut from "./pages/CheckOut";
import AdminDashboard from "./pages/AdminDashboard";
import CommunityPage from "./pages/CommunityPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import SignupPage from "./components/SignupPage";
import OrderConfirmation from "./pages/OrderConfirmation";

export default function App() {
    return (
        <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/catalog"         element={<Catalog />} />
            <Route path="/login"           element={<Login />} />
            <Route path="/signup"          element={<SignupPage />} />
            <Route path="/userdashboard"   element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />
            <Route path="/howitworkspage"  element={<HowItWorksPage />} />
            <Route path="/contact"         element={<ContactPage />} />
            <Route path="/community"       element={<CommunityPage />} />
            <Route path="/checkout"        element={<CheckOut />} />
            <Route
                path="/admin"
                element={
                    <ProtectedAdminRoute>
                        <AdminDashboard />
                    </ProtectedAdminRoute>
                }
            />
            <Route path="*" element={<Home />} />
            <Route path="/orderconfirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
    );
}
