import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import API from "../api/axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// ───────────────────────────── API LAYER ─────────────────────────────
async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "API Error");
    }

    return res.json();
}

const api = {
    getProfile: () => apiFetch("/user/profile"),
    updateProfile: (b) =>
        apiFetch("/user/profile", {
            method: "PUT",
            body: JSON.stringify(b),
        }),

    getStats: () => apiFetch("/user/stats"),
    getActiveRentals: () => apiFetch("/rentals/active"),
    getNotifications: () => apiFetch("/notifications"),

    markNotificationRead: (id) =>
        apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),

    getRewards: () => apiFetch("/rewards/points"),
    redeemPoints: (b) =>
        apiFetch("/rewards/redeem", {
            method: "POST",
            body: JSON.stringify(b),
        }),

    getFavBrands: () => apiFetch("/user/brands"),

    getRentalHistory: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiFetch(`/rentals/history${qs ? `?${qs}` : ""}`);
    },

    getPayments: () => apiFetch("/payments"),

    getTracking: (id) => apiFetch(`/rentals/${id}/tracking`),

    getPrebooking: () => apiFetch("/rentals/prebooking"),
};

// ───────────────────────────── UI COMPONENTS ─────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
    <div className="bg-red-900 text-red-200 p-3 rounded flex justify-between">
        {message}
        {onRetry && (
            <button onClick={onRetry} className="text-sm underline">
                Retry
            </button>
        )}
    </div>
);

// ───────────────────────────── DASHBOARD ─────────────────────────────
export default function DashboardPage() {
    // ─── STATE ───
    const [profile, setProfile] = useState(null);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({});

    const [stats, setStats] = useState(null);
    const [activeRentals, setActiveRentals] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [payments, setPayments] = useState(null);
    const [prebooking, setPrebooking] = useState([]);
    const [rewards, setRewards] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ───────────────────────────── INIT LOAD ─────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const [
                    profile,
                    stats,
                    rentals,
                    notifications,
                    payments,
                    rewards,
                    prebooking,
                ] = await Promise.all([
                    api.getProfile(),
                    api.getStats(),
                    api.getActiveRentals(),
                    api.getNotifications(),
                    api.getPayments(),
                    api.getRewards(),
                    api.getPrebooking(),
                ]);

                setProfile(profile);
                setStats(stats);
                setActiveRentals(rentals);
                setNotifications(notifications);
                setPayments(payments);
                setRewards(rewards);
                setPrebooking(prebooking);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ───────────────────────────── PROFILE UPDATE ─────────────────────────────
    const saveProfile = async () => {
        try {
            const updated = await api.updateProfile(profileForm);
            setProfile(updated);
            setEditingProfile(false);
        } catch (e) {
            alert(e.message);
        }
    };

    // ───────────────────────────── NOTIFICATIONS ─────────────────────────────
    const markRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (e) {
            console.error(e);
        }
    };

    // ───────────────────────────── REDEEM POINTS ─────────────────────────────
    const redeem = async () => {
        try {
            const res = await api.redeemPoints({ points: 500 });
            setRewards((prev) => ({
                ...prev,
                points: res.remaining,
            }));
        } catch (e) {
            alert(e.message);
        }
    };

    // ───────────────────────────── UI ─────────────────────────────
    if (loading) return <div className="p-10 text-white">Loading...</div>;
    if (error) return <ErrorBanner message={error} />;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10 space-y-10">

            {/* ───────── PROFILE ───────── */}
            <section className="p-6 bg-neutral-900 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Profile</h2>

                {!editingProfile ? (
                    <>
                        <p>{profile.name}</p>
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                        <p>{profile.address}</p>

                        <button
                            onClick={() => {
                                setProfileForm(profile);
                                setEditingProfile(true);
                            }}
                            className="mt-3 text-lime-400"
                        >
                            Edit
                        </button>
                    </>
                ) : (
                    <div className="space-y-2">
                        <input
                            value={profileForm.phone || ""}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, phone: e.target.value })
                            }
                            className="w-full p-2 bg-neutral-800"
                            placeholder="Phone"
                        />

                        <input
                            value={profileForm.address || ""}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, address: e.target.value })
                            }
                            className="w-full p-2 bg-neutral-800"
                            placeholder="Address"
                        />

                        <button onClick={saveProfile} className="bg-lime-400 text-black p-2">
                            Save
                        </button>
                    </div>
                )}
            </section>

            {/* ───────── STATS ───────── */}
            <section className="grid grid-cols-4 gap-4">
                <div className="bg-neutral-900 p-4 rounded">
                    Rentals: {stats.totalRentals}
                </div>
                <div className="bg-neutral-900 p-4 rounded">
                    Active: {stats.activeRentals}
                </div>
                <div className="bg-neutral-900 p-4 rounded">
                    Points: {rewards.points}
                </div>
                <div className="bg-neutral-900 p-4 rounded">
                    Score: {stats.returnScore}%
                </div>
            </section>

            {/* ───────── PAYMENTS ───────── */}
            <section className="bg-neutral-900 p-6 rounded">
                <h2 className="text-xl mb-3">Payments</h2>

                <p>Balance: ฿{payments.balance}</p>
                <p>Outstanding: ฿{payments.outstanding}</p>

                {payments.methods.map((m) => (
                    <div key={m.id}>
                        {m.type} •••• {m.last4}
                    </div>
                ))}
            </section>

            {/* ───────── LOGISTICS ───────── */}
            <section className="bg-neutral-900 p-6 rounded">
                <h2 className="text-xl mb-3">Active Rentals</h2>

                {activeRentals.map((r) => (
                    <RentalCard key={r.rentalId} rental={r} />
                ))}
            </section>

            {/* ───────── NOTIFICATIONS ───────── */}
            <section className="bg-neutral-900 p-6 rounded">
                <h2 className="text-xl mb-3">Notifications</h2>

                {notifications.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`p-2 cursor-pointer ${n.read ? "opacity-50" : ""}`}
                    >
                        {n.title}
                    </div>
                ))}
            </section>

            {/* ───────── PREBOOKING ───────── */}
            <section className="bg-neutral-900 p-6 rounded">
                <h2 className="text-xl mb-3">Pre-booking</h2>

                {prebooking.map((p) => (
                    <div key={p.id}>
                        {p.brand} {p.model} — {p.availableDate}
                    </div>
                ))}
            </section>

            {/* ───────── REWARDS ───────── */}
            <section className="bg-neutral-900 p-6 rounded">
                <h2 className="text-xl mb-3">Rewards</h2>

                <p>{rewards.points} pts</p>

                <button onClick={redeem} className="bg-lime-400 text-black p-2 mt-2">
                    Redeem 500
                </button>
            </section>
        </div>
    );
}

// ───────────────────────────── RENTAL CARD ─────────────────────────────
function RentalCard({ rental }) {
    const [tracking, setTracking] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getTracking(rental.rentalId);
                setTracking(data);
            } catch (e) { }
        })();
    }, [rental.rentalId]);

    return (
        <div className="border p-3 mb-2">
            <p>{rental.name}</p>
            <p>Status: {tracking?.status || "loading..."}</p>
            <p>ETA: {tracking?.eta}</p>
        </div>
    );
}