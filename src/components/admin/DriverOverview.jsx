import { motion } from "framer-motion";

const STATS = [
  {
    label: "Active",
    value: 12,
    sub: "On duty",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
  {
    label: "Available",
    value: 5,
    sub: "Ready",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: "Busy",
    value: 7,
    sub: "Delivering",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

const utilization = Math.round((7 / 12) * 100);

export default function DriverOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>
            Driver Overview
          </h3>
          <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
            Real-time fleet status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
          >
            <span style={{ color: "#CBD5E1" }}>{s.icon}</span>
            <p
              className="font-extrabold font-sora leading-none"
              style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "#0F172A" }}
            >
              {s.value}
            </p>
            <div>
              <p className="text-[12px] font-semibold font-sora" style={{ color: "#0F172A" }}>{s.label}</p>
              <p className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-[12px] font-sora" style={{ color: "#64748B" }}>Fleet utilization</span>
          <span className="text-[12px] font-semibold font-sora" style={{ color: "#0F172A" }}>{utilization}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#C3FF51" }}
            initial={{ width: 0 }}
            animate={{ width: `${utilization}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
