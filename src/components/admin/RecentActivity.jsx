import { motion } from "framer-motion";

const ACTIVITY = [
  { id: "JOB-000013", action: "Created — awaiting confirmation", time: "2 min ago",  dot: "#CBD5E1" },
  { id: "JOB-000012", action: "Confirmed by admin",               time: "15 min ago", dot: "#CBD5E1" },
  { id: "JOB-000011", action: "Driver accepted",                  time: "32 min ago", dot: "#CBD5E1" },
  { id: "JOB-000010", action: "Cancellation requested",           time: "1 hr ago",   dot: "#CBD5E1" },
  { id: "JOB-000009", action: "Delivered successfully",           time: "2 hr ago",   dot: "#CBD5E1" },
  { id: "JOB-000008", action: "Customer rejected delivery",       time: "3 hr ago",   dot: "#CBD5E1" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const row = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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
            Recent Activity
          </h3>
          <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
            Live event stream
          </p>
        </div>
      </div>

      <motion.div className="flex flex-col" variants={container} initial="hidden" animate="show">
        {ACTIVITY.map((a, i) => (
          <motion.div
            key={`${a.id}-${i}`}
            variants={row}
            className="flex items-start gap-4 py-3"
            style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid #F1F5F9" : "none" }}
          >
            <div className="flex flex-col items-center pt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.dot }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] font-semibold font-sora shrink-0" style={{ color: "#0F172A" }}>
                  {a.id}
                </span>
                <span className="text-[12px] font-sora truncate" style={{ color: "#374151" }}>
                  {a.action}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-sora shrink-0" style={{ color: "#94A3B8" }}>
              {a.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
