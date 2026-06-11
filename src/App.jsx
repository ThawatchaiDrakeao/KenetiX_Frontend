import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import ProtectedUserRoute from "./components/ProtectedUserRoute.jsx";
import SignupPage from "./components/SignupPage.jsx";
import OrderConfirmation from "./pages/Orderconfirmation.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/userdashboard"
        element={
          <ProtectedUserRoute>
            <UserDashboard />
          </ProtectedUserRoute>
        }
      />
      <Route path="/howitworkspage" element={<HowItWorksPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route path="*" element={<Home />} />
      <Route
        path="/orderconfirmation/:orderId"
        element={<OrderConfirmation />}
      />
    </Routes>
  );
}
