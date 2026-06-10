/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

// Mock admin credentials (จะเชื่อม API จริงทีหลัง)
const MOCK_ADMIN = {
  email: "admin@delivery.com",
  password: "password123",
  name: "Admin Delivery",
  role: "ADMIN",
  _id: "6a2024a4d1f4eeb792e06584",
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAdmin, admin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) navigate("/admin");
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock login — จะเปลี่ยนเป็น API call จริงทีหลัง
    setTimeout(() => {
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        loginAdmin(
          { name: MOCK_ADMIN.name, email: MOCK_ADMIN.email, role: MOCK_ADMIN.role, _id: MOCK_ADMIN._id },
          "mock-jwt-token"
        );
        // navigation handled by useEffect above
      } else {
        setError("Email หรือ Password ไม่ถูกต้อง");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo }
        <div className="text-center mb-8">
          <p className="text-neon text-3xl font-bold font-sora tracking-widest">KINETIX</p>
          <p className="text-gray-500 text-sm font-sora mt-1">Admin Portal</p>
        </div>

        {/* Card }
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold font-sora mb-6">Sign in to Admin</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-xs font-sora mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@delivery.com"
                required
                className="w-full bg-dark-elevated border border-dark-border text-white text-sm rounded-xl px-4 py-3 font-sora placeholder-gray-600 focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-sora mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-dark-elevated border border-dark-border text-white text-sm rounded-xl px-4 py-3 font-sora placeholder-gray-600 focus:outline-none focus:border-neon/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-sora text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon text-dark font-semibold font-sora text-sm py-3 rounded-xl hover:bg-neon-hover transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-600 text-xs font-sora text-center mt-6">
            สำหรับ Admin เท่านั้น
          </p>
        </div>

        {/* Hint }
        <div className="mt-4 bg-dark-elevated border border-dark-border rounded-xl p-3 text-center">
          <p className="text-gray-500 text-xs font-sora">Demo: admin@delivery.com / password123</p>
        </div>
      </div>
    </div>
  );
}
*/