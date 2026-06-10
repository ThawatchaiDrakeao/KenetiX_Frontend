import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";

function Login() {
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLanguage();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        let authResponse = null;

        // 1. Try User Login
        try {
            authResponse = await API.post("/api/users/login", { email, password });
        } catch (userError) {
            // User login failed, let's try Staff Login next
            try {
                authResponse = await API.post("/api/staff/admin/login", { email, password });
            } catch (staffError) {
                // Both failed
                const message = staffError.response?.data?.message || userError.response?.data?.message || t("login.loginFailed");
                setError(message);
            }
        }

        // 2. If either login succeeded, process the session here
        if (authResponse && authResponse.data) {
            setAuthToken(authResponse.data.accessToken);
            login(authResponse.data.user);

            const userRole = authResponse.data.user.role;
            if (userRole === "ADMIN" || userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/userdashboard");
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 font-sora"
            style={{ background: "#F8FAFC" }}>
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "#94A3B8" }}>
                        {t("login.runningShoeRental")}
                    </p>
                    <Link to="/">
                        <span className="text-[28px] font-extrabold tracking-widest text-black">
                            KINETI<span className="text-[#C3FF51]">X</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8"
                    style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

                    <h2 className="text-2xl font-bold mb-1" style={{ color: "#000000" }}>
                        {t("login.title")}
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
                        {t("login.desc")}
                    </p>

                    {error && (
                        <div className="mb-5 rounded-xl px-4 py-3 text-sm"
                            style={{ background: "#FEE2E2", border: "1px solid #FECACA", color: "#DC2626" }}>
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin} noValidate>
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: "#64748B" }}>
                                {t("login.emailLabel")}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("login.emailPlaceholder")}
                                required
                                className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors"
                                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
                                onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
                                onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: "#64748B" }}>
                                {t("login.passwordLabel")}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("login.passwordPlaceholder")}
                                required
                                className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors"
                                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
                                onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
                                onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2 active:scale-[0.98]"
                            style={loading
                                ? { background: "#E2E8F0", color: "#94A3B8", cursor: "not-allowed" }
                                : { background: "#C3FF51", color: "#0F172A" }}>
                            {loading ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>

                    <div className="mt-6 space-y-3 text-center">
                        <p className="text-sm" style={{ color: "#64748B" }}>
                            {t("login.noAccount")}{" "}
                            <Link to="/signup"
                                className="font-medium transition-colors"
                                style={{ color: "#4D7C0F" }}
                                onMouseEnter={(e) => { e.target.style.color = "#C3FF51"; }}
                                onMouseLeave={(e) => { e.target.style.color = "#4D7C0F"; }}>
                                {t("login.signUp")}
                            </Link>
                        </p>
                        <Link to="/"
                            className="block text-sm transition-colors"
                            style={{ color: "#94A3B8" }}
                            onMouseEnter={(e) => { e.target.style.color = "#0F172A"; }}
                            onMouseLeave={(e) => { e.target.style.color = "#94A3B8"; }}>
                            {t("login.backToHome")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
