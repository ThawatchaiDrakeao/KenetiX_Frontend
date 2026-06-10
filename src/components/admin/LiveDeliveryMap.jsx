import { motion } from "framer-motion";

const DRIVERS = [
  { id: "DRV-001", name: "สมชาย ขับดี",      x: 62, y: 55, status: "in-transit", job: "JOB-000011", zone: "สุขุมวิท" },
  { id: "DRV-002", name: "วิชัย เร็วแรง",     x: 38, y: 38, status: "idle",       job: "JOB-000009", zone: "รัชดา"   },
  { id: "DRV-003", name: "ประสิทธิ์ ตรงเวลา", x: 70, y: 68, status: "in-transit", job: "JOB-000013", zone: "บางนา"   },
];

const ZONES = [
  { name: "ดอนเมือง",  x: 48, y: 14, main: false },
  { name: "รัชดา",     x: 44, y: 34, main: false },
  { name: "ลาดพร้าว", x: 60, y: 26, main: false },
  { name: "สยาม",      x: 48, y: 50, main: true  },
  { name: "สาทร",      x: 45, y: 63, main: false },
  { name: "สุขุมวิท",  x: 63, y: 52, main: false },
  { name: "บางนา",     x: 72, y: 68, main: false },
  { name: "พระราม 2",  x: 40, y: 78, main: false },
];

const ROUTES = [
  { x1: 48, y1: 50, x2: 62, y2: 55 },
  { x1: 48, y1: 50, x2: 70, y2: 68 },
];

export default function LiveDeliveryMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div>
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>
            Live Delivery Map
          </h3>
          <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
            ครอบคลุมพื้นที่ กรุงเทพมหานคร
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 text-[11px] font-sora" style={{ color: "#94A3B8" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4D7C0F" }} />
              In Transit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#CBD5E1" }} />
              Idle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E2E8F0" }} />
              Zone
            </span>
          </div>
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold font-sora px-2 py-0.5 rounded-md"
            style={{ background: "#F0FDF4", color: "#4D7C0F", border: "1px solid #BBF7D0" }}
          >
            <span className="w-1.5 h-1.5 rounded-full dot-ping inline-block" style={{ background: "#4D7C0F" }} />
            Live
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: "300px" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "#F8FAFC",
            backgroundImage:
              "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Route lines */}
          {ROUTES.map((r, i) => (
            <line
              key={i}
              x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#4D7C0F"
              strokeWidth="0.25"
              strokeDasharray="1.2 0.8"
              opacity="0.35"
            />
          ))}
          {/* Zone dots */}
          {ZONES.map((z) => (
            <circle
              key={z.name}
              cx={z.x} cy={z.y}
              r={z.main ? 1.6 : 0.8}
              fill={z.main ? "#C3FF51" : "#F1F5F9"}
              stroke={z.main ? "#4D7C0F" : "#CBD5E1"}
              strokeWidth="0.4"
              opacity={z.main ? 1 : 0.7}
            />
          ))}
        </svg>

        {/* Zone labels */}
        {ZONES.map((z) => (
          <div
            key={z.name}
            className="absolute pointer-events-none flex flex-col items-center"
            style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="w-2 h-2 rounded-full mb-1"
              style={{
                background: z.main ? "#C3FF51" : "#F1F5F9",
                border: `1.5px solid ${z.main ? "#4D7C0F" : "#CBD5E1"}`,
              }}
            />
            <span
              className="text-[8px] font-sora whitespace-nowrap px-1 py-0.5 rounded"
              style={{ color: z.main ? "#4D7C0F" : "#94A3B8", background: "rgba(248,250,252,0.85)" }}
            >
              {z.name}
            </span>
          </div>
        ))}

        {/* Driver markers */}
        {DRIVERS.map((d) => {
          const isActive = d.status === "in-transit";
          const color = isActive ? "#4D7C0F" : "#CBD5E1";
          return (
            <div
              key={d.id}
              className="absolute group cursor-pointer"
              style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {isActive && (
                <div
                  className="absolute rounded-full dot-ping"
                  style={{
                    width: "20px", height: "20px",
                    top: "-6px", left: "-6px",
                    background: "rgba(77,124,15,0.10)",
                    border: "1px solid rgba(77,124,15,0.25)",
                  }}
                />
              )}
              <div
                className="w-2.5 h-2.5 rounded-full relative z-10"
                style={{ background: color, border: `1.5px solid ${isActive ? "#4D7C0F" : "#E2E8F0"}` }}
              />
              <div
                className="absolute bottom-full left-1/2 mb-2 px-3 py-2 rounded-xl pointer-events-none z-20 min-w-35 opacity-0 group-hover:opacity-100"
                style={{
                  transform: "translateX(-50%)",
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  transition: "opacity 150ms ease",
                }}
              >
                <p className="text-[11px] font-semibold font-sora" style={{ color: "#0F172A" }}>{d.name}</p>
                <p className="text-[10px] font-sora mt-0.5" style={{ color: "#94A3B8" }}>{d.zone} · {d.job}</p>
                <p className="text-[10px] font-medium font-sora mt-1" style={{ color }}>
                  {isActive ? "In Transit" : "Idle"}
                </p>
              </div>
            </div>
          );
        })}

        {/* Footer stats */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-3 flex items-center gap-6"
          style={{ background: "linear-gradient(to top, rgba(248,250,252,0.90) 0%, transparent 100%)" }}
        >
          {[
            { label: "Active routes",  value: "2" },
            { label: "Drivers on road", value: "2" },
            { label: "Coverage",        value: "กรุงเทพฯ" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>{s.label}</span>
              <span className="text-[12px] font-semibold font-sora" style={{ color: "#0F172A" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
