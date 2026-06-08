import { useState, useEffect, useCallback } from "react";

// ─── API CONFIG ────────────────────────────────────────────────────────────────
// 🔧 [CONFIG] เปลี่ยน URL ใน .env ให้ตรงกับ backend จริง
// dev  → VITE_API_BASE_URL=http://localhost:8000/api
// prod → VITE_API_BASE_URL=https://api.kinetix.com/api
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// 🔧 [AUTH] ฟังก์ชันนี้แนบ Bearer token ทุก request
// token ต้องได้มาจากหน้า Login แล้ว save ลง localStorage ก่อน
// ถ้าใช้ httpOnly cookie แทน → ลบ Authorization header ออก แล้วเพิ่ม credentials: "include"
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
        // 🔧 [ERROR FORMAT] backend ต้องส่ง error กลับในรูปแบบ { "detail": "ข้อความ error" }
        // ถ้า backend ใช้ format อื่น เช่น { "message": "..." } → แก้ err.detail เป็น err.message
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `API error ${res.status}`);
    }
    return res.json();
}

// ─── API CALLS ─────────────────────────────────────────────────────────────────
const api = {
    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /user/profile                                            │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   name: "Somchai Runner",   ← ชื่อแสดงผลบน sidebar + header   │
    // │   email: "somchai@...",     ← อีเมลใต้ชื่อ                     │
    // │   level: "Elite",           ← badge สีเขียว (Elite/Platinum)   │
    // │   initials: "SR"            ← 2 ตัวอักษรในวงกลม avatar         │
    // │ }                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getProfile: () => apiFetch("/user/profile"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /user/stats                                              │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   totalRentals: 7840,   ← StatCard "Total Rentals"             │
    // │   activeRentals: 2,     ← StatCard "Active Rentals"            │
    // │   points: 2340,         ← StatCard "Reward Points"             │
    // │   returnScore: 100      ← StatCard "Return Score" (%)          │
    // │ }                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getStats: () => apiFetch("/user/stats"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /rentals/active                                          │
    // │ ต้องส่งกลับมา: array ของรายการที่กำลังเช่าอยู่                  │
    // │ [                                                               │
    // │   {                                                             │
    // │     rentalId: "R001",   ← ใช้เป็น key และส่งกลับตอน Order      │
    // │     brand: "NIKE",                                              │
    // │     name: "Pegasus 41",                                         │
    // │     size: 42,                                                   │
    // │     date: "Apr 8 – Return Apr 15",                              │
    // │     price: 150          ← ราคาต่อวัน (฿)                       │
    // │   },                                                            │
    // │   ...                                                           │
    // │ ]                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getActiveRentals: () => apiFetch("/rentals/active"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /notifications                                           │
    // │ ต้องส่งกลับมา: array ของ activity ล่าสุด                        │
    // │ [                                                               │
    // │   {                                                             │
    // │     title: "Successfully rented Hoka Clifton 9",               │
    // │     time: "Today 09:15",                                        │
    // │     type: "booked"   ← booked | check | points | cancel |      │
    // │                         upgrade (กำหนดสีจุดใน ActivityItem)     │
    // │   },                                                            │
    // │   ...                                                           │
    // │ ]                                                               │
    // │ หมายเหตุ: จำนวน item ใน array = ตัวเลข badge บน sidebar        │
    // └─────────────────────────────────────────────────────────────────┘
    getNotifications: () => apiFetch("/notifications"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /rewards/points                                          │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   points: 2340,             ← คะแนนปัจจุบัน                    │
    // │   level: "Elite",           ← ระดับปัจจุบัน (highlight badge)   │
    // │   nextLevel: "Platinum",    ← ระดับถัดไป                       │
    // │   nextLevelPoints: 3000     ← คะแนนที่ต้องถึง → คำนวณ progress │
    // │ }                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getRewards: () => apiFetch("/rewards/points"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /user/brands                                             │
    // │ ต้องส่งกลับมา: array ของแบรนด์ที่เช่าบ่อย เรียงตามจำนวนครั้ง   │
    // │ [                                                               │
    // │   { name: "Nike", count: 10 },                                  │
    // │   { name: "Hoka", count: 12 },                                  │
    // │   ...                                                           │
    // │ ]                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getFavBrands: () => apiFetch("/user/brands"),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /rentals/history                                         │
    // │ รับ query params:                                               │
    // │   ?q=ultraboost     ← ค้นหาจาก brand หรือ model               │
    // │   &brand=Nike       ← กรองตามแบรนด์ (ถ้าเลือก "All" ไม่ส่ง)   │
    // │   &page=1           ← หน้าปัจจุบัน (pageSize = 5)              │
    // │                                                                 │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   data: [                                                       │
    // │     {                                                           │
    // │       brand: "ADIDAS",                                          │
    // │       model: "Ultraboost 23",                                   │
    // │       size: 42,                                                 │
    // │       dateRange: "1-7 Apr 2025",                                │
    // │       days: 7,                                                  │
    // │       price: 1260,                                              │
    // │       status: "Returned"                                        │
    // │     },                                                          │
    // │     ...                                                         │
    // │   ],                                                            │
    // │   total: 28,   ← จำนวนทั้งหมด (ใช้คำนวณ pagination)            │
    // │   page: 1      ← หน้าปัจจุบันที่ backend ส่งกลับ               │
    // │ }                                                               │
    // └─────────────────────────────────────────────────────────────────┘
    getRentalHistory: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiFetch(`/rentals/history${qs ? `?${qs}` : ""}`);
    },

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 GET /rentals/history/export                                  │
    // │ backend ต้องส่ง response เป็นไฟล์ CSV พร้อม header:            │
    // │   Content-Type: text/csv                                        │
    // │   Content-Disposition: attachment; filename="rental-history.csv"│
    // │ ไม่ต้องส่ง JSON → frontend จะ download ให้อัตโนมัติ            │
    // └─────────────────────────────────────────────────────────────────┘
    exportHistory: async () => {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/rentals/history/export`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rental-history.csv";
        a.click();
        URL.revokeObjectURL(url);
    },

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 POST /rentals                                                │
    // │ ใช้สำหรับทั้ง Order (จากรายการเช่าปัจจุบัน) และ Re-rent         │
    // │                                                                 │
    // │ Request body ที่ส่งไป:                                          │
    // │   Order   → { rentalId: "R001", action: "order" }              │
    // │   Re-rent → { brand: "ADIDAS", model: "Ultraboost 23",         │
    // │               size: 42, action: "re-rent" }                    │
    // │                                                                 │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   rentalId: "R002",   ← ID ของออเดอร์ที่สร้างใหม่              │
    // │   status: "active"                                              │
    // │ }                                                               │
    // │                                                                 │
    // │ หลัง POST สำเร็จ → frontend จะ refetch /rentals/active         │
    // │ และ /user/stats อัตโนมัติ                                       │
    // └─────────────────────────────────────────────────────────────────┘
    createRental: (body) =>
        apiFetch("/rentals", { method: "POST", body: JSON.stringify(body) }),

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ 🔌 POST /rewards/redeem                                         │
    // │ Request body: { points: 500 }  ← จำนวนคะแนนที่แลก              │
    // │ (ปัจจุบัน hardcode 500 → ควรเปลี่ยนเป็น modal ให้ user เลือก)  │
    // │                                                                 │
    // │ ต้องส่งกลับมา:                                                  │
    // │ {                                                               │
    // │   success: true,                                                │
    // │   remaining: 1840   ← คะแนนคงเหลือหลังแลก                      │
    // │ }                                                               │
    // │                                                                 │
    // │ หลัง POST สำเร็จ → frontend จะ refetch /rewards/points อัตโนมัติ│
    // └─────────────────────────────────────────────────────────────────┘
    redeemPoints: (body) =>
        apiFetch("/rewards/redeem", { method: "POST", body: JSON.stringify(body) }),
};

// ─── SKELETON COMPONENTS ───────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-neutral-800 rounded-lg ${className}`} />
);

