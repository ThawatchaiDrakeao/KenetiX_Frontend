import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

// ─── API ───────────────────────────────────────────────────────────────────────
const api = {
    getProfile:     ()     => API.get("/api/users/profile").then(r => r.data.data),
    updateProfile:  (data) => API.put("/api/users/profile", data).then(r => r.data.data),
    changePassword: (data) => API.put("/api/users/profile", { password: data.newPassword }).then(r => r.data),
    getStats:       ()     => API.get("/api/users/profile/stats").then(r => r.data.data),
    getOrders:      ()     => API.get("/api/orders/my").then(r => r.data.data || []).catch(() => []),
    getRewards:     ()     => API.get("/api/rewards/points").then(r => r.data.data),
    redeemPoints:   (points) => API.post("/api/rewards/redeem", { points }).then(r => r.data),
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
        sectionId: "rental-history", label: "Rental History",
        icon: <Icon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
    },
    {
        sectionId: "pre-booking", label: "Currently Renting",
        icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
    },
    {
        sectionId: "favourites", label: "Favourite",
        icon: <Icon><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></Icon>,
    },
    {
        sectionId: "rewards", label: "Rewards",
        icon: <Icon><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/></Icon>,
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

const CurrentRentalItem = ({ brand, name, size, date, price, image }) => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center gap-6">
        <div className="w-16 h-16 bg-[#F1F5F9] rounded-lg flex items-center justify-center p-3">
            <img
                src={image || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400&h=400"}
                alt={name}
                className="w-full h-auto"
            />
        </div>
        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
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
        </div>
    </div>
);

const FavouriteProductItem = ({ id, brand, name, price, image, onRemove, onView }) => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center gap-6">
        <div className="w-16 h-16 bg-[#F1F5F9] rounded-lg flex items-center justify-center p-3">
            <img
                src={image || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400&h=400"}
                alt={name}
                className="w-full h-auto"
            />
        </div>
        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
            <div className="col-span-2">
                <p className="text-sm" style={{ color: "#94A3B8" }}>{brand}</p>
                <p className="text-lg font-bold" style={{ color: "#0F172A" }}>{name}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>
                    <span className="text-neon">฿</span>{price}
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>/ วัน</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => onView(id)}
                className="text-xs font-semibold px-4 py-2 rounded-lg border bg-neon text-neutral-950 border-neon transition-colors hover:bg-neon-hover"
            >
                เช่าเลย
            </button>
            <button
                onClick={() => onRemove(id)}
                aria-label="Remove from favourites"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-red-500 hover:bg-red-50 transition-colors"
            >
                <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>
        </div>
    </div>
);

