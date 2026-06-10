import { useState } from "react";

const MOCK_DRIVERS = [
  { id: "DRV-001", name: "สมชาย ขับดี" },
  { id: "DRV-002", name: "วิชัย เร็วแรง" },
  { id: "DRV-003", name: "ประสิทธิ์ ตรงเวลา" },
];

const MOCK_JOBS = [
  { id: "JOB-000001", customer: "สมชาย ใจดี",     phone: "081-111-2222", address: "123 ถ.สุขุมวิท กรุงเทพฯ",       item: "Ultra Boost size 44",   type: "DELIVERY", status: "WAITING_FOR_ADMIN_CONFIRMATION", driverId: null,      note: "กรุณาโทรก่อนส่ง", createdAt: "2026-06-03T10:00:00Z" },
  { id: "JOB-000002", customer: "วิภา รักดี",      phone: "089-333-4444", address: "456 ถ.ลาดพร้าว กรุงเทพฯ",      item: "Air Max size 40",       type: "RETURN",   status: "WAITING_FOR_RETURN_APPROVAL",   driverId: null,      note: "",              createdAt: "2026-06-03T09:30:00Z" },
  { id: "JOB-000003", customer: "ประสิทธิ์ มั่นคง", phone: "062-555-6666", address: "789 ถ.ราษฎร์บูรณะ กรุงเทพฯ",   item: "Gel-Kayano size 43",    type: "DELIVERY", status: "IN_TRANSIT",                    driverId: "DRV-001", note: "",              createdAt: "2026-06-02T14:00:00Z" },
  { id: "JOB-000004", customer: "มาลี สวยงาม",     phone: "095-777-8888", address: "321 ถ.รัชดาภิเษก กรุงเทพฯ",    item: "Pegasus size 38",       type: "DELIVERY", status: "WAITING_FOR_ADMIN_CONFIRMATION", driverId: null,      note: "ส่งช่วงบ่าย",   createdAt: "2026-06-03T08:00:00Z" },
  { id: "JOB-000005", customer: "สุรศักดิ์ แข็งแกร่ง", phone: "083-999-0000", address: "654 ถ.พระราม 9 กรุงเทพฯ", item: "React Infinity size 42", type: "DELIVERY", status: "DELIVERED",                     driverId: "DRV-002", note: "",              createdAt: "2026-05-28T11:00:00Z" },
];

const STATUS_STYLES = {
  WAITING_FOR_ADMIN_CONFIRMATION:  "text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]",
  WAITING_FOR_RETURN_APPROVAL:     "text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]",
  WAITING_FOR_DRIVER_CONFIRMATION: "text-[#1E40AF] bg-[#DBEAFE] border-[#BFDBFE]",
  DRIVER_CONFIRMED:                "text-[#1E40AF] bg-[#DBEAFE] border-[#BFDBFE]",
  PICKED_UP:                       "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]",
  IN_TRANSIT:                      "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]",
  DELIVERED:                       "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]",
  RETURN_DRIVER_PENDING:           "text-[#1E40AF] bg-[#DBEAFE] border-[#BFDBFE]",
  RETURN_COMPLETED:                "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]",
  REJECT_REQUESTED:                "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]",
  REJECT_APPROVED:                 "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]",
  CANCELLATION_APPROVED:           "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]",
};

