import { useState } from "react";

const MOCK_QUEUE = [
  { id: "JOB-000010", customer: "สมหมาย ใจดี",    phone: "081-111-2222", address: "123 ถ.สุขุมวิท กรุงเทพฯ",     item: "Ultra Boost size 44",  reason: "เปลี่ยนใจ ไม่ต้องการแล้ว",     type: "CANCELLATION_REQUESTED",      requestedAt: "2026-06-03T09:00:00Z" },
  { id: "JOB-000008", customer: "วิภา รักดี",      phone: "089-333-4444", address: "456 ถ.ลาดพร้าว กรุงเทพฯ",    item: "Air Max size 40",       reason: "ไม่อยู่บ้านตอน Driver มาถึง",   type: "CUSTOMER_REJECT_ACKNOWLEDGED", requestedAt: "2026-06-03T08:30:00Z" },
  { id: "JOB-000007", customer: "ประสิทธิ์ มั่นคง", phone: "062-555-6666", address: "789 ถ.ราษฎร์บูรณะ กรุงเทพฯ", item: "Gel-Kayano size 43",    reason: "ที่อยู่ไม่ถูกต้อง ส่งไม่ได้",   type: "REJECT_DRIVER_CONFIRMED",     requestedAt: "2026-06-02T16:00:00Z" },
  { id: "JOB-000005", customer: "มาลี สวยงาม",     phone: "095-777-8888", address: "321 ถ.รัชดาภิเษก กรุงเทพฯ",  item: "Pegasus size 38",       reason: "สินค้าไม่ตรงตามที่สั่ง",       type: "CANCELLATION_REQUESTED",      requestedAt: "2026-06-02T14:00:00Z" },
];

const TYPE_META = {
  CANCELLATION_REQUESTED:      { label: "User ขอยกเลิก",  color: "text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]",  tab: "cancellation"    },
  CUSTOMER_REJECT_ACKNOWLEDGED:{ label: "Customer Reject", color: "text-[#6B21A8] bg-[#F3E8FF] border-[#E9D5FF]",  tab: "customer_reject" },
  REJECT_DRIVER_CONFIRMED:     { label: "Admin Reject",    color: "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]",  tab: "admin_reject"    },
};

const TABS = [
  { key: "all",           label: "ทั้งหมด"        },
  { key: "cancellation",  label: "User ขอยกเลิก"  },
  { key: "customer_reject", label: "Customer Reject" },
  { key: "admin_reject",  label: "Admin Reject"    },
  { key: "history",       label: "History"         },
];

const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const card         = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const activeFilter = { background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" };
const idleFilter   = { background: "transparent", color: "#64748B", border: "1px solid #E2E8F0" };

export default function CancellationQueue() {
  const [queue, setQueue]           = useState(MOCK_QUEUE);
  const [history, setHistory]       = useState([]);
  const [activeTab, setActiveTab]   = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAction = (id, action) => {
    const item = queue.find((i) => i.id === id);
    if (!item) return;
    setHistory((prev) => [{ ...item, action, actionAt: new Date().toISOString() }, ...prev]);
    setQueue((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const filtered = queue.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "history") return false;
    return TYPE_META[item.type]?.tab === activeTab;
  });

  const countByTab = (tabKey) => {
    if (tabKey === "all") return queue.length;
    if (tabKey === "history") return history.length;
    return queue.filter((i) => TYPE_META[i.type]?.tab === tabKey).length;
  };

  return (
    <div className="flex gap-5">
      {/* Left — list */}
      <div className="flex-1 rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>Cancellation Queue</h3>
          <span className="text-xs px-2 py-0.5 rounded-full border font-sora text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]">
            {queue.length} รอดำเนินการ
          </span>
        </div>

        <div className="flex gap-1.5 mb-4 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedItem(null); }}
              className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
              style={activeTab === tab.key ? activeFilter : idleFilter}>
              {tab.label}
              <span className="ml-1.5 opacity-60">({countByTab(tab.key)})</span>
            </button>
          ))}
        </div>

        {activeTab !== "history" && (
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && <p className="text-sm font-sora text-center py-8" style={{ color: "#94A3B8" }}>ไม่มีรายการรอดำเนินการ</p>}
            {filtered.map((item) => {
              const meta = TYPE_META[item.type];
              return (
                <div key={item.id} onClick={() => setSelectedItem(item)}
                  className="flex items-center justify-between p-3 rounded-xl border cursor-pointer"
                  style={selectedItem?.id === item.id
                    ? { border: "1px solid rgba(195,255,81,0.40)", background: "rgba(195,255,81,0.05)" }
                    : { border: "1px solid #E2E8F0", background: "transparent" }}
                  onMouseEnter={(e) => { if (selectedItem?.id !== item.id) e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={(e) => { if (selectedItem?.id !== item.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold font-sora" style={{ color: "#0F172A" }}>{item.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="text-xs font-sora" style={{ color: "#64748B" }}>{item.customer} — {item.reason}</p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleAction(item.id, "approved")}
                      className="text-xs px-3 py-1 rounded-lg font-sora"
                      style={{ color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.35)" }}>
                      Approve
                    </button>
                    <button onClick={() => handleAction(item.id, "denied")}
                      className="text-xs px-3 py-1 rounded-lg font-sora"
                      style={{ color: "#DC2626", border: "1px solid #FECACA" }}>
                      Deny
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col gap-2">
            {history.length === 0 && <p className="text-sm font-sora text-center py-8" style={{ color: "#94A3B8" }}>ยังไม่มีประวัติการดำเนินการ</p>}
            {history.map((item, i) => {
              const meta = TYPE_META[item.type];
              return (
                <div key={`${item.id}-${i}`} className="flex items-center justify-between p-3 rounded-xl border" style={{ border: "1px solid #E2E8F0", opacity: 0.8 }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold font-sora" style={{ color: "#94A3B8" }}>{item.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${meta.color}`}>{meta.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                        item.action === "approved"
                          ? "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]"
                          : "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]"
                      }`}>
                        {item.action === "approved" ? "✓ Approved" : "✗ Denied"}
                      </span>
                    </div>
                    <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>
                      {item.customer} · {formatDate(item.actionAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right — detail panel */}
      {selectedItem && activeTab !== "history" && (
        <div className="w-72 rounded-2xl p-5 flex flex-col gap-4 self-start" style={card}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>รายละเอียด</h4>
            <button onClick={() => setSelectedItem(null)} className="text-lg leading-none" style={{ color: "#94A3B8" }}>✕</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold font-sora text-sm" style={{ color: "#0F172A" }}>{selectedItem.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${TYPE_META[selectedItem.type].color}`}>
              {TYPE_META[selectedItem.type].label}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "ลูกค้า",  value: selectedItem.customer },
              { label: "เบอร์โทร", value: selectedItem.phone },
              { label: "ที่อยู่", value: selectedItem.address },
              { label: "รายการ",  value: selectedItem.item },
              { label: "เหตุผล",  value: selectedItem.reason },
              { label: "วันที่ขอ", value: formatDate(selectedItem.requestedAt) },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{f.label}</p>
                <p className="text-sm font-sora" style={{ color: "#0F172A" }}>{f.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => handleAction(selectedItem.id, "approved")}
              className="flex-1 text-xs py-2 rounded-lg font-sora"
              style={{ color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.35)" }}>
              Approve
            </button>
            <button onClick={() => handleAction(selectedItem.id, "denied")}
              className="flex-1 text-xs py-2 rounded-lg font-sora"
              style={{ color: "#DC2626", border: "1px solid #FECACA" }}>
              Deny
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
