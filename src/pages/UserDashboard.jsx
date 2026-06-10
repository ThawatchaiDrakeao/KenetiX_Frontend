import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

// ─── API ───────────────────────────────────────────────────────────────────────
const api = {
    getProfile:       ()         => API.get("/api/users/profile").then(r => r.data),
    updateProfile:    (data)     => API.put("/api/users/profile", data).then(r => r.data),
    changePassword:   (data)     => API.put("/api/users/change-password", data).then(r => r.data),
    getStats:         ()         => API.get("/api/users/profile/stats").then(r => r.data),
    getActiveRentals: ()         => API.get("/api/rentals/active").then(r => r.data).catch(() => []),
    getNotifications: ()         => API.get("/api/notifications").then(r => r.data).catch(() => []),
    getRewards:       ()         => API.get("/api/rewards/points").then(r => r.data).catch(() => null),
    getFavBrands:     ()         => API.get("/api/user/brands").then(r => r.data).catch(() => []),
    getRentalHistory: (params={}) => {
        const qs = new URLSearchParams(params).toString();
        return API.get(`/api/rentals/history${qs ? `?${qs}` : ""}`).then(r => r.data).catch(() => ({ data: [], total: 0, page: 1 }));
    },
    exportHistory: async () => {
        const res = await API.get("/api/rentals/history/export", { responseType: "blob" });
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url; a.download = "rental-history.csv"; a.click();
        URL.revokeObjectURL(url);
    },
    createRental: (body) => API.post("/api/rentals", body).then(r => r.data),
    redeemPoints: (body) => API.post("/api/rewards/redeem", body).then(r => r.data),
};

// ─── SKELETON ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-[#E2E8F0] rounded-lg ${className}`} />
);

const StatCardSkeleton = () => (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex-1 min-w-[200px]">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-12 w-24 mb-4" />
        <Skeleton className="h-3 w-36" />
    </div>
);

const RentalItemSkeleton = () => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center gap-6">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
);

const TableRowSkeleton = () => (
    <tr className="border-b border-[#E2E8F0]">
        {[...Array(7)].map((_, i) => (
            <td key={i} className="py-5 px-2"><Skeleton className="h-4 w-full" /></td>
        ))}
    </tr>
);

