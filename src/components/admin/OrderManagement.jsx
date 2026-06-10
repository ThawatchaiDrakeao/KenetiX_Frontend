import { useState } from "react";

const mockOrders = [
  { id: "ORD-001", status: "Waiting", is_active: true, customer: "สมชาย ใจดี", phone: "081-234-5678", address: "123 ถ.สุขุมวิท กรุงเทพฯ", item: "Ultra Boost size 44", rental_plan: "3 วัน", deposit: 500, ordered_at: "2026-06-03T10:00:00Z" },
  { id: "ORD-002", status: "successful", is_active: true, customer: "วิภา รักดี", phone: "089-876-5432", address: "456 ถ.ลาดพร้าว กรุงเทพฯ", item: "Air Max size 40", rental_plan: "7 วัน", deposit: 800, ordered_at: "2026-06-02T14:30:00Z" },
  { id: "ORD-003", status: "Fail", is_active: false, customer: "ประสิทธิ์ มั่นคง", phone: "062-111-2222", address: "789 ถ.ราษฎร์บูรณะ กรุงเทพฯ", item: "Gel-Kayano size 43", rental_plan: "1 วัน", deposit: 300, ordered_at: "2026-06-01T09:15:00Z" },
  { id: "ORD-004", status: "Waiting", is_active: true, customer: "มาลี สวยงาม", phone: "095-333-4444", address: "321 ถ.รัชดาภิเษก กรุงเทพฯ", item: "Pegasus size 38", rental_plan: "3 วัน", deposit: 500, ordered_at: "2026-06-03T08:00:00Z" },
  { id: "ORD-005", status: "Done", is_active: true, customer: "สุรศักดิ์ แข็งแกร่ง", phone: "083-555-6666", address: "654 ถ.พระราม 9 กรุงเทพฯ", item: "React Infinity size 42", rental_plan: "7 วัน", deposit: 800, ordered_at: "2026-05-28T11:00:00Z" },
];

const STATUS_STYLES = {
  Waiting: "text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]",
  Done: "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]",
  Fail: "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]",
  successful: "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]",
};

const ALL_STATUSES = ["Waiting", "Done", "Fail", "successful"];

const card = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const activeFilter = { background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" };
const idleFilter = { background: "transparent", color: "#64748B", border: "1px solid #E2E8F0" };

export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [confirmId, setConfirmId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSoftDelete = (id) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, is_active: false } : o));
    setConfirmId(null);
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchSearch = searchId === "" || o.id.toLowerCase().includes(searchId.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (

    <div className="flex gap-5">
      {/* Left — list */}
      <div className="flex-1 rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#E5E7EB" }}>
            Order Management
          </h3>

          <span className="text-[12px] font-sora" style={{ color: "#9CA3AF" }}>
            {orders.filter((o) => o.is_active).length} active
          </span>
        </div>

        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="ค้นหา Order ID..."
          className="w-full text-sm rounded-lg px-3 py-2 font-sora focus:outline-none mb-3"
          style={{
            background: "#111111",
            border: "1px solid #374151",
            color: "#E5E7EB",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#9CA3AF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#374151";
          }}
        />

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterStatus("ALL")}
            className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
            style={filterStatus === "ALL" ? activeFilter : idleFilter}
          >
            ทั้งหมด ({orders.length})
          </button>

          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
              style={filterStatus === s ? activeFilter : idleFilter}
            >
              {s} ({orders.filter((o) => o.status === s).length})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="text-sm font-sora text-center py-6" style={{ color: "#9CA3AF" }}>
              ไม่พบรายการ
            </p>
          )}

          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={
                selectedOrder?.id === order.id
                  ? { border: "1px solid #4B5563", background: "#111111" }
                  : {
                    border: "1px solid #374151",
                    background: "transparent",
                    opacity: order.is_active ? 1 : 0.5,
                  }
              }
              onMouseEnter={(e) => {
                if (selectedOrder?.id !== order.id) e.currentTarget.style.background = "#111111";
              }}
              onMouseLeave={(e) => {
                if (selectedOrder?.id !== order.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <div>
                <p
                  className="text-sm font-semibold font-sora"
                  style={{
                    color: order.is_active ? "#E5E7EB" : "#9CA3AF",
                    textDecoration: order.is_active ? "none" : "line-through",
                  }}
                >
                  {order.id}
                </p>

                <p className="text-xs font-sora" style={{ color: "#9CA3AF" }}>
                  {order.customer}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-sora ${STATUS_STYLES[order.status] || "text-[#9CA3AF]"
                    }`}
                >
                  {order.status}
                </span>

                {order.is_active && confirmId !== order.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmId(order.id);
                    }}
                    className="text-xs px-2 py-1 rounded-lg font-sora"
                    style={{ color: "#DC2626", border: "1px solid #374151" }}
                  >
                    Delete
                  </button>
                )}

                {confirmId === order.id && (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSoftDelete(order.id)}
                      className="text-xs px-2 py-1 rounded-lg font-sora"
                      style={{ color: "#DC2626", border: "1px solid #374151" }}
                    >
                      ยืนยัน
                    </button>

                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs px-2 py-1 rounded-lg font-sora"
                      style={{ color: "#9CA3AF", border: "1px solid #374151" }}
                    >
                      ยกเลิก
                    </button>
                  </div>
                )}

                {!order.is_active && (
                  <span className="text-xs font-sora" style={{ color: "#6B7280" }}>
                    Deleted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — detail */}
      {selectedOrder && (
        <div className="w-72 rounded-2xl p-5 flex flex-col gap-4 self-start" style={card}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-sora text-[14px]" style={{ color: "#E5E7EB" }}>
              รายละเอียด
            </h4>

            <button onClick={() => setSelectedOrder(null)} className="text-lg leading-none" style={{ color: "#9CA3AF" }}>
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold font-sora text-sm" style={{ color: "#E5E7EB" }}>
              {selectedOrder.id}
            </p>

            <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${STATUS_STYLES[selectedOrder.status]}`}>
              {selectedOrder.status}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "ลูกค้า", value: selectedOrder.customer },
              { label: "เบอร์โทร", value: selectedOrder.phone },
              { label: "ที่อยู่", value: selectedOrder.address },
              { label: "รายการ", value: selectedOrder.item },
              { label: "แผนเช่า", value: selectedOrder.rental_plan },
              { label: "มัดจำ", value: `฿${selectedOrder.deposit.toLocaleString()}` },
              { label: "วันที่สั่ง", value: formatDate(selectedOrder.ordered_at) },
              { label: "สถานะ", value: selectedOrder.is_active ? "Active" : "Deleted" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-sora" style={{ color: "#9CA3AF" }}>
                  {item.label}
                </p>

                <p className="text-sm font-sora" style={{ color: "#E5E7EB" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {selectedOrder.is_active && (
            <button
              onClick={() => {
                setConfirmId(selectedOrder.id);
                setSelectedOrder(null);
              }}
              className="w-full text-xs py-2 rounded-lg font-sora mt-2"
              style={{ color: "#DC2626", border: "1px solid #374151" }}
            >
              Soft Delete Order นี้
            </button>
          )}
        </div>
      )}
    </div>
  );
}
