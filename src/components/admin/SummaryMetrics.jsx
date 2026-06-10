import { motion } from "framer-motion";

const METRICS = [
  {
    label: "Total Jobs",
    value: "128",
    trend: "+12%",
    trendDir: 1,
    sub: "this week",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: "In Transit",
    value: "14",
    trend: "+8%",
    trendDir: 1,
    sub: "this week",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Active Staff",
    value: "12",
    trend: "Stable",
    trendDir: 0,
    sub: "no change",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Cancellations",
    value: "3",
    trend: "-25%",
    trendDir: -1,
    sub: "this week",
    danger: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function SummaryMetrics() {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {METRICS.map((m) => {
        const trendColor = m.trendDir === 1 ? "#16A34A" : m.trendDir === -1 ? "#DC2626" : "#94A3B8";
        const trendArrow = m.trendDir === 1 ? "↑" : m.trendDir === -1 ? "↓" : "—";

        return (
          <motion.div
            key={m.label}
            variants={item}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl p-6 flex flex-col justify-between"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              minHeight: "148px",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium font-sora" style={{ color: "#64748B" }}>
                {m.label}
              </span>
              <span style={{ color: "#CBD5E1" }}>{m.icon}</span>
            </div>

            <p
              className="font-extrabold font-sora leading-none"
              style={{
                fontSize: "48px",
                letterSpacing: "-0.03em",
                color: m.danger ? "#DC2626" : "#0F172A",
              }}
            >
              {m.value}
            </p>

            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold font-sora" style={{ color: trendColor }}>
                {trendArrow} {m.trend}
              </span>
              <span className="text-[12px] font-sora" style={{ color: "#94A3B8" }}>
                {m.sub}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