const RewardsSection = ({ rewards, loading, error, onRetry, redeemAmount, onRedeemAmountChange, onRedeem, redeeming }) => (
    <section id="rewards" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Rewards</h2>
        </div>
        {loading ? (
            <Skeleton className="h-32 w-full" />
        ) : error ? (
            <ErrorBanner message="โหลดข้อมูลแต้มไม่ได้" onRetry={onRetry} />
        ) : (
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                        <p className="text-sm" style={{ color: "#94A3B8" }}>คะแนนสะสมของคุณ</p>
                        <p className="text-5xl font-extrabold" style={{ color: "#0F172A" }}>
                            {(rewards?.points || 0).toLocaleString()}{" "}
                            <span className="text-lg font-medium" style={{ color: "#94A3B8" }}>pts</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm" style={{ color: "#94A3B8" }}>ระดับปัจจุบัน</p>
                        <p className="text-2xl font-bold capitalize" style={{ color: "#0F172A" }}>{rewards?.level || "-"}</p>
                    </div>
                </div>

                {rewards?.nextLevel && (
                    <div>
                        <div className="flex justify-between text-xs mb-2" style={{ color: "#94A3B8" }}>
                            <span className="capitalize">{rewards.level}</span>
                            <span className="capitalize">{rewards.nextLevel} ({rewards.points}/{rewards.nextLevelPoints})</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: "#E2E8F0" }}>
                            <div
                                className="h-2 rounded-full bg-neon"
                                style={{ width: `${Math.min(100, ((rewards.points || 0) / rewards.nextLevelPoints) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                    <input
                        type="number"
                        min="1"
                        value={redeemAmount}
                        onChange={onRedeemAmountChange}
                        placeholder="จำนวนแต้มที่ต้องการแลก"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-neon/30"
                        style={{ color: "#0F172A" }}
                    />
                    <button
                        onClick={onRedeem}
                        disabled={redeeming || !redeemAmount}
                        className="text-xs font-semibold px-5 py-2.5 rounded-lg bg-neon text-neutral-950 hover:bg-neon-hover transition-colors disabled:opacity-50"
                    >
                        {redeeming ? "กำลังแลก..." : "แลกแต้ม"}
                    </button>
                </div>
            </div>
        )}
    </section>
);

const ACTIVE_STATUSES  = ["Waiting", "successful"];
const HISTORY_STATUSES = ["Done", "Fail"];

const RentalHistoryRow = ({ brand, model, size, dateRange, days, price, status }) => (
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
    </tr>
);

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
const DashboardPage = () => {
    const [activeSection,  setActiveSection]  = useState("overview");
    const [profile,        setProfile]        = useState(null);
    const [stats,          setStats]          = useState(null);
    const [activeRentals,  setActiveRentals]  = useState([]);
    const [rentalHistory,  setRentalHistory]  = useState([]);
    const [rewards,        setRewards]        = useState(null);
    const [redeemAmount,   setRedeemAmount]   = useState("");
    const [redeeming,      setRedeeming]      = useState(false);
    const [loading,        setLoading]        = useState({
        profile: true, stats: true, orders: true, rewards: true,
    });
    const [errors,         setErrors]         = useState({});
    const [modal,          setModal]          = useState(null); // "editProfile" | "changePassword"
    const [toast,          setToast]          = useState(null);

    const { logout, user } = useAuth();
    const navigate         = useNavigate();
    const { wishlist, removeFromWishlist } = useWishlist();

    const setLoad  = (key, val) => setLoading(p => ({ ...p, [key]: val }));
    const setError = (key, msg) => setErrors(p => ({ ...p, [key]: msg }));
    const clearError = (key)   => setErrors(p => { const n = { ...p }; delete n[key]; return n; });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ─── ORDERS FETCH (active rentals + history) ─────────────────────────────
    const loadOrders = useCallback(async () => {
        setLoad("orders", true);
        clearError("orders");
        try {
            const orders = await api.getOrders();
            const flatten = (statuses) => orders
                .filter(o => statuses.includes(o.status))
                .flatMap(o => (o.items || []).map(item => ({
                    rentalId: o._id,
                    brand:    item.brand || "",
                    name:     item.name,
                    model:    item.name,
                    image:    item.image,
                    size:     item.size,
                    price:    item.rentalFee,
                    days:     item.rentalDays,
                    date:     new Date(o.createdAt).toLocaleDateString("th-TH"),
                    dateRange: new Date(o.createdAt).toLocaleDateString("th-TH"),
                    status:   o.status,
                })));
            setActiveRentals(flatten(ACTIVE_STATUSES));
            setRentalHistory(flatten(HISTORY_STATUSES));
        } catch (e) {
            setError("orders", e.message);
        } finally {
            setLoad("orders", false);
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
        queueMicrotask(() => {
            load("profile", api.getProfile, setProfile);
            load("stats",   api.getStats,   setStats);
            load("rewards", api.getRewards, setRewards);
            loadOrders();
        });
    }, [loadOrders]);

    const loadRewards = useCallback(() => {
        setLoad("rewards", true); clearError("rewards");
        return api.getRewards()
            .then(setRewards)
            .catch((e) => setError("rewards", e.message))
            .finally(() => setLoad("rewards", false));
    }, []);

    const handleRedeem = async () => {
        const points = Number(redeemAmount);
        if (!points || points <= 0) return;
        setRedeeming(true);
        try {
            const res = await api.redeemPoints(points);
            await loadRewards();
            setRedeemAmount("");
            showToast(res.message || "แลกแต้มสำเร็จ!");
        } catch (e) {
            showToast(e.response?.data?.message || "แลกแต้มไม่สำเร็จ", "error");
        } finally {
            setRedeeming(false);
        }
    };

    // ─── ACTIONS ─────────────────────────────────────────────────────────────
    const handleLogout = () => { logout(); navigate("/login"); };

    const handleRentNew = () => navigate("/catalog");

    const handleProfileSaved = (updated) => {
        setProfile(prev => ({ ...prev, ...updated }));
        setModal(null);
        showToast("บันทึกข้อมูลสำเร็จ!");
    };

    const scrollToSection = useCallback((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(sectionId);
    }, []);

    // ─── SCROLL TO HASH SECTION ON LOAD ───────────────────────────────────────
    useEffect(() => {
        const sectionId = window.location.hash?.slice(1);
        if (sectionId) {
            queueMicrotask(() => scrollToSection(sectionId));
        }
    }, [scrollToSection]);

    const handleRemoveFavourite = async (productId) => {
        const ok = await removeFromWishlist(productId);
        if (ok) showToast("ลบออกจากรายการโปรดแล้ว");
    };

    const handleViewFavourite = () => navigate("/catalog");

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
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        {loading.stats ? (
                            <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
                        ) : errors.stats ? (
                            <div className="col-span-3">
                                <ErrorBanner message="โหลดสถิติไม่ได้" onRetry={() => api.getStats().then(setStats)} />
                            </div>
                        ) : (
                            <>
                                <StatCard title="Total Rentals"  value={(stats?.totalRentals || 0).toLocaleString()} detail="ทั้งหมดที่เคยเช่า" iconColor="bg-neon" />
                                <StatCard title="Active Rentals" value={stats?.activeRentals || 0} detail="กำลังเช่าอยู่ตอนนี้" />
                                <StatCard title="Return Score"   value={`${stats?.returnScore || 0}%`} detail="✓ Always returned on time" detailColor="text-green-500" />
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-10">

                            {/* CURRENTLY RENTING */}
                            <section id="pre-booking" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Currently Renting</h2>
                                </div>
                                {loading.orders ? (
                                    <div className="flex flex-col gap-5">
                                        <RentalItemSkeleton />
                                        <RentalItemSkeleton />
                                    </div>
                                ) : errors.orders ? (
                                    <ErrorBanner message="โหลดรายการเช่าไม่ได้" onRetry={loadOrders} />
                                ) : activeRentals.length === 0 ? (
                                    <p className="text-sm" style={{ color: "#94A3B8" }}>ไม่มีรายการเช่าปัจจุบัน</p>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        {activeRentals.map((rental, i) => (
                                            <CurrentRentalItem key={rental.rentalId || i} {...rental} />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* FAVOURITES */}
                            <section id="favourites" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Favourite</h2>
                                    <button onClick={handleRentNew} className="text-xs font-semibold px-4 py-2 rounded-lg border bg-neon text-neutral-950 border-neon transition-colors hover:bg-neon-hover">Browse Catalog →</button>
                                </div>
                                {wishlist.length === 0 ? (
                                    <p className="text-sm" style={{ color: "#94A3B8" }}>ยังไม่มีสินค้าที่กดถูกใจ</p>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        {wishlist.map((item) => {
                                            const product       = item.productId && typeof item.productId === "object" ? item.productId : item;
                                            const productId     = item.productId?._id || item.productId || item._id;
                                            const defaultVariant = product?.variants?.[0];
                                            const image          = defaultVariant?.images?.[0] || null;
                                            const price          = product?.rentalPlan?.[0]?.["1day"] || 0;
                                            return (
                                                <FavouriteProductItem
                                                    key={productId}
                                                    id={productId}
                                                    brand={product?.brand || ""}
                                                    name={product?.modelName || "Product"}
                                                    price={price}
                                                    image={image}
                                                    onRemove={handleRemoveFavourite}
                                                    onView={handleViewFavourite}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </section>

                            {/* REWARDS */}
                            <RewardsSection
                                rewards={rewards}
                                loading={loading.rewards}
                                error={errors.rewards}
                                onRetry={loadRewards}
                                redeemAmount={redeemAmount}
                                onRedeemAmountChange={(e) => setRedeemAmount(e.target.value)}
                                onRedeem={handleRedeem}
                                redeeming={redeeming}
                            />

                            {/* RENTAL HISTORY */}
                            <section id="rental-history" className={`bg-white border border-[#E2E8F0] rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold" style={{ color: "#0F172A" }}>Rental History</h2>
                                </div>

                                {errors.orders && (
                                    <div className="mb-4">
                                        <ErrorBanner message="โหลดประวัติการเช่าไม่ได้" onRetry={loadOrders} />
                                    </div>
                                )}

                                <table className="w-full text-left">
                                    <thead className="border-b border-[#E2E8F0] text-xs uppercase tracking-wide" style={{ color: "#94A3B8" }}>
                                        <tr>
                                            {["Shoes", "Size", "Date", "Days", "Price", "Status"].map((th) => (
                                                <th key={th} className="py-4 font-semibold text-center">{th}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading.orders ? (
                                            <><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></>
                                        ) : rentalHistory.length === 0 && !errors.orders ? (
                                            <tr>
                                                <td colSpan={6} className="py-10 text-center text-sm" style={{ color: "#94A3B8" }}>ไม่พบประวัติการเช่า</td>
                                            </tr>
                                        ) : (
                                            rentalHistory.map((row, i) => (
                                                <RentalHistoryRow key={i} {...row} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </section>
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