const WAITING_STATUSES = ["WAITING_FOR_ADMIN_CONFIRMATION", "WAITING_FOR_RETURN_APPROVAL"];
const FINAL_STATUSES   = ["DELIVERED", "RETURN_COMPLETED", "REJECT_APPROVED", "CANCELLATION_APPROVED"];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const card  = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const activeFilter = { background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" };
const idleFilter   = { background: "transparent", color: "#64748B", border: "1px solid #E2E8F0" };

export default function JobTable({ onViewTimeline }) {
  const [jobs, setJobs]               = useState(MOCK_JOBS);
  const [filterType, setFilterType]   = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null);
  const [confirmMode, setConfirmMode] = useState(false);
  const [assignDriver, setAssignDriver] = useState("");

  const filtered = jobs.filter((j) => {
    const matchType   = filterType === "ALL"   || j.type === filterType;
    const matchStatus = filterStatus === "ALL" || j.status === filterStatus;
    const matchSearch = search === "" || j.id.toLowerCase().includes(search.toLowerCase()) || j.customer.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const handleConfirm = (jobId) => {
    const nextStatus = jobs.find((j) => j.id === jobId)?.type === "RETURN" ? "RETURN_DRIVER_PENDING" : "WAITING_FOR_DRIVER_CONFIRMATION";
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: nextStatus, driverId: assignDriver || j.driverId } : j));
    setSelected((prev) => prev ? { ...prev, status: nextStatus, driverId: assignDriver || prev.driverId } : null);
    setConfirmMode(false);
    setAssignDriver("");
  };

  const handleReject = (jobId) => {
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: "REJECT_REQUESTED" } : j));
    setSelected((prev) => prev ? { ...prev, status: "REJECT_REQUESTED" } : null);
  };

  const driverName = (id) => MOCK_DRIVERS.find((d) => d.id === id)?.name || "-";

  return (
    <div className="flex gap-5">
      {/* Left — list */}
      <div className="flex-1 rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>Job Management</h3>
          <span className="text-[12px] font-sora" style={{ color: "#94A3B8" }}>
            {jobs.filter((j) => WAITING_STATUSES.includes(j.status)).length} รอ confirm
          </span>
        </div>

        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหา Job ID หรือลูกค้า..."
          className="w-full rounded-lg px-3 py-2 text-sm font-sora focus:outline-none mb-3"
          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; }}
        />

        <div className="flex gap-2 mb-3 flex-wrap">
          {["ALL", "DELIVERY", "RETURN"].map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
              style={filterType === t ? activeFilter : idleFilter}>
              {t === "ALL" ? "ทุก Type" : t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {["ALL", "WAITING", "IN_TRANSIT", "DELIVERED"].map((s) => {
            const isActive = (s === "ALL" && filterStatus === "ALL") || (s === "WAITING" && filterStatus === "WAITING_FOR_ADMIN_CONFIRMATION") || filterStatus === s;
            return (
              <button key={s}
                onClick={() => setFilterStatus(s === "WAITING" ? "WAITING_FOR_ADMIN_CONFIRMATION" : s === "ALL" ? "ALL" : s)}
                className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
                style={isActive ? activeFilter : idleFilter}>
                {s === "ALL" ? "ทุก Status" : s === "WAITING" ? "Waiting" : s.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && <p className="text-sm font-sora text-center py-6" style={{ color: "#94A3B8" }}>ไม่พบรายการ</p>}
          {filtered.map((job) => (
            <div key={job.id} onClick={() => { setSelected(job); setConfirmMode(false); }}
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={selected?.id === job.id
                ? { border: "1px solid rgba(195,255,81,0.40)", background: "rgba(195,255,81,0.05)" }
                : { border: "1px solid #E2E8F0", background: "transparent" }}
              onMouseEnter={(e) => { if (selected?.id !== job.id) e.currentTarget.style.background = "#F8FAFC"; }}
              onMouseLeave={(e) => { if (selected?.id !== job.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold font-sora" style={{ color: "#0F172A" }}>{job.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                    job.type === "DELIVERY"
                      ? "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]"
                      : "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]"
                  }`}>{job.type}</span>
                </div>
                <p className="text-xs font-sora" style={{ color: "#64748B" }}>{job.customer}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${STATUS_STYLES[job.status] || "text-[#64748B] border-[#E2E8F0]"}`}>
                {job.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — detail panel */}
      {selected && (
        <div className="w-80 rounded-2xl p-5 flex flex-col gap-4 self-start" style={card}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>รายละเอียด Job</h4>
            <button onClick={() => { setSelected(null); setConfirmMode(false); }} className="text-lg leading-none" style={{ color: "#94A3B8" }}>✕</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold font-sora text-sm" style={{ color: "#0F172A" }}>{selected.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
              selected.type === "DELIVERY"
                ? "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]"
                : "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]"
            }`}>{selected.type}</span>
          </div>

          <div className={`text-xs px-3 py-1.5 rounded-lg border font-sora text-center ${STATUS_STYLES[selected.status] || "text-[#64748B] border-[#E2E8F0]"}`}>
            {selected.status.replace(/_/g, " ")}
          </div>

          <div className="flex flex-col gap-3 pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
            {[
              { label: "ลูกค้า",    value: selected.customer },
              { label: "เบอร์โทร",  value: selected.phone },
              { label: "ที่อยู่",   value: selected.address },
              { label: "รายการ",    value: selected.item },
              { label: "Driver",    value: selected.driverId ? driverName(selected.driverId) : "ยังไม่ได้ assign" },
              { label: "หมายเหตุ", value: selected.note || "-" },
              { label: "วันที่สร้าง", value: formatDate(selected.createdAt) },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{f.label}</p>
                <p className="text-sm font-sora" style={{ color: "#0F172A" }}>{f.value}</p>
              </div>
            ))}
          </div>

          {WAITING_STATUSES.includes(selected.status) && (
            <div className="flex flex-col gap-3 pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
              {confirmMode ? (
                <>
                  <div>
                    <label className="text-xs font-sora mb-1 block" style={{ color: "#64748B" }}>Assign Driver</label>
                    <select value={assignDriver} onChange={(e) => setAssignDriver(e.target.value)}
                      className="w-full text-sm rounded-lg px-3 py-2 font-sora focus:outline-none"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}>
                      <option value="">-- เลือก Driver --</option>
                      {MOCK_DRIVERS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirm(selected.id)}
                      className="flex-1 text-xs py-2 rounded-lg font-semibold font-sora"
                      style={{ background: "#C3FF51", color: "#0F172A" }}>
                      ยืนยัน
                    </button>
                    <button onClick={() => setConfirmMode(false)}
                      className="flex-1 text-xs py-2 rounded-lg font-sora"
                      style={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
                      ยกเลิก
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setConfirmMode(true)}
                    className="flex-1 text-xs py-2 rounded-lg font-sora"
                    style={{ background: "#C3FF51", color: "#0F172A" }}>
                    Confirm
                  </button>
                  <button onClick={() => handleReject(selected.id)}
                    className="flex-1 text-xs py-2 rounded-lg font-sora"
                    style={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {!FINAL_STATUSES.includes(selected.status) && (
            <button onClick={() => onViewTimeline && onViewTimeline(selected.id)}
              className="w-full text-xs py-2 rounded-lg font-sora"
              style={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
              ดู Timeline →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
