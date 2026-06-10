import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Overview",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "profit",
    label: "Profit & Analytics",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    key: "jobs",
    label: "Job Management",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    key: "staff",
    label: "Staff",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "cancellations",
    label: "Cancellations",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    badge: 4,
  },
  {
    key: "orders",
    label: "Orders",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: "shoes",
    label: "Shoe Lookup",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ active, onChange }) {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: "280px",
        background: "#000000",
        borderRight: "1px solid #374151",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid #374151" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#C3FF51" }}
          >
            <span className="text-[#0F172A] font-black text-[13px] font-sora leading-none">K</span>
          </div>
          <span className="font-bold font-sora text-[14px] tracking-[0.08em] uppercase" style={{ color: "#E5E7EB" }}>
            KINETI<span style={{ color: "#C3FF51" }}>X</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              onClick={() => onChange(item.key)}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-sora text-[13px] relative"
              style={{
                background: isActive ? "#111111" : "transparent",
                color: isActive ? "#E5E7EB" : "#9CA3AF",
                transition: "background 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#111111";
                  e.currentTarget.style.color = "#E5E7EB";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9CA3AF";
                }
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                  style={{ background: "#E5E7EB" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 truncate font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className="text-[10px] font-semibold font-sora px-1.5 py-0.5 rounded min-w-[18px] text-center"
                  style={{ background: "#FEE2E2", color: "#DC2626" }}
                >
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #374151" }}>
        <div className="flex items-center gap-3 px-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-sora shrink-0"
            style={{ background: "#111111", color: "#D1D5DB", border: "1px solid #374151" }}
          >
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold font-sora truncate leading-tight" style={{ color: "#E5E7EB" }}>Admin</p>
            <p className="text-[11px] font-sora truncate leading-tight" style={{ color: "#9CA3AF" }}>
              admin@kinetix.com
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 p-1 rounded transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#E5E7EB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}