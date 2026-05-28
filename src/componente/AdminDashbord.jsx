import React from "react";
import {
  Menu,
  Search,
  Home,
  BarChart3,
  Mail,
  Image,
  Calendar,
  Users,
  Settings,
  Bell,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Zap,
} from "lucide-react";

/* ── Google Font: Sora ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --neon:      #C3FF51;
      --neon-hover:#D3FE51;
      --bg:        #E4E6EB;
      --dark-card: #080809;
      --white-card:#FFFFFF;
      --cyan:      #00E5FF;
      --grad-from: #00FF41;
      --grad-to:   #00E5FF;
      --text-dark: #1A1A1A;
      --border:    #CBD5E1;
      --sidebar-bg:#080809;
    }

    body { font-family: 'Sora', sans-serif; background: var(--bg); }

    /* scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--neon); border-radius: 4px; }

    .sidebar-icon {
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px; cursor: pointer; color: #555;
      transition: background 0.2s, color 0.2s;
    }
    .sidebar-icon:hover { background: rgba(195,255,81,0.12); color: var(--neon); }
    .sidebar-icon.active { background: var(--neon); color: #080809; }

    .stat-card {
      border-radius: 20px; padding: 22px;
      border: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: flex-start;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }

    .stat-card.dark { background: var(--dark-card); color: #fff; border-color: #1a1a1a; }
    .stat-card.light { background: var(--white-card); color: var(--text-dark); }

    .stat-icon-wrap {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-wrap.dark { background: #181818; color: var(--neon); }
    .stat-icon-wrap.light { background: #F3F4F6; color: var(--text-dark); }

    .neon-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: var(--neon); color: #080809;
      font-size: 11px; font-weight: 700; padding: 2px 8px;
      border-radius: 20px;
    }
    .cyan-badge {
      background: rgba(0,229,255,0.12); color: var(--cyan);
      font-size: 11px; font-weight: 600; padding: 2px 8px;
      border-radius: 20px;
    }

    .bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .bar {
      width: 36px; border-radius: 8px 8px 0 0;
      background: #E4E6EB;
      position: relative; overflow: hidden;
    }
    .bar-fill {
      position: absolute; bottom: 0; left: 0; width: 100%;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(to top, var(--grad-from), var(--grad-to));
    }

    .small-card {
      border-radius: 20px; padding: 20px;
      border: 1px solid var(--border);
      transition: transform 0.2s;
    }
    .small-card:hover { transform: translateY(-2px); }
    .small-card.dark { background: var(--dark-card); color: #fff; border-color: #1a1a1a; }
    .small-card.light { background: var(--white-card); color: var(--text-dark); }

    .donut-ring {
      width: 160px; height: 160px; border-radius: 50%;
      background: conic-gradient(var(--neon) 0% 30%, var(--cyan) 30% 75%, #1E2022 75% 100%);
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .donut-ring::after {
      content: ''; width: 100px; height: 100px; border-radius: 50%;
      background: var(--white-card);
      position: absolute;
    }
    .donut-label {
      position: relative; z-index: 1; text-align: center;
    }

    .weekly-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .weekly-bar { width: 36px; border-radius: 8px 8px 0 0; background: #EEF0F3; position: relative; overflow: hidden; }
    .weekly-fill {
      position: absolute; bottom: 0; left: 0; width: 100%;
      border-radius: 8px 8px 0 0;
      background: var(--dark-card);
    }
    .weekly-fill.accent { background: linear-gradient(to top, var(--grad-from), var(--grad-to)); }

    .table-row { border-top: 1px solid #F1F3F5; transition: background 0.15s; }
    .table-row:hover { background: #F8F9FA; }

    .ticket-card {
      border: 1px solid var(--border); border-radius: 16px; padding: 18px;
      margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;
      background: #FAFAFA; transition: border-color 0.2s;
    }
    .ticket-card:hover { border-color: var(--neon); }

    .priority-tag {
      padding: 4px 14px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
      background: #F3F4F6; color: #6B7280;
    }
    .version-tag {
      padding: 4px 14px; border-radius: 20px;
      font-size: 11px; font-weight: 700;
      background: var(--neon); color: #080809;
    }

    .header-search {
      display: flex; align-items: center; gap: 8px;
      background: white; border: 1px solid var(--border);
      border-radius: 12px; padding: 8px 14px;
      font-size: 13px; color: #9CA3AF;
    }

    .notif-dot {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; border-radius: 50%;
      background: var(--neon); color: #080809;
      font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    .gradient-text {
      background: linear-gradient(90deg, var(--grad-from), var(--grad-to));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-title {
      font-size: 16px; font-weight: 700; color: var(--text-dark);
      display: flex; align-items: center; gap-6px;
    }

    .cat-bar {
      border-radius: 10px 10px 0 0;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 10px; font-size: 11px; font-weight: 700; color: white;
    }
  `}</style>
);

/* ─── StatCard ─── */
const StatCard = ({ title, value, sub, dark, icon, subPositive }) => (
  <div className={`stat-card ${dark ? "dark" : "light"}`}>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.55, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 8, letterSpacing: "-0.02em" }}>{value}</h2>
      <span style={{
        fontSize: 11, fontWeight: 600, marginTop: 6, display: "inline-block",
        color: dark ? (subPositive !== false ? "#C3FF51" : "#FF6B6B") : (subPositive !== false ? "#22C55E" : "#EF4444"),
      }}>{sub}</span>
    </div>
    <div className={`stat-icon-wrap ${dark ? "dark" : "light"}`}>
      {icon}
    </div>
  </div>
);

