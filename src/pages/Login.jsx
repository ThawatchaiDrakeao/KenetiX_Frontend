import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useLanguage } from "../context/useLanguage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loginAdmin } = useAdminAuth();

  const MOCK_ADMIN = { email: "admin@delivery.com", password: "password123" };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock admin shortcut
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      loginAdmin({
        name: "Admin Delivery",
        email,
        role: "ADMIN",
        _id: "6a2024a4d1f4eeb792e06584",
      });
      setLoading(false);
      navigate("/admin");
      return;
    }

    try {
      const response = await API.post("/api/users/login", { email, password });
      const userData = response.data.user;
      localStorage.setItem("token", response.data.accessToken);
      login(userData);
      if (userData.role === "ADMIN") {
        loginAdmin(userData);
        navigate("/admin");
      } else {
        navigate("/userdashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F8FAFC" }}
    >
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-sora tracking-[0.25em] uppercase mb-2"
            style={{ color: "#94A3B8" }}
          >
            Running Shoe Rental
          </p>
          <h1
            className="text-4xl font-bold font-sora"
            style={{ color: "#0F172A" }}
          >
            KINE<span style={{ color: "#C3FF51" }}>TIX</span>
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="text-2xl font-semibold font-sora mb-1"
            style={{ color: "#0F172A" }}
          >
            Sign in to your account
          </h2>
          <p className="text-sm font-sora mb-6" style={{ color: "#94A3B8" }}>
            Enter your credentials to continue
          </p>

          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm font-sora"
              style={{
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                color: "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin} noValidate>
            <div>
              <label
                className="block text-xs font-sora mb-1.5"
                style={{ color: "#64748B" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full text-sm rounded-xl px-4 py-3 font-sora focus:outline-none transition-colors"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  color: "#0F172A",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C3FF51";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-sora mb-1.5"
                style={{ color: "#64748B" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full text-sm rounded-xl px-4 py-3 font-sora focus:outline-none transition-colors"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  color: "#0F172A",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C3FF51";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold font-sora text-sm transition-all mt-2"
              style={
                loading
                  ? {
                      background: "#E2E8F0",
                      color: "#94A3B8",
                      cursor: "not-allowed",
                    }
                  : { background: "#C3FF51", color: "#0F172A" }
              }
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm font-sora" style={{ color: "#64748B" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium font-sora transition-colors"
                style={{ color: "#4D7C0F" }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#C3FF51";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#4D7C0F";
                }}
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/"
              className="block text-sm font-sora transition-colors"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => {
                e.target.style.color = "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#94A3B8";
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
