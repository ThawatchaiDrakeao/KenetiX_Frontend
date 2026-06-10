import { useState } from "react";

const WEEKLY_REVENUE = [
  { day: "จ",  revenue: 4200,  orders: 3 },
  { day: "อ",  revenue: 6800,  orders: 5 },
  { day: "พ",  revenue: 3100,  orders: 2 },
  { day: "พฤ", revenue: 8400,  orders: 6 },
  { day: "ศ",  revenue: 11200, orders: 8 },
  { day: "ส",  revenue: 9600,  orders: 7 },
  { day: "อา", revenue: 5300,  orders: 4 },
];

const RENTAL_PLAN_DATA = [
  { plan: "1 วัน", count: 12, revenue: 3600  },
  { plan: "3 วัน", count: 18, revenue: 12600 },
  { plan: "7 วัน", count: 9,  revenue: 18900 },
];

const TOP_ITEMS = [
  { name: "Ultra Boost",   brand: "Adidas", rentals: 14, revenue: 16800 },
  { name: "Air Max",       brand: "Nike",   rentals: 11, revenue: 13200 },
  { name: "Gel-Kayano",    brand: "Asics",  rentals: 8,  revenue: 9600  },
  { name: "React Infinity",brand: "Nike",   rentals: 6,  revenue: 7200  },
];

const SUMMARY = {
  totalRevenue: 48600, depositCollected: 19500, rentalIncome: 29100,
  avgOrderValue: 1243, successRate: 87, totalOrders: 39,
};

const PERIODS = ["สัปดาห์นี้", "เดือนนี้", "3 เดือน"];

const card = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const inner = { background: "#F8FAFC", border: "1px solid #E2E8F0" };

export default function ProfitAnalysis() {
  const [period, setPeriod] = useState("สัปดาห์นี้");
  const maxRevenue = Math.max(...WEEKLY_REVENUE.map((d) => d.revenue));
  const totalPlanRevenue = RENTAL_PLAN_DATA.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="flex flex-col gap-5">

      {/* Period selector */}
      <div className="flex justify-end">
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="text-xs px-3 py-1.5 rounded-lg border font-sora transition-colors"
              style={
                period === p
                  ? { background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" }
                  : { background: "transparent", color: "#64748B", border: "1px solid #E2E8F0" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "รายได้รวม",    prefix: "฿", value: SUMMARY.totalRevenue.toLocaleString(),       sub: "+12% จากสัปดาห์ก่อน" },
          { label: "มัดจำที่เก็บได้", prefix: "฿", value: SUMMARY.depositCollected.toLocaleString(), sub: `${SUMMARY.totalOrders} orders` },
          { label: "รายได้ค่าเช่า",  prefix: "฿", value: SUMMARY.rentalIncome.toLocaleString(),      sub: "ไม่รวมมัดจำ" },
          { label: "เฉลี่ย/order",  prefix: "฿", value: SUMMARY.avgOrderValue.toLocaleString(),     sub: "avg order value" },
          { label: "อัตราสำเร็จ",   prefix: "",  value: `${SUMMARY.successRate}%`,                   sub: "ของ orders ทั้งหมด" },
          { label: "Orders ทั้งหมด", prefix: "", value: String(SUMMARY.totalOrders),                 sub: "สัปดาห์นี้" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={inner}>
            <p className="text-[11px] font-sora mb-2 tracking-wide uppercase" style={{ color: "#94A3B8" }}>{m.label}</p>
            <p className="font-sora leading-none" style={{ color: "#0F172A" }}>
              {m.prefix && <span className="text-sm font-normal mr-0.5" style={{ color: "#64748B" }}>{m.prefix}</span>}
              <span className="text-2xl font-semibold tabular-nums tracking-tight">{m.value}</span>
            </p>
            <p className="text-[11px] font-sora mt-2" style={{ color: "#4D7C0F" }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="rounded-xl p-5" style={card}>
        <p className="font-semibold font-sora mb-4 text-sm" style={{ color: "#0F172A" }}>รายได้รายวัน (฿)</p>
        <div className="flex items-end gap-2 h-32">
          {WEEKLY_REVENUE.map((d) => {
            const heightPct = (d.revenue / maxRevenue) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex flex-col items-center justify-end" style={{ height: "96px" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10">
                    <div className="rounded-lg px-2 py-1 text-center whitespace-nowrap" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                      <p className="text-xs font-semibold font-sora" style={{ color: "#4D7C0F" }}>฿{d.revenue.toLocaleString()}</p>
                      <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{d.orders} orders</p>
                    </div>
                  </div>
                  <div
                    className="w-full rounded-t-md transition-all duration-300 opacity-75 group-hover:opacity-100"
                    style={{ height: `${heightPct}%`, background: `linear-gradient(to top, rgba(195,255,81,0.5), #C3FF51)` }}
                  />
                </div>
                <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{d.day}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Rental plan breakdown */}
        <div className="rounded-xl p-5" style={card}>
          <p className="font-semibold font-sora mb-4 text-sm" style={{ color: "#0F172A" }}>สัดส่วน Rental Plan</p>
          <div className="flex flex-col gap-4">
            {RENTAL_PLAN_DATA.map((r) => {
              const pct = Math.round((r.revenue / totalPlanRevenue) * 100);
              return (
                <div key={r.plan}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-sora" style={{ color: "#374151" }}>
                      {r.plan}
                      <span className="ml-1.5 text-[11px]" style={{ color: "#94A3B8" }}>({r.count} orders)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold font-sora" style={{ color: "#0F172A" }}>฿{r.revenue.toLocaleString()}</span>
                      <span className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#C3FF51", transition: "width 500ms ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top items */}
        <div className="rounded-xl p-5" style={card}>
          <p className="font-semibold font-sora mb-4 text-sm" style={{ color: "#0F172A" }}>Top Items</p>
          <div className="flex flex-col gap-1">
            {TOP_ITEMS.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < TOP_ITEMS.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-sora w-5" style={{ color: i === 0 ? "#4D7C0F" : "#CBD5E1" }}>
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold font-sora" style={{ color: "#0F172A" }}>{item.name}</p>
                    <p className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>{item.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-semibold font-sora" style={{ color: "#4D7C0F" }}>฿{item.revenue.toLocaleString()}</p>
                  <p className="text-[11px] font-sora" style={{ color: "#94A3B8" }}>{item.rentals} rentals</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
