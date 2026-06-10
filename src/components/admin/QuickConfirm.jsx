import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios.js";
import Button from "../ui/Button.jsx";

const MOCK_DRIVERS = [
  { id: "DRV-001", name: "สมชาย ขับดี" },
  { id: "DRV-002", name: "วิชัย เร็วแรง" },
  { id: "DRV-003", name: "ประสิทธิ์ ตรงเวลา" },
];

const INITIAL_PENDING = [
  { id: "JOB-000013", customer: "สมชาย ใจดี",  address: "123 ถ.สุขุมวิท กรุงเทพฯ", type: "DELIVERY", createdAt: "2 min ago" },
  { id: "JOB-000004", customer: "มาลี สวยงาม",  address: "321 ถ.มิตรภาพ ขอนแก่น",   type: "DELIVERY", createdAt: "1 hr ago"  },
  { id: "JOB-000002", customer: "วิภา รักดี",   address: "456 ถ.นิมมาน เชียงใหม่",   type: "RETURN",   createdAt: "2 hr ago"  },
];

export default function QuickConfirm() {
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [selectedDriver, setSelectedDriver] = useState({});

  const remove = (jobId) => setPending((prev) => prev.filter((j) => j.id !== jobId));

   async function handlePending() {
    try {
      const response = await API.get("/api/jobs", {
        params: {
          jobs: 5,
        },
      });
      const data = response.data;
      setPending(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Request completed");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>
            Quick Confirm
          </h3>
          <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
            Pending approval
          </p>
        </div>
        <Button onClick={() => handlePending()}> Refresh </Button>
        {pending.length > 0 && (
          <span
            className="text-[11px] font-semibold font-sora px-2 py-0.5 rounded-md"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            {pending.length} pending
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <AnimatePresence>
          {pending.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-10"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold font-sora" style={{ color: "#0F172A" }}>All clear</p>
              <p className="text-[12px] font-sora" style={{ color: "#94A3B8" }}>No jobs pending confirmation</p>
            </motion.div>
          ) : (
            pending.map((job, idx) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-sora tracking-wider" style={{ color: "#4D7C0F" }}>
                      {job.id}
                    </span>
                    <span
                      className="text-[10px] font-medium font-sora px-1.5 py-0.5 rounded"
                      style={{ background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" }}
                    >
                      {job.type}
                    </span>
                  </div>
                  <span className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>
                    {job.createdAt}
                  </span>
                </div>

                {/* Customer */}
                <div>
                  <p className="font-semibold font-sora text-[14px] leading-snug" style={{ color: "#0F172A" }}>
                    {job.customer}
                  </p>
                  <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
                    {job.address}
                  </p>
                </div>

                {/* Driver + Actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDriver[job.id] || ""}
                    onChange={(e) => setSelectedDriver((p) => ({ ...p, [job.id]: e.target.value }))}
                    className="flex-1 rounded-lg px-3 py-1.5 text-[12px] font-sora focus:outline-none appearance-none"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      color: selectedDriver[job.id] ? "#0F172A" : "#94A3B8",
                      transition: "border-color 150ms ease",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; }}
                  >
                    <option value="">Assign driver (optional)</option>
                    {MOCK_DRIVERS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => remove(job.id)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold font-sora shrink-0"
                    style={{ background: "#C3FF51", color: "#0F172A" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#C7FF6A"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#C3FF51"; }}
                  >
                    Confirm
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => remove(job.id)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold font-sora shrink-0"
                    style={{
                      background: "transparent",
                      color: "#64748B",
                      border: "1px solid #E2E8F0",
                      transition: "background 150ms ease, border-color 150ms ease, color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F1F5F9";
                      e.currentTarget.style.borderColor = "#CBD5E1";
                      e.currentTarget.style.color = "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.color = "#64748B";
                    }}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