// ─── ERROR BANNER ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
    <div className="bg-red-950 border border-red-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
        <p className="text-red-400 text-sm">⚠ {message}</p>
        {onRetry && (
            <button onClick={onRetry} className="text-xs font-semibold text-red-300 border border-red-700 px-3 py-1.5 rounded-lg hover:bg-red-900 transition-colors">
                ลองใหม่
            </button>
        )}
    </div>
);

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border rounded-xl px-5 py-4 text-sm shadow-xl ${
        type === "error"
            ? "bg-red-950 border-red-800 text-red-300"
            : "bg-neutral-900 border-neon/40 text-neon"
    }`}>
        <span>{message}</span>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-2 text-base">✕</button>
    </div>
);

// ─── MODAL WRAPPER ─────────────────────────────────────────────────────────────
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
);

// ─── EDIT PROFILE MODAL ────────────────────────────────────────────────────────
const EditProfileModal = ({ profile, onClose, onSave }) => {
    const [form, setForm] = useState({
        name:                profile?.name                || "",
        phone:               profile?.phone               || "",
        address:             profile?.address             || "",
        shoe_size:           profile?.shoe_size           || "",
        bank_name:           profile?.bank_name           || "",
        bank_account_number: profile?.bank_account_number || "",
        bank_account_name:   profile?.bank_account_name   || "",
    });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState("");

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true); setError("");
        try {
            const updated = await api.updateProfile(form);
            onSave(updated);
        } catch (e) {
            setError(e.response?.data?.message || "บันทึกไม่สำเร็จ กรุณาลองใหม่");
        } finally {
            setSaving(false);
        }
    };

    const inp = "w-full bg-neutral-800 border border-neutral-700 text-neutral-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-neon transition-colors placeholder:text-neutral-600";

    return (
        <Modal onClose={onClose}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg transition-colors">✕</button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-950 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Full Name</label>
                        <input name="name" value={form.name} onChange={handleChange} className={inp} />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Email <span className="text-neutral-700">(cannot be changed)</span></label>
                        <input value={profile?.email || ""} disabled className={`${inp} opacity-40 cursor-not-allowed`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5">Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} className={inp} />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5">Shoe Size</label>
                            <input name="shoe_size" type="number" value={form.shoe_size} onChange={handleChange} className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Address</label>
                        <textarea name="address" rows={2} value={form.address} onChange={handleChange} className={`${inp} resize-none`} />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 pt-2">Bank Information</p>
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Bank Name</label>
                        <input name="bank_name" value={form.bank_name} onChange={handleChange} className={inp} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5">Account Number</label>
                            <input name="bank_account_number" value={form.bank_account_number} onChange={handleChange} className={inp} />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5">Account Name</label>
                            <input name="bank_account_name" value={form.bank_account_name} onChange={handleChange} className={inp} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-400 text-sm font-semibold hover:border-neutral-600 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-neon text-neutral-950 text-sm font-bold disabled:opacity-60 hover:bg-neon-hover transition-all">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ─── CHANGE PASSWORD MODAL ─────────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose, onSuccess }) => {
    const [form, setForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState("");

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        if (form.newPassword !== form.confirmPassword) { setError("New passwords do not match"); return; }
        if (form.newPassword.length < 8)               { setError("Password must be at least 8 characters"); return; }
        setSaving(true); setError("");
        try {
            await api.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
            onSuccess();
        } catch (e) {
            setError(e.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        } finally {
            setSaving(false);
        }
    };

    const inp = "w-full bg-neutral-800 border border-neutral-700 text-neutral-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-neon transition-colors";

    return (
        <Modal onClose={onClose}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Change Password</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg transition-colors">✕</button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-950 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Current Password</label>
                        <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className={inp} />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">New Password</label>
                        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className={inp} />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1.5">Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inp} />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-400 text-sm font-semibold hover:border-neutral-600 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-neon text-neutral-950 text-sm font-bold disabled:opacity-60 hover:bg-neon-hover transition-all">
                        {saving ? "Saving..." : "Update"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ─── SIDEBAR NAV ITEMS ─────────────────────────────────────────────────────────
const Icon = ({ children }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const MAIN_NAV = [
    {
        sectionId: "overview", label: "Overview",
        icon: <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></Icon>,
    },
    {
        sectionId: "notifications", label: "Notifications", badgeKey: "notifCount",
        icon: <Icon><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>,
    },
    {
        sectionId: "rental-history", label: "Rental History",
        icon: <Icon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
    },
    {
        sectionId: "reward-points", label: "Reward Points",
        icon: <Icon><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></Icon>,
    },
    {
        sectionId: "pre-booking", label: "Favourite",
        icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
    },
];

const ACCOUNT_NAV = [
    {
        key: "editProfile", label: "Profile",
        icon: <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
    },
    {
        key: "changePassword", label: "Security",
        icon: <Icon><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
    },
];

const SECTION_SCROLL_MARGIN = "scroll-mt-24";

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────────────────
const StatCard = ({ title, value, detail, detailColor, iconColor }) => (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 py-10 flex-1 min-w-[200px]">
        <div className="flex items-center justify-between gap-4">
            <div className="text-sm" style={{ color: "#64748B" }}>{title}</div>
            {iconColor && <div className={`w-3 h-3 rounded-full ${iconColor}`} />}
        </div>
        <div className="text-5xl font-extrabold my-4 flex items-baseline" style={{ color: "#0F172A" }}>
            {iconColor ? <span className="text-neon">฿</span> : ""} {value}
        </div>
        <p className={`text-sm ${detailColor || ""}`} style={!detailColor ? { color: "#64748B" } : {}}>{detail}</p>
    </div>
);

const UserLevelBadge = ({ level, isActive }) => (
    <span
        className="text-xs font-semibold px-4 py-1.5 rounded-full border"
        style={isActive
            ? { background: "rgba(195,255,81,0.15)", color: "#4D7C0F", borderColor: "#C3FF51" }
            : { background: "#F8FAFC", color: "#94A3B8", borderColor: "#E2E8F0" }}
    >
        {level.toUpperCase()}
    </span>
);

const CurrentRentalItem = ({ brand, name, size, date, price, rentalId, onOrder, disabled }) => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center gap-6">
        <div className="w-16 h-16 bg-[#F1F5F9] rounded-lg flex items-center justify-center p-3">
            <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400&h=400"
                alt={name}
                className="w-full h-auto"
            />
        </div>
        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
            <div className="col-span-2">
                <p className="text-sm" style={{ color: "#94A3B8" }}>{brand}</p>
                <p className="text-lg font-bold" style={{ color: "#0F172A" }}>{name}</p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>Size {size} ∙ Start {date}</p>
            </div>
            <div className="col-span-2 text-right">
                <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>
                    <span className="text-neon">฿</span>{price}
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>/ วัน</p>
            </div>
            <div className="text-right">
                <button
                    onClick={() => onOrder(rentalId)}
                    disabled={disabled}
                    className="bg-neon text-neutral-950 font-bold px-5 py-2 rounded-lg text-sm hover:bg-neon-hover disabled:opacity-50 transition-colors"
                >
                    Order
                </button>
            </div>
        </div>
    </div>
);

const RentalHistoryRow = ({ brand, model, size, dateRange, days, price, status, onReRent }) => (
    <tr className="border-b border-[#E2E8F0] text-sm" style={{ color: "#64748B" }}>
        <td className="py-5 font-bold" style={{ color: "#0F172A" }}>
            <p className="text-xs font-normal" style={{ color: "#94A3B8" }}>{brand}</p>
            {model}
        </td>
        <td className="py-5 text-center">{size}</td>
        <td className="py-5 text-center">{dateRange}</td>
        <td className="py-5 text-center">{days}</td>
        <td className="py-5 text-center font-bold" style={{ color: "#0F172A" }}>
            <span className="text-neon">฿</span>{price}
        </td>
        <td className="py-5 text-center">{status}</td>
        <td className="py-5 text-right">
            <button
                onClick={() => onReRent({ brand, model, size })}
                className="text-xs px-4 py-1.5 rounded-lg border transition-colors hover:border-neon hover:text-[#4D7C0F]"
                style={{ background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }}
            >
                Re-rent
            </button>
        </td>
    </tr>
);

const ActivityItem = ({ title, time, type }) => {
    const iconColors = {
        check:   "bg-green-500",
        points:  "bg-neon",
        cancel:  "bg-red-500",
        upgrade: "bg-yellow-400",
        booked:  "bg-orange-500",
    };
    return (
        <div className="flex gap-4 items-start py-3">
            <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${iconColors[type] || "bg-[#CBD5E1]"}`} />
            <div>
                <p className="text-sm" style={{ color: "#0F172A" }}>{title}</p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>{time}</p>
            </div>
        </div>
    );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
