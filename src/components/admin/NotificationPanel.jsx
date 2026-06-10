import { useState } from "react";

const mockNotifications = [
  { id: "1", title: "งานใหม่รอการอนุมัติ — JOB-000013",      time: "2 นาทีที่แล้ว",    read: false },
  { id: "2", title: "JOB-000011 ส่งสำเร็จแล้ว",               time: "1 ชั่วโมงที่แล้ว", read: false },
  { id: "3", title: "สมหมาย ขอยกเลิก JOB-000010",             time: "2 ชั่วโมงที่แล้ว", read: false },
  { id: "4", title: "JOB-000009 Driver รับงานแล้ว",            time: "3 ชั่วโมงที่แล้ว", read: true  },
  { id: "5", title: "JOB-000008 Customer ปฏิเสธการรับของ",     time: "เมื่อวาน",          read: true  },
];

const card = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="rounded-2xl p-5" style={card}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full border font-sora"
              style={{ background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" }}>
              {unreadCount} ใหม่
            </span>
          )}
        </div>
        <button onClick={markAllRead} className="text-xs font-sora transition-colors"
          style={{ color: "#94A3B8" }}
          onMouseEnter={(e) => { e.target.style.color = "#4D7C0F"; }}
          onMouseLeave={(e) => { e.target.style.color = "#94A3B8"; }}>
          Mark all read
        </button>
      </div>

      <div className="flex flex-col gap-0">
        {notifications.map((n, i) => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className="flex gap-3 items-start px-2 py-3 cursor-pointer rounded-lg transition-colors"
            style={{ borderBottom: i < notifications.length - 1 ? "1px solid #F1F5F9" : "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: n.read ? "#E2E8F0" : "#C3FF51" }} />
            <div>
              <p className="text-sm font-sora" style={{ color: n.read ? "#94A3B8" : "#0F172A" }}>{n.title}</p>
              <p className="text-xs font-sora mt-0.5" style={{ color: "#CBD5E1" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
