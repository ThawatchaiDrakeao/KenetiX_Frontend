import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ActionButton from "../components/ActionButton";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/api/users/login", {
                email,
                password,
            });

            console.log("Login response:", response.data);

            // Backend uses cookie-based auth (withCredentials: true)
            // Response: { success: true, message: "...", user: {...} }
            const body = response.data?.data || response.data;
            const userData = body.user;

            if (!userData) {
                console.error("Unexpected response format:", response.data);
                setError("Invalid response from server — check console");
                return;
            }

            login(userData);

            const userRole = userData.role;
            if (userRole === "ADMIN" || userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/userdashboard");
            }
        } catch (error) {
            console.error("Login error:", error);

            try {
                const staffResponse = await API.post("/api/staff/admin/login", {
                    email,
                    password,
                });

                const staffBody = staffResponse.data?.data || staffResponse.data;
                const staffToken = staffBody.accessToken || staffBody.token;
                const staffUser = staffBody.user;

                if (staffToken && staffUser) {
                    setAuthToken(staffToken);
                    login(staffUser);
                    navigate("/admin");
                    return;
                }
            } catch (staffError) {
                const msg =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Login Failed";
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto py-20 px-4">
                <div className="bg-[#12121a] p-8 rounded-2xl border border-gray-800 shadow-2xl">
                    <h2 className="text-4xl font-bold mb-6 text-center text-white">
                        Login
                    </h2>

                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-left mt-5 text-sm text-gray-400 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-left text-sm text-gray-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <ActionButton
                            text={loading ? "Signing In..." : "Sign In"}
                        />
                    </form>
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-blue-500 cursor-pointer hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-white text-sm transition-all mt-2 underline"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