const StatCardSkeleton = () => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-1 min-w-[200px]">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-12 w-24 mb-4" />
        <Skeleton className="h-3 w-36" />
    </div>
);

const RentalItemSkeleton = () => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-6">
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
    <tr className="border-b border-neutral-800">
        {[...Array(7)].map((_, i) => (
            <td key={i} className="py-5 px-2">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

// ─── ERROR BANNER ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
    <div className="bg-red-950 border border-red-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
        <p className="text-red-400 text-sm">⚠ {message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="text-xs font-semibold text-red-300 border border-red-700 px-3 py-1.5 rounded-lg hover:bg-red-900 transition-colors"
            >
                ลองใหม่
            </button>
        )}
    </div>
);

const MAIN_MENU = [
    { label: "Overview", sectionId: "overview" },
    { label: "Notifications", sectionId: "notifications", badgeKey: "notifCount" },
    { label: "Rental History", sectionId: "rental-history" },
    { label: "Reward Points", sectionId: "reward-points" },
    { label: "Pre-booking", sectionId: "pre-booking" },
];

const SECTION_SCROLL_MARGIN = "scroll-mt-24";

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────────────────
const StatCard = ({ title, value, detail, detailColor, iconColor }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 py-10 flex-1 min-w-[200px]">
        <div className="flex items-center justify-between gap-4">
            <div className="text-neutral-400 text-sm">{title}</div>
            {iconColor && <div className={`w-3 h-3 rounded-full ${iconColor}`} />}
        </div>
        <div className="text-5xl font-extrabold text-neutral-100 my-4 flex items-baseline">
            {iconColor ? <span className="text-lime-400">฿</span> : ""} {value}
        </div>
        <p className={`text-sm ${detailColor || "text-neutral-400"}`}>{detail}</p>
    </div>
);

const UserLevelBadge = ({ level, isActive }) => {
    const baseClasses = "text-xs font-semibold px-4 py-1.5 rounded-full border";
    const activeClasses = "bg-neutral-800 text-lime-400 border-lime-400";
    const inactiveClasses = "bg-neutral-900 text-neutral-500 border-neutral-800";
    return (
        <span className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {level.toUpperCase()}
        </span>
    );
};

const CurrentRentalItem = ({ brand, name, size, date, price, rentalId, onOrder }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-6">
        <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center p-3">
            {/* 🔧 [IMAGE] ปัจจุบันใช้รูป placeholder จาก Unsplash                    */}
            {/* เมื่อ backend พร้อม → เปลี่ยนเป็น rental.imageUrl ที่ได้จาก API    */}
            {/* เช่น <img src={imageUrl || "/placeholder-shoe.png"} alt={name} />  */}
            <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400&h=400"
                alt={name}
                className="w-full h-auto"
            />
        </div>
        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
            <div className="col-span-2">
                <p className="text-sm text-neutral-500">{brand}</p>
                <p className="text-lg font-bold text-neutral-100">{name}</p>
                <p className="text-xs text-neutral-500">Size {size} ∙ Start {date}</p>
            </div>
            <div className="col-span-2 text-right">
                <p className="text-2xl font-bold text-neutral-100">
                    <span className="text-lime-400">฿</span>{price}
                </p>
                <p className="text-xs text-neutral-500">/ วัน</p>
            </div>
            <div className="text-right">
                {/* 🔌 [ACTION] คลิก → POST /rentals { rentalId, action: "order" } */}
                <button
                    onClick={() => onOrder(rentalId)}
                    className="bg-lime-400 text-neutral-950 font-bold px-5 py-2 rounded-lg text-sm hover:bg-lime-300 transition-colors"
                >
                    Order
                </button>
            </div>
        </div>
    </div>
);

const RentalHistoryRow = ({ brand, model, size, dateRange, days, price, status, onReRent }) => (
    <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
        <td className="py-5 font-bold text-neutral-100">
            <p className="text-xs text-neutral-500 font-normal">{brand}</p>
            {model}
        </td>
        <td className="py-5 text-center">{size}</td>
        <td className="py-5 text-center">{dateRange}</td>
        <td className="py-5 text-center">{days}</td>
        <td className="py-5 text-center font-bold text-neutral-100">
            <span className="text-lime-400">฿</span>{price}
        </td>
        <td className="py-5 text-center">{status}</td>
        <td className="py-5 text-right">
            {/* 🔌 [ACTION] คลิก → POST /rentals { brand, model, size, action: "re-rent" } */}
            <button
                onClick={() => onReRent({ brand, model, size })}
                className="bg-neutral-800 text-neutral-100 text-xs px-4 py-1.5 rounded-lg border border-neutral-700 hover:border-lime-400 hover:text-lime-400 transition-colors"
            >
                Re-rent
            </button>
        </td>
    </tr>
);

const ActivityItem = ({ title, time, type }) => {
    const iconColors = {
        check: "bg-green-500",
        points: "bg-lime-400",
        cancel: "bg-red-500",
        upgrade: "bg-yellow-400",
        booked: "bg-orange-500",
    };
    return (
        <div className="flex gap-4 items-start py-3">
            <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${iconColors[type] || "bg-neutral-600"}`} />
            <div>
                <p className="text-sm text-neutral-100">{title}</p>
                <p className="text-xs text-neutral-500">{time}</p>
            </div>
        </div>
    );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
const DashboardPage = () => {
    const [activeSection, setActiveSection] = useState("overview");

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeRentals, setActiveRentals] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [rewards, setRewards] = useState(null);
    const [favBrands, setFavBrands] = useState([]);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [historyMeta, setHistoryMeta] = useState({ total: 0, page: 1 });

    const [loading, setLoading] = useState({
        profile: true,
        stats: true,
        activeRentals: true,
        notifications: true,
        rewards: true,
        favBrands: true,
        history: true,
    });

    const [errors, setErrors] = useState({});
    const [historySearch, setHistorySearch] = useState("");
    const [historyBrand, setHistoryBrand] = useState("All");
    const [orderLoading, setOrderLoading] = useState(null);
    const [redeemLoading, setRedeemLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));
    const setError = (key, msg) => setErrors((p) => ({ ...p, [key]: msg }));
    const clearError = (key) => setErrors((p) => { const n = { ...p }; delete n[key]; return n; });

    // ─── RENTAL HISTORY FETCH (search / filter / paginate) ────────────────────
    const loadHistory = useCallback(async ({ q, brand, page }) => {
        setLoad("history", true);
        clearError("history");
        try {
            const params = { page: page || 1 };
            if (q) params.q = q;
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

    // ─── INITIAL DATA FETCH ────────────────────────────────────────────────────
    useEffect(() => {
        const load = async (key, fn, setter) => {
            setLoad(key, true);
            clearError(key);
            try {
                const data = await fn();
                setter(data);
            } catch (e) {
                setError(key, e.message);
            } finally {
                setLoad(key, false);
            }
        };

        load("profile", api.getProfile, setProfile);
        load("stats", api.getStats, setStats);
        load("activeRentals", api.getActiveRentals, setActiveRentals);
        load("notifications", api.getNotifications, setNotifications);
        load("rewards", api.getRewards, setRewards);
        load("favBrands", api.getFavBrands, setFavBrands);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadHistory({ q: "", brand: "All", page: 1 });
    }, [loadHistory]);

    // 🔧 [DEBOUNCE] รอ 400ms หลัง user หยุดพิมพ์แล้วค่อยยิง API
    // ป้องกันยิง request ทุก keystroke
    useEffect(() => {
        const t = setTimeout(() => {
            loadHistory({ q: historySearch, brand: historyBrand, page: 1 });
        }, 400);
        return () => clearTimeout(t);
    }, [historySearch, historyBrand, loadHistory]);

    // ─── ACTION: ORDER ─────────────────────────────────────────────────────────
    // 🔌 POST /rentals { rentalId, action: "order" }
    // หลังสำเร็จ → refetch active rentals เพื่ออัปเดต UI
    const handleOrder = async (rentalId) => {
        setOrderLoading(rentalId);
        try {
            await api.createRental({ rentalId, action: "order" });
            const updated = await api.getActiveRentals(); // 🔌 refetch GET /rentals/active
            setActiveRentals(updated);
        } catch (e) {
            alert(`สั่งซื้อไม่สำเร็จ: ${e.message}`);
        } finally {
            setOrderLoading(null);
        }
    };

    // ─── ACTION: RE-RENT ───────────────────────────────────────────────────────
    // 🔌 POST /rentals { brand, model, size, action: "re-rent" }
    // หลังสำเร็จ → refetch active rentals + stats พร้อมกัน
    const handleReRent = async ({ brand, model, size }) => {
        try {
            await api.createRental({ brand, model, size, action: "re-rent" });
            const [updatedRentals, updatedStats] = await Promise.all([
                api.getActiveRentals(), // 🔌 refetch GET /rentals/active
                api.getStats(),          // 🔌 refetch GET /user/stats
            ]);
            setActiveRentals(updatedRentals);
            setStats(updatedStats);
        } catch (e) {
            alert(`Re-rent ไม่สำเร็จ: ${e.message}`);
        }
    };

    // ─── ACTION: RENT NEW ──────────────────────────────────────────────────────
    // 🔧 [TODO] ปุ่ม "Rent New Shoes" → ยังไม่ได้ต่อ API
    // ขั้นตอนจริง: เปิด modal เลือกรองเท้า → user เลือก → POST /rentals
    // เมื่อพร้อม → แทน alert ด้วย logic เปิด modal และเรียก api.createRental(...)
    const handleRentNew = async () => {
        alert("เปิดหน้าเลือกรองเท้า (TODO: connect modal)");
    };

    // ─── ACTION: REDEEM POINTS ─────────────────────────────────────────────────
    // 🔌 POST /rewards/redeem { points: 500 }
    // 🔧 [TODO] จำนวน 500 pts ยัง hardcode → ควรเปลี่ยนเป็น modal ให้ user เลือก
    // หลังสำเร็จ → refetch GET /rewards/points เพื่ออัปเดตคะแนนและ progress bar
    const handleRedeem = async () => {
        setRedeemLoading(true);
        try {
            const res = await api.redeemPoints({ points: 500 });
            const updated = await api.getRewards(); // 🔌 refetch GET /rewards/points
            setRewards(updated);
            alert(`แลกสำเร็จ! คะแนนคงเหลือ: ${res.remaining}`);
        } catch (e) {
            alert(`แลกคะแนนไม่สำเร็จ: ${e.message}`);
        } finally {
            setRedeemLoading(false);
        }
    };

    // ─── ACTION: EXPORT CSV ────────────────────────────────────────────────────
    // 🔌 GET /rentals/history/export
    // backend ต้องส่ง Content-Type: text/csv กลับมา → frontend auto-download
    const handleExport = async () => {
        setExportLoading(true);
        try {
            await api.exportHistory();
        } catch (e) {
            alert(`Export ไม่สำเร็จ: ${e.message}`);
        } finally {
            setExportLoading(false);
        }
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(sectionId);
    };

    const notifCount = notifications.length;
    const progressPct = rewards
        ? Math.min(Math.round((rewards.points / rewards.nextLevelPoints) * 100), 100)
        : 0;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col antialiased pt-16 lg:pt-18">
        
            {/* Header 
            <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-neutral-950 z-50">
                <div className="text-4xl font-extrabold text-lime-400 tracking-tighter">KINETIX</div>
                <nav className="flex items-center gap-10 text-sm text-neutral-300">
                    {['All Shoes', 'Brands', 'How to rent', 'Pricing'].map(item => (
                        <a key={item} href="#" className="hover:text-lime-400 transition">{item}</a>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <button className="bg-lime-400 text-neutral-950 font-bold px-6 py-2 rounded-lg text-sm flex items-center gap-2">
                        <span>Rent Now</span>
                        <span>→</span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-lg text-lime-400 border border-neutral-700">SN</div>
                </div>
            </header> */}

            {/* Main Layout */}
            <div className="flex flex-1">
                {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
                <aside className="w-72 border-r border-neutral-800 p-8 flex flex-col gap-10">
                    <div className="text-center flex flex-col items-center">
                        {/* 🔌 [DATA] profile มาจาก GET /user/profile */}
                        {loading.profile ? (
                            <>
                                <Skeleton className="w-24 h-24 rounded-full" />
                                <Skeleton className="h-7 w-40 mt-6" />
                                <Skeleton className="h-4 w-32 mt-2" />
                                <Skeleton className="h-6 w-28 mt-4 rounded-full" />
                            </>
                        ) : errors.profile ? (
                            <ErrorBanner
                                message="โหลดโปรไฟล์ไม่ได้"
                                onRetry={() => {
                                    setLoad("profile", true);
                                    // 🔌 retry GET /user/profile
                                    api.getProfile()
                                        .then(setProfile)
                                        .catch((e) => setError("profile", e.message))
                                        .finally(() => setLoad("profile", false));
                                }}
                            />
                        ) : (
                            <>
                                {/* profile.initials ← จาก GET /user/profile */}
                                <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center font-black text-6xl text-lime-400 border-4 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                                    {profile?.initials || "?"}
                                </div>
                                {/* profile.name ← จาก GET /user/profile */}
                                <h1 className="mt-6 text-4xl font-bold tracking-tight">{profile?.name}</h1>
                                {/* profile.email ← จาก GET /user/profile */}
                                <p className="text-neutral-500 text-sm">{profile?.email}</p>
                                {/* profile.level ← จาก GET /user/profile */}
                                <div className="mt-4 inline-flex items-center gap-2 bg-lime-400 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
                                    {profile?.level?.toUpperCase() || "MEMBER"}
                                </div>
                            </>
                        )}
                    </div>

                    <nav className="flex flex-col gap-3">
                        <h2 className="text-xs text-neutral-500 tracking-wider font-semibold uppercase mb-1">Main Menu</h2>
                        {MAIN_MENU.map((item) => {
                            const isActive = activeSection === item.sectionId;
                            // 🔌 [BADGE] notifCount ← จำนวน item ใน GET /notifications
                            const badge = item.badgeKey === "notifCount" ? notifCount : item.badge;
                            return (
                                <button
                                    key={item.sectionId}
                                    type="button"
                                    onClick={() => scrollToSection(item.sectionId)}
                                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-lg text-left transition-colors ${isActive ? "bg-neutral-800 text-lime-400 font-medium" : "text-neutral-300 hover:bg-neutral-900"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={isActive ? "text-lime-400" : "text-neutral-600"}>⊡</span>
                                        {item.label}
                                    </div>
                                    {badge > 0 && (
                                        <span className="text-xs font-semibold bg-lime-400 text-neutral-950 w-5 h-5 flex items-center justify-center rounded-full">
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <nav className="flex flex-col gap-3 mt-auto">
                        <h2 className="text-xs text-neutral-500 tracking-wider font-semibold uppercase mb-1">Account</h2>
                        {["Profile", "Security", "Payment"].map((label) => (
                            <a key={label} href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg text-neutral-300 hover:bg-neutral-900">
                                <span className="text-neutral-600">⊡</span>
                                {label}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
                <main className="flex-1 bg-neutral-900 p-12">

                    {/* HEADER */}
                    <div id="overview" className={`flex items-center justify-between mb-10 ${SECTION_SCROLL_MARGIN}`}>
                        <div>
                            {/* 🔌 [DATA] ชื่อ first name ← profile.name จาก GET /user/profile */}
                            <h1 className="text-4xl font-bold tracking-tight">
                                Welcome back, {profile?.name?.split(" ")[0] || "..."} 👋
                            </h1>
                            <p className="text-neutral-500 text-sm mt-1">Last updated Today</p>
                        </div>
                        {/* 🔧 [TODO] คลิก → POST /rentals (ยังไม่ได้ต่อ รอ modal) */}
                        <button
                            onClick={handleRentNew}
                            className="bg-lime-400 text-neutral-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-lime-400/20 hover:bg-lime-300 transition-colors"
                        >
                            <span className="font-extrabold text-lg">+</span>
                            Rent New Shoes
                        </button>
                    </div>

                    {/* STAT CARDS — 🔌 ข้อมูลมาจาก GET /user/stats */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {loading.stats ? (
                            <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
                        ) : errors.stats ? (
                            <div className="col-span-4">
                                {/* 🔌 retry GET /user/stats */}
                                <ErrorBanner message="โหลดสถิติไม่ได้" onRetry={() => api.getStats().then(setStats)} />
                            </div>
                        ) : (
                            <>
                                {/* stats.totalRentals ← GET /user/stats */}
                                <StatCard title="Total Rentals" value={(stats?.totalRentals || 0).toLocaleString()} detail="↑ 1.2% from last month" iconColor="bg-lime-400" />
                                {/* stats.activeRentals ← GET /user/stats */}
                                <StatCard title="Active Rentals" value={stats?.activeRentals || 0} detail="Pairs ∙ Return in 5 days" />
                                {/* stats.points + rewards.nextLevelPoints ← GET /user/stats + GET /rewards/points */}
                                <StatCard title="Reward Points" value={(stats?.points || 0).toLocaleString()} detail={`${((rewards?.nextLevelPoints || 3000) - (stats?.points || 0))} more points to ${rewards?.nextLevel || "Platinum"}`} />
                                {/* stats.returnScore ← GET /user/stats */}
                                <StatCard title="Return Score" value={`${stats?.returnScore || 0}%`} detail="✓ Always returned on time" detailColor="text-green-500" />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="col-span-8 flex flex-col gap-10">

                            {/* CURRENTLY RENTING — 🔌 ข้อมูลมาจาก GET /rentals/active */}
                            <section id="pre-booking" className={`bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Currently Renting</h2>
                                    <a href="#" className="text-lime-400 text-sm font-medium hover:underline">View All →</a>
                                </div>
                                {loading.activeRentals ? (
                                    <div className="flex flex-col gap-5">
                                        <RentalItemSkeleton />
                                        <RentalItemSkeleton />
                                    </div>
                                ) : errors.activeRentals ? (
                                    // 🔌 retry GET /rentals/active
                                    <ErrorBanner message="โหลดรายการเช่าไม่ได้" onRetry={() => api.getActiveRentals().then(setActiveRentals)} />
                                ) : activeRentals.length === 0 ? (
                                    <p className="text-neutral-500 text-sm">ไม่มีรายการเช่าปัจจุบัน</p>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        {/* 🔌 map activeRentals ← GET /rentals/active */}
                                        {activeRentals.map((rental, i) => (
                                            <CurrentRentalItem
                                                key={rental.rentalId || i}
                                                {...rental}
                                                onOrder={handleOrder} // 🔌 → POST /rentals
                                                disabled={orderLoading === rental.rentalId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* RENTAL HISTORY — 🔌 ข้อมูลมาจาก GET /rentals/history */}
                            <section id="rental-history" className={`bg-neutral-900 border border-neutral-800 rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold">Rental History</h2>
                                    {/* 🔌 คลิก → GET /rentals/history/export (download CSV) */}
                                    <button
                                        onClick={handleExport}
                                        disabled={exportLoading}
                                        className="text-neutral-500 text-sm font-medium hover:text-lime-400 disabled:opacity-50 transition-colors"
                                    >
                                        {exportLoading ? "กำลัง Export..." : "Export CSV →"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-6 bg-neutral-950 border border-neutral-800 rounded-2xl p-2">
                                    {/* 🔌 [SEARCH] พิมพ์ → debounce 400ms → GET /rentals/history?q=... */}
                                    <input
                                        type="search"
                                        placeholder="Search by brand, model, date..."
                                        value={historySearch}
                                        onChange={(e) => setHistorySearch(e.target.value)}
                                        className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 px-3 py-2.5 rounded-lg border-r border-neutral-800 focus:ring-0 focus:outline-none"
                                    />
                                    <div className="flex items-center gap-1.5 pl-1">
                                        {/* 🔌 [FILTER] เลือก brand → GET /rentals/history?brand=... */}
                                        {["All", "Nike", "Adidas", "ASICS", "Hoka", "Brooks"].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setHistoryBrand(filter)}
                                                className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${historyBrand === filter ? "bg-lime-400 text-neutral-950 border-lime-400" : "text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-lime-400"}`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {errors.history && (
                                    <div className="mb-4">
                                        {/* 🔌 retry GET /rentals/history */}
                                        <ErrorBanner message="โหลดประวัติการเช่าไม่ได้" onRetry={() => loadHistory({ q: historySearch, brand: historyBrand, page: 1 })} />
                                    </div>
                                )}

                                <table className="w-full text-left">
                                    <thead className="border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wide">
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
                                                <td colSpan={7} className="py-10 text-center text-neutral-500 text-sm">ไม่พบรายการที่ค้นหา</td>
                                            </tr>
                                        ) : (
                                            // 🔌 map rentalHistory.data ← GET /rentals/history
                                            rentalHistory.map((row, i) => (
                                                <RentalHistoryRow
                                                    key={i}
                                                    {...row}
                                                    onReRent={handleReRent} // 🔌 → POST /rentals
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* PAGINATION — 🔌 GET /rentals/history?page=N */}
                                {historyMeta.total > 5 && (
                                    <div className="flex justify-between items-center mt-6 text-sm text-neutral-500">
                                        {/* historyMeta.total ← จาก response { total: N } */}
                                        <span>ทั้งหมด {historyMeta.total} รายการ</span>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={historyMeta.page <= 1}
                                                onClick={() => loadHistory({ q: historySearch, brand: historyBrand, page: historyMeta.page - 1 })}
                                                className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-600 disabled:opacity-40 transition-colors"
                                            >
                                                ← ก่อนหน้า
                                            </button>
                                            <button
                                                disabled={historyMeta.page * 5 >= historyMeta.total}
                                                onClick={() => loadHistory({ q: historySearch, brand: historyBrand, page: historyMeta.page + 1 })}
                                                className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-600 disabled:opacity-40 transition-colors"
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

                            {/* REWARD POINTS — 🔌 ข้อมูลมาจาก GET /rewards/points */}
                            <section id="reward-points" className={`bg-neutral-950 border border-neutral-800 rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold">Reward Points</h2>
                                    {/* 🔌 คลิก → POST /rewards/redeem */}
                                    <button
                                        onClick={handleRedeem}
                                        disabled={redeemLoading || loading.rewards}
                                        className="text-neutral-500 text-sm font-medium hover:text-lime-400 disabled:opacity-50 transition-colors"
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
                                        <p className="text-sm text-neutral-500">Your points</p>
                                        {/* rewards.points ← GET /rewards/points */}
                                        <p className="text-4xl font-black text-neutral-100 mb-6 flex items-baseline gap-2">
                                            {(rewards?.points || 0).toLocaleString()}
                                            <span className="text-2xl font-bold text-lime-400">pts</span>
                                        </p>
                                        <div className="relative pt-6 border-t border-neutral-800 mt-6">
                                            {/* rewards.nextLevel + rewards.nextLevelPoints ← GET /rewards/points */}
                                            <p className="absolute -top-3 right-0 bg-neutral-950 text-neutral-500 text-xs px-2">
                                                {rewards?.nextLevel} requires{" "}
                                                <span className="text-neutral-100 font-bold">{(rewards?.nextLevelPoints || 0).toLocaleString()} pts</span>
                                            </p>
                                            {/* progressPct คำนวณจาก rewards.points / rewards.nextLevelPoints */}
                                            <div className="w-full h-1.5 bg-neutral-800 rounded-full mb-4">
                                                <div
                                                    className="h-full bg-lime-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            {/* rewards.level ← GET /rewards/points (ใช้ highlight badge) */}
                                            <div className="flex gap-2 flex-wrap">
                                                {["bronze", "gold", "silver", "platinum", "Diamond"].map((lvl) => (
                                                    <UserLevelBadge key={lvl} level={lvl} isActive={lvl === rewards?.level?.toUpperCase()} />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>

                            {/* FAVORITE BRANDS — 🔌 ข้อมูลมาจาก GET /user/brands */}
                            <section className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold">Favorite Brands</h2>
                                    <a href="#" className="text-neutral-500 text-sm font-medium hover:text-lime-400">Edit</a>
                                </div>
                                {loading.favBrands ? (
                                    <div className="grid grid-cols-3 gap-5">
                                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                                    </div>
                                ) : errors.favBrands ? (
                                    <ErrorBanner message="โหลดแบรนด์ไม่ได้" />
                                ) : (
                                    <div className="grid grid-cols-3 gap-5">
                                        {/* 🔌 map favBrands ← GET /user/brands */}
                                        {favBrands.map((brand) => (
                                            <div key={brand.name} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center gap-2.5">
                                                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-black text-2xl text-lime-400 border border-neutral-700">
                                                    {brand.name === "New Balance" ? "NB" : brand.name === "ASICS" ? "AS" : brand.name.slice(0, 1).toUpperCase()}
                                                </div>
                                                <p className="text-sm font-bold text-neutral-100">{brand.name}</p>
                                                <p className="text-xs text-neutral-500">{brand.count} times</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* RECENT ACTIVITY — 🔌 ข้อมูลมาจาก GET /notifications */}
                            <section id="notifications" className={`bg-neutral-950 border border-neutral-800 rounded-3xl p-8 ${SECTION_SCROLL_MARGIN}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Recent Activity</h2>
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
                                        {/* 🔌 map notifications ← GET /notifications */}
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

            <footer className="border-t border-neutral-800 text-center py-6 text-neutral-600 text-xs bg-neutral-950">
                © 2026 KINETIX - All rights reserved - Privacy Policy
            </footer>
        </div>
    );
};

export default DashboardPage;
