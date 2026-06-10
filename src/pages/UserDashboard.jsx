import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function UserDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?._id) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await API.get(`/api/users/${user._id}`);
                if (res.data.success) {
                    setProfile(res.data.data);
                } else {
                    setError("Could not load profile");
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Please log in to view your dashboard.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-lime-400 text-black py-2 px-6 rounded-xl font-semibold"
                >
                    Retry
                </button>
            </div>
        );
    }

    const userData = profile || user;

    return (
        <div className="min-h-screen bg-[#080809] text-white font-sora">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 space-y-8">
                {/* ── Profile Section ── */}
                <section className="bg-[#0f0f10] border border-[#1e1e20] rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-zinc-400">Name:</span>{" "}
                            <span className="text-white">{userData.name} {userData.surname}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400">Email:</span>{" "}
                            <span className="text-white">{userData.email}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400">Role:</span>{" "}
                            <span className="text-white capitalize">{userData.role || "user"}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400">Rank:</span>{" "}
                            <span className="text-white capitalize">{userData.userRank || "bronze"}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="text-zinc-400">Address:</span>{" "}
                            <span className="text-white">{userData.address || "Not set"}</span>
                        </div>
                    </div>
                </section>

                {/* ── Stats Overview ── */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Rentals", value: "0" },
                        { label: "Active Rentals", value: "0" },
                        { label: "Return Score", value: "100%" },
                        { label: "Reward Points", value: "0" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl p-4 text-center"
                        >
                            <p className="text-2xl font-bold text-[#C3FF51]">{stat.value}</p>
                            <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* ── Active Rentals Placeholder ── */}
                <section className="bg-[#0f0f10] border border-[#1e1e20] rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-3">Active Rentals</h2>
                    <div className="text-zinc-500 text-sm py-8 text-center">
                        No active rentals yet.{" "}
                        <a href="/catalog" className="text-[#C3FF51] hover:underline">
                            Browse shoes
                        </a>
                    </div>
                </section>

                {/* ── Notifications Placeholder ── */}
                <section className="bg-[#0f0f10] border border-[#1e1e20] rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-3">Notifications</h2>
                    <div className="text-zinc-500 text-sm py-4">
                        No new notifications.
                    </div>
                </section>

                {/* ── Quick Actions ── */}
                <section className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="/catalog"
                        className="bg-[#C3FF51] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#d3ff70] transition"
                    >
                        Rent Shoes
                    </a>
                    <a
                        href="/howitworkspage"
                        className="border border-zinc-700 text-white font-semibold py-3 px-6 rounded-xl hover:border-[#C3FF51] transition"
                    >
                        How It Works
                    </a>
                </section>
            </main>
        </div>
    );
}