const DashboardPage = () => {
    const [activeSection,  setActiveSection]  = useState("overview");
    const [profile,        setProfile]        = useState(null);
    const [stats,          setStats]          = useState(null);
    const [activeRentals,  setActiveRentals]  = useState([]);
    const [notifications,  setNotifications]  = useState([]);
    const [rewards,        setRewards]        = useState(null);
    const [favBrands,      setFavBrands]      = useState([]);
    const [rentalHistory,  setRentalHistory]  = useState([]);
    const [historyMeta,    setHistoryMeta]    = useState({ total: 0, page: 1 });
    const [loading,        setLoading]        = useState({
        profile: true, stats: true, activeRentals: true,
        notifications: true, rewards: true, favBrands: true, history: true,
    });
    const [errors,         setErrors]         = useState({});
    const [historySearch,  setHistorySearch]  = useState("");
    const [historyBrand,   setHistoryBrand]   = useState("All");
    const [orderLoading,   setOrderLoading]   = useState(null);
    const [redeemLoading,  setRedeemLoading]  = useState(false);
    const [exportLoading,  setExportLoading]  = useState(false);
    const [modal,          setModal]          = useState(null); // "editProfile" | "changePassword"
    const [toast,          setToast]          = useState(null);

    const { logout, user } = useAuth();
    const navigate         = useNavigate();
    const isFirstRender    = useRef(true);

    const setLoad  = (key, val) => setLoading(p => ({ ...p, [key]: val }));
    const setError = (key, msg) => setErrors(p => ({ ...p, [key]: msg }));
    const clearError = (key)   => setErrors(p => { const n = { ...p }; delete n[key]; return n; });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ─── RENTAL HISTORY FETCH ─────────────────────────────────────────────────
    const loadHistory = useCallback(async ({ q, brand, page }) => {
        setLoad("history", true);
        clearError("history");
        try {
            const params = { page: page || 1 };
            if (q)                   params.q     = q;
            if (brand && brand !== "All") params.brand = brand;
            const res = await api.getRentalHistory(params);
            setRentalHistory(res.data);
            setHistoryMeta({ total: res.total, page: res.page });
        } catch (e) {
            setError("history", e.message);
        } finally {
            setLoad("history", false);
        }
    }, []);

    // ─── INITIAL FETCH ────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async (key, fn, setter) => {
            setLoad(key, true); clearError(key);
            try   { setter(await fn()); }
            catch (e) { setError(key, e.message); }
            finally   { setLoad(key, false); }
        };
        load("profile",       api.getProfile,        setProfile);
        load("stats",         api.getStats,           setStats);
        load("activeRentals", api.getActiveRentals,   setActiveRentals);
        load("notifications", api.getNotifications,   setNotifications);
        load("rewards",       api.getRewards,         setRewards);
        load("favBrands",     api.getFavBrands,       setFavBrands);
        loadHistory({ q: "", brand: "All", page: 1 });
    }, [loadHistory]);

    // ─── DEBOUNCED HISTORY SEARCH ─────────────────────────────────────────────
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const t = setTimeout(() => {
            loadHistory({ q: historySearch, brand: historyBrand, page: 1 });
        }, 400);
        return () => clearTimeout(t);
    }, [historySearch, historyBrand, loadHistory]);

    // ─── ACTIONS ─────────────────────────────────────────────────────────────
    const handleLogout = () => { logout(); navigate("/login"); };

    const handleOrder = async (rentalId) => {
        setOrderLoading(rentalId);
        try {
            await api.createRental({ rentalId, action: "order" });
            setActiveRentals(await api.getActiveRentals());
            showToast("สั่งซื้อสำเร็จ!");
        } catch (e) {
            showToast(`สั่งซื้อไม่สำเร็จ: ${e.message}`, "error");
        } finally {
            setOrderLoading(null);
        }
    };

    const handleReRent = async ({ brand, model, size }) => {
        try {
            await api.createRental({ brand, model, size, action: "re-rent" });
            const [updatedRentals, updatedStats] = await Promise.all([api.getActiveRentals(), api.getStats()]);
            setActiveRentals(updatedRentals);
            setStats(updatedStats);
            showToast("Re-rent สำเร็จ!");
        } catch (e) {
            showToast(`Re-rent ไม่สำเร็จ: ${e.message}`, "error");
        }
    };

    const handleRentNew = () => showToast("เร็วๆ นี้: เปิดหน้าเลือกรองเท้า", "success");

    const handleRedeem = async () => {
        setRedeemLoading(true);
        try {
            const res = await api.redeemPoints({ points: 500 });
            setRewards(await api.getRewards());
            showToast(`แลกสำเร็จ! คะแนนคงเหลือ: ${res.remaining}`);
        } catch (e) {
            showToast(`แลกคะแนนไม่สำเร็จ: ${e.message}`, "error");
        } finally {
            setRedeemLoading(false);
        }
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            await api.exportHistory();
            showToast("Export สำเร็จ!");
        } catch (e) {
            showToast(`Export ไม่สำเร็จ: ${e.message}`, "error");
        } finally {
            setExportLoading(false);
        }
    };

    const handleProfileSaved = (updated) => {
        setProfile(prev => ({ ...prev, ...updated }));
        setModal(null);
        showToast("บันทึกข้อมูลสำเร็จ!");
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(sectionId);
    };

    const notifCount  = notifications.length;
    const progressPct = rewards
        ? Math.min(Math.round((rewards.points / rewards.nextLevelPoints) * 100), 100)
        : 0;

    return (
        <div className="min-h-screen font-sans flex flex-col antialiased pt-16 lg:pt-18" style={{ background: "#F8FAFC" }}>

            <Navbar />

            {/* Modals */}
            {modal === "editProfile" && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setModal(null)}
                    onSave={handleProfileSaved}
                />
            )}
            {modal === "changePassword" && (
                <ChangePasswordModal
                    onClose={() => setModal(null)}
                    onSuccess={() => { setModal(null); showToast("เปลี่ยนรหัสผ่านสำเร็จ!"); }}
                />
            )}

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Main Layout */}
            <div className="flex flex-1">

                {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
                <aside
                    className="flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden"
                    style={{ width: "280px", background: "#F8FAFC", borderRight: "1px solid #E2E8F0" }}
                >
                    {/* Nav */}
                    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">

                        <p className="text-[10px] font-semibold uppercase tracking-wider px-3 mb-1" style={{ color: "#94A3B8" }}>Menu</p>
                        {MAIN_NAV.map((item) => {
                            const isActive = activeSection === item.sectionId;
                            return (
                                <motion.button
                                    key={item.sectionId}
                                    onClick={() => scrollToSection(item.sectionId)}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[13px] relative"
                                    style={{
                                        background: isActive ? "rgba(195,255,81,0.12)" : "transparent",
                                        color: isActive ? "#0F172A" : "#64748B",
                                        transition: "background 150ms ease, color 150ms ease",
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; } }}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="user-active-bar"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                                            style={{ background: "#4D7C0F" }}
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    <span className="shrink-0">{item.icon}</span>
                                    <span className="flex-1 truncate font-medium">{item.label}</span>
                                    {item.badgeKey === "notifCount" && notifCount > 0 && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded min-w-[18px] text-center" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                                            {notifCount}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}

                        <p className="text-[10px] font-semibold uppercase tracking-wider px-3 mb-1 mt-4" style={{ color: "#94A3B8" }}>Account</p>
                        {ACCOUNT_NAV.map((item) => (
                            <motion.button
                                key={item.key}
                                onClick={() => setModal(item.key)}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[13px]"
                                style={{ color: "#64748B", transition: "background 150ms ease, color 150ms ease" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="flex-1 truncate font-medium">{item.label}</span>
                            </motion.button>
                        ))}
                    </nav>

                    {/* User card */}
                    <div className="px-4 py-4 shrink-0" style={{ borderTop: "1px solid #E2E8F0" }}>
                        {loading.profile ? (
                            <div className="flex items-center gap-3 px-1">
                                <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-2.5 w-32" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-1">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                                    style={{ background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" }}
                                >
                                    {profile?.initials || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: "#0F172A" }}>
                                        {profile?.name || "User"}
                                    </p>
                                    <p className="text-[11px] truncate leading-tight" style={{ color: "#94A3B8" }}>
                                        {profile?.email || ""}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="shrink-0 p-1 rounded transition-colors"
                                    style={{ color: "#CBD5E1" }}
                                    title="Logout"
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "#CBD5E1"; }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                        <polyline points="16 17 21 12 16 7"/>
                                        <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
                <main className="flex-1 p-12" style={{ background: "#F8FAFC" }}>

                    {/* HEADER */}
                    <div id="overview" className={`flex items-center justify-between mb-10 ${SECTION_SCROLL_MARGIN}`}>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#0F172A" }}>
                                Welcome back, {(user?.name || profile?.name)?.split(" ")[0]} 👋
                            </h1>
                            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Last updated Today</p>
                        </div>
                        <button
                            onClick={handleRentNew}
                            className="bg-neon text-neutral-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-neon/20 hover:bg-neon-hover transition-colors"
                        >
                            <span className="font-extrabold text-lg">+</span>
                            Rent New Shoes
                        </button>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {loading.stats ? (
                            <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
                        ) : errors.stats ? (
                            <div className="col-span-4">
                                <ErrorBanner message="โหลดสถิติไม่ได้" onRetry={() => api.getStats().then(setStats)} />
                            </div>
                        ) : (
                            <>
                                <StatCard title="Total Rentals"  value={(stats?.totalRentals || 0).toLocaleString()} detail="↑ 1.2% from last month" iconColor="bg-neon" />
                                <StatCard title="Active Rentals" value={stats?.activeRentals || 0} detail="Pairs ∙ Return in 5 days" />
                                <StatCard title="Reward Points"  value={(stats?.points || 0).toLocaleString()} detail={`${((rewards?.nextLevelPoints || 3000) - (stats?.points || 0))} more points to ${rewards?.nextLevel || "Platinum"}`} />
                                <StatCard title="Return Score"   value={`${stats?.returnScore || 0}%`} detail="✓ Always returned on time" detailColor="text-green-500" />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="col-span-8 flex flex-col gap-10">

                            {/* CURRENTLY RENTING */}
                            <section id="pre-booking" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Favourite</h2>
                                    <a href="#" className="text-xs font-semibold px-4 py-2 rounded-lg border bg-neon text-neutral-950 border-neon transition-colors hover:bg-neon-hover">View All →</a>
                                </div>
                                {loading.activeRentals ? (
                                    <div className="flex flex-col gap-5">
                                        <RentalItemSkeleton />
                                        <RentalItemSkeleton />
                                    </div>
                                ) : errors.activeRentals ? (
                                    <ErrorBanner message="โหลดรายการเช่าไม่ได้" onRetry={() => api.getActiveRentals().then(setActiveRentals)} />
                                ) : activeRentals.length === 0 ? (
                                    <p className="text-sm" style={{ color: "#94A3B8" }}>ไม่มีรายการเช่าปัจจุบัน</p>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        {activeRentals.map((rental, i) => (
                                            <CurrentRentalItem
                                                key={rental.rentalId || i}
                                                {...rental}
                                                onOrder={handleOrder}
                                                disabled={orderLoading === rental.rentalId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* RENTAL HISTORY */}
                            <section id="rental-history" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Rental History</h2>
                                    <button
                                        onClick={handleExport}
                                        disabled={exportLoading}
                                        className="text-sm font-medium disabled:opacity-50 transition-colors hover:text-[#4D7C0F]"
                                        style={{ color: "#94A3B8" }}
                                    >
                                        {exportLoading ? "กำลัง Export..." : "Export CSV →"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-6 border border-[#E2E8F0] rounded-2xl p-2" style={{ background: "#F8FAFC" }}>
                                    <input
                                        type="search"
                                        placeholder="Search by brand, model, date..."
                                        value={historySearch}
                                        onChange={(e) => setHistorySearch(e.target.value)}
                                        className="flex-1 bg-transparent text-sm px-3 py-2.5 rounded-lg border-r border-[#E2E8F0] focus:ring-0 focus:outline-none placeholder:text-[#94A3B8]"
                                        style={{ color: "#0F172A" }}
                                    />
                                    <div className="flex items-center gap-1.5 pl-1">
                                        {["All", "Nike", "Adidas", "ASICS", "Hoka", "Brooks"].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setHistoryBrand(filter)}
                                                className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${
                                                    historyBrand === filter
                                                        ? "bg-neon text-neutral-950 border-neon"
                                                        : "border-[#E2E8F0] hover:border-neon hover:text-[#4D7C0F]"
                                                }`}
                                                style={historyBrand !== filter ? { color: "#64748B" } : {}}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {errors.history && (
                                    <div className="mb-4">
                                        <ErrorBanner message="โหลดประวัติการเช่าไม่ได้" onRetry={() => loadHistory({ q: historySearch, brand: historyBrand, page: 1 })} />
                                    </div>
                                )}

                                <table className="w-full text-left">
                                    <thead className="border-b border-[#E2E8F0] text-xs uppercase tracking-wide" style={{ color: "#94A3B8" }}>
                                        <tr>
                                            {["Shoes", "Size", "Date", "Days", "Price", "Status", ""].map((th) => (
                                                <th key={th} className={`py-4 font-semibold text-center ${th === "" ? "text-right" : ""}`}>{th}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading.history ? (
                                            <><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></>
                                        ) : rentalHistory.length === 0 && !errors.history ? (
                                            <tr>
                                                <td colSpan={7} className="py-10 text-center text-sm" style={{ color: "#94A3B8" }}>ไม่พบรายการที่ค้นหา</td>
                                            </tr>
                                        ) : (
                                            rentalHistory.map((row, i) => (
                                                <RentalHistoryRow key={i} {...row} onReRent={handleReRent} />
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {historyMeta.total > 5 && (
                                    <div className="flex justify-between items-center mt-6 text-sm" style={{ color: "#94A3B8" }}>
                                        <span>ทั้งหมด {historyMeta.total} รายการ</span>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={historyMeta.page <= 1}
                                                onClick={() => loadHistory({ q: historySearch, brand: historyBrand, page: historyMeta.page - 1 })}
                                                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] disabled:opacity-40 transition-colors"
                                            >
                                                ← ก่อนหน้า
                                            </button>
                                            <button
                                                disabled={historyMeta.page * 5 >= historyMeta.total}
                                                onClick={() => loadHistory({ q: historySearch, brand: historyBrand, page: historyMeta.page + 1 })}
                                                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] disabled:opacity-40 transition-colors"
                                            >
                                                ถัดไป →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* RIGHT COLUMN */}
                        <aside className="col-span-4 flex flex-col gap-10">

                            {/* REWARD POINTS */}
                            <section id="reward-points" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Reward Points</h2>
                                    <button
                                        onClick={handleRedeem}
                                        disabled={redeemLoading || loading.rewards}
                                        className="text-sm font-medium disabled:opacity-50 transition-colors hover:text-[#4D7C0F]"
                                        style={{ color: "#94A3B8" }}
                                    >
                                        {redeemLoading ? "กำลังแลก..." : "Redeem"}
                                    </button>
                                </div>

                                {loading.rewards ? (
                                    <>
                                        <Skeleton className="h-4 w-20 mb-3" />
                                        <Skeleton className="h-10 w-32 mb-6" />
                                        <Skeleton className="h-8 w-full rounded-full" />
                                    </>
                                ) : errors.rewards ? (
                                    <ErrorBanner message="โหลด Reward ไม่ได้" />
                                ) : (
                                    <>
                                        <p className="text-4xl font-black mb-6 flex items-baseline gap-2" style={{ color: "#0F172A" }}>
                                            {(rewards?.points || 0).toLocaleString()}
                                            <span className="text-2xl font-bold text-[#0F172A] hover:text-neon transition-colors cursor-default">Points</span>
                                        </p>
                                        <div className="relative pt-6 border-t border-[#E2E8F0] mt-6">
                                            <p className="absolute -top-3 right-0 bg-white text-xs px-2" style={{ color: "#64748B" }}>
                                                {rewards?.nextLevel} requires{" "}
                                                <span className="font-bold" style={{ color: "#0F172A" }}>{(rewards?.nextLevelPoints || 0).toLocaleString()} Points</span>
                                            </p>
                                            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mb-4">
                                                <div
                                                    className="h-full bg-neon rounded-full transition-all duration-700"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {["bronze", "gold", "silver", "platinum", "diamond"].map((lvl) => (
                                                    <UserLevelBadge
                                                        key={lvl}
                                                        level={lvl}
                                                        isActive={lvl === rewards?.level?.toLowerCase()}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>

                            {/* FAVORITE BRANDS */}
                            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Favourite Brands</h2>
                                    <a href="#" className="text-sm font-medium transition-colors hover:text-[#4D7C0F]" style={{ color: "#94A3B8" }}>Edit</a>
                                </div>
                                {loading.favBrands ? (
                                    <div className="grid grid-cols-3 gap-5">
                                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                                    </div>
                                ) : errors.favBrands ? (
                                    <ErrorBanner message="โหลดแบรนด์ไม่ได้" />
                                ) : (
                                    <div className="grid grid-cols-3 gap-5">
                                        {favBrands.map((brand) => (
                                            <div key={brand.name} className="border border-[#E2E8F0] rounded-2xl p-5 flex flex-col items-center gap-2.5" style={{ background: "#F8FAFC" }}>
                                                <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center font-black text-2xl text-neon border border-[#E2E8F0]">
                                                    {brand.name === "New Balance" ? "NB" : brand.name === "ASICS" ? "AS" : brand.name.slice(0, 1).toUpperCase()}
                                                </div>
                                                <p className="text-sm font-bold" style={{ color: "#0F172A" }}>{brand.name}</p>
                                                <p className="text-xs" style={{ color: "#94A3B8" }}>{brand.count} times</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* RECENT ACTIVITY */}
                            <section id="notifications" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Recent Activity</h2>
                                </div>
                                {loading.notifications ? (
                                    <div className="flex flex-col gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <Skeleton className="w-2.5 h-2.5 mt-1.5 rounded-full" />
                                                <div className="flex-1 flex flex-col gap-1.5">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : errors.notifications ? (
                                    <ErrorBanner message="โหลด Activity ไม่ได้" />
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {notifications.map((activity, i) => (
                                            <ActivityItem key={i} {...activity} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </aside>
                    </div>
                </main>
            </div>

            <footer className="border-t border-[#E2E8F0] text-center py-6 text-xs" style={{ background: "#F8FAFC", color: "#94A3B8" }}>
                © 2026 KINETIX · All rights reserved ·{" "}
                <a href="/privacy" className="transition-colors hover:text-[#64748B]">Privacy Policy</a>
            </footer>
        </div>
    );
};

export default DashboardPage;