/* ─── SmallCard ─── */
const SmallCard = ({ title, value, sub, dark }) => (
  <div className={`small-card ${dark ? "dark" : "light"}`}>
    <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</p>
    <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 10, letterSpacing: "-0.02em" }}>{value}</h3>
    <p style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>{sub}</p>
  </div>
);

/* ─── SidebarIcon ─── */
const SidebarIcon = ({ children, active }) => (
  <div className={`sidebar-icon${active ? " active" : ""}`}>{children}</div>
);

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  const salesData = [
    { month: "Jan", pct: 40 },
    { month: "Feb", pct: 90 },
    { month: "Mar", pct: 60 },
    { month: "Apr", pct: 100 },
    { month: "May", pct: 50 },
    { month: "Jun", pct: 75 },
  ];

  const weeklyData = [
    { day: "Mon", pct: 70, accent: false },
    { day: "Tue", pct: 55, accent: false },
    { day: "Wed", pct: 60, accent: false },
    { day: "Thu", pct: 90, accent: true },
    { day: "Fri", pct: 50, accent: false },
    { day: "Sat", pct: 75, accent: false },
    { day: "Sun", pct: 68, accent: false },
  ];

  return (
    <>
      <FontLoader />
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", fontFamily: "'Sora', sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 76, background: "var(--sidebar-bg)", display: "flex",
          flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 8,
          borderRight: "1px solid #111", position: "sticky", top: 0, height: "100vh",
        }}>
          {/* Logo */}
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--neon)", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <Zap size={20} color="#080809" fill="#080809" />
          </div>

          <SidebarIcon active><Home size={18} /></SidebarIcon>
          <SidebarIcon><Search size={18} /></SidebarIcon>
          <SidebarIcon><BarChart3 size={18} /></SidebarIcon>
          <SidebarIcon><Mail size={18} /></SidebarIcon>
          <SidebarIcon><Image size={18} /></SidebarIcon>
          <SidebarIcon><Calendar size={18} /></SidebarIcon>
          <SidebarIcon><Users size={18} /></SidebarIcon>

          <div style={{ flex: 1 }} />
          <SidebarIcon><Settings size={18} /></SidebarIcon>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Welcome back 👋
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-dark)", letterSpacing: "-0.02em" }}>
                Your <span className="gradient-text">Company</span>
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Search */}
              <div className="header-search">
                <Search size={14} />
                <span style={{ fontSize: 13 }}>Search…</span>
              </div>

              {/* Bell */}
              <div style={{ position: "relative", cursor: "pointer" }}>
                <Bell size={20} color="var(--text-dark)" />
                <div className="notif-dot">2</div>
              </div>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src="https://i.pravatar.cc/100" alt="avatar"
                  style={{ width: 40, height: 40, borderRadius: 12, border: "2px solid var(--neon)" }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>Renee McKelvey</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>Product Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Top Stat Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
            <StatCard title="Total Sales" value="21,324" sub="▲ +2,031 this month" dark icon={<ShoppingCart size={18} />} />
            <StatCard title="Total Income" value="$221K" sub="▼ -$2,201" subPositive={false} icon={<DollarSign size={18} />} />
            <StatCard title="Total Orders" value="16,703" sub="▲ +3,392" icon={<Users size={18} />} />
            <StatCard title="Conversion" value="12.8%" sub="▼ -1.22%" subPositive={false} icon={<UserCheck size={18} />} />
          </div>

          {/* ── Charts Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

            {/* Sales Performance */}
            <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)" }}>Sales Performance</h2>
                <span className="neon-badge"><Zap size={10} /> Live</span>
              </div>

              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                {salesData.map((d, i) => (
                  <div key={i} className="bar-wrap">
                    <div className="bar" style={{ height: 180 }}>
                      <div className="bar-fill" style={{ height: `${d.pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)", marginBottom: 24 }}>Popular Categories</h2>

              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 14 }}>
                {[
                  { pct: 30, h: 120, bg: "var(--dark-card)", label: "30%" },
                  { pct: 50, h: 180, bg: "linear-gradient(to top,var(--grad-from),var(--grad-to))", label: "50%" },
                  { pct: 20, h: 80, bg: "#CBD5E1", label: "20%" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>{c.label}</span>
                    <div style={{
                      width: 48, height: c.h, borderRadius: "10px 10px 0 0",
                      background: c.bg,
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Middle Section ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 16, marginBottom: 20 }}>

            {/* Donut */}
            <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)", marginBottom: 20 }}>Order Status</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div className="donut-ring">
                  <div className="donut-label" style={{ zIndex: 2, position: "absolute" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-dark)", textAlign: "center" }}>75%</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>Done</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  {[
                    { color: "var(--neon)", label: "Completed 30%" },
                    { color: "var(--cyan)", label: "Pending 45%" },
                    { color: "#1E2022", label: "Cancelled 25%" },
                  ].map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Small Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              <SmallCard title="Total Products" value="100" sub="▲ +10 this week" dark />
              <SmallCard title="Gender Split" value="M / F" sub="50% each" />
              <SmallCard title="Available Stock" value="52" sub="▼ -5 units" />
              <SmallCard title="Rent Stock" value="33" sub="▲ +3 units" />
              <SmallCard title="In Service" value="16" sub="▼ -2 units" />
              <SmallCard title="Need Replace" value="1" sub="▼ -2 units" />
            </div>
          </div>

          {/* ── Visitors Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 20 }}>

            {/* Left stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <SmallCard title="Unique Visitors" value="1,340" sub="Current month" dark />
              <SmallCard title="Total Members" value="123" sub="" />
              <SmallCard title="New Members" value="16" sub="This month" />
            </div>

            {/* Weekly Visitors */}
            <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)" }}>Weekly Visitors</h2>
                <span className="cyan-badge">This week</span>
              </div>
              <div style={{ height: 180, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                {weeklyData.map((d, i) => (
                  <div key={i} className="weekly-bar-wrap">
                    <div className="weekly-bar" style={{ height: 160 }}>
                      <div className={`weekly-fill${d.accent ? " accent" : ""}`} style={{ height: `${d.pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Customers Table ── */}
          <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)" }}>Recent Customers</h2>
              <button style={{
                fontSize: 11, fontWeight: 700, color: "#080809",
                background: "var(--neon)", border: "none", borderRadius: 8,
                padding: "6px 14px", cursor: "pointer",
              }}>View All</button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name", "Order Date", "Phone", "Location", "Registered", "Action"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", fontSize: 11, fontWeight: 600,
                        color: "#9CA3AF", paddingBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Jerry Mattedi", "19 May, 2024", "251-661-5362", "New York"],
                    ["Elianora Vasilov", "18 May, 2024", "171-534-1262", "Ontario"],
                    ["Alvis Daen", "17 May, 2024", "974-661-5110", "Milan"],
                    ["Lissa Shipsey", "23 Apr, 2024", "541-661-3042", "San Francisco"],
                  ].map((row, i) => (
                    <tr key={i} className="table-row">
                      <td style={{ padding: "14px 0", fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{row[0]}</td>
                      <td style={{ fontSize: 12, color: "#6B7280" }}>{row[1]}</td>
                      <td style={{ fontSize: 12, color: "#6B7280" }}>{row[2]}</td>
                      <td style={{ fontSize: 12, color: "#6B7280" }}>{row[3]}</td>
                      <td><span className="neon-badge">Yes</span></td>
                      <td>
                        <button style={{
                          fontSize: 11, fontWeight: 700, color: "var(--text-dark)",
                          background: "transparent", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                        }}>Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── New Tickets ── */}
          <div style={{ background: "var(--white-card)", borderRadius: 20, border: "1px solid var(--border)", padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-dark)" }}>New Tickets</h2>
              <span style={{
                fontSize: 11, fontWeight: 700, background: "rgba(0,229,255,0.1)",
                color: "var(--cyan)", padding: "4px 12px", borderRadius: 20,
              }}>2 Open</span>
            </div>

            {[1, 2].map(item => (
              <div key={item} className="ticket-card">
                <div style={{ display: "flex", gap: 14 }}>
                  <img src="https://i.pravatar.cc/80" alt="avatar"
                    style={{ width: 46, height: 46, borderRadius: 12, border: "2px solid var(--border)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>Christian Bilney</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>2 days ago</p>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, molestiae.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <span className="priority-tag">Low priority</span>
                  <span className="version-tag">V 3.20</span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}
