import { useState } from "react";

const MOCK_STAFF = [
  { id: "1", name: "Admin Test",  surname: "Kinetix", email: "admin@kinetix.com",  phone: "081-000-0001", role: "admin", is_active: true,  createdAt: "2026-01-01T00:00:00Z" },
  { id: "2", name: "Ozella",      surname: "Smith",   email: "ozella@kinetix.com", phone: "082-000-0002", role: "staff", is_active: true,  createdAt: "2026-02-10T00:00:00Z" },
  { id: "3", name: "Karen",       surname: "Brown",   email: "karen@kinetix.com",  phone: "083-000-0003", role: "staff", is_active: true,  createdAt: "2026-02-15T00:00:00Z" },
  { id: "4", name: "Andres",      surname: "Garcia",  email: "andres@kinetix.com", phone: "084-000-0004", role: "staff", is_active: false, createdAt: "2026-03-01T00:00:00Z" },
  { id: "5", name: "Laney",       surname: "Jones",   email: "laney@kinetix.com",  phone: "085-000-0005", role: "staff", is_active: true,  createdAt: "2026-03-20T00:00:00Z" },
];

const initials = (name, surname) => `${name?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
const EMPTY_FORM = { name: "", surname: "", email: "", phone: "", role: "staff", is_active: true };

const card         = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const inner        = { background: "#F8FAFC", border: "1px solid #E2E8F0" };
const activeFilter = { background: "rgba(195,255,81,0.10)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.30)" };
const idleFilter   = { background: "transparent", color: "#64748B", border: "1px solid #E2E8F0" };

export default function StaffTable() {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [filterRole, setFilterRole] = useState("ALL");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [mode, setMode]       = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);

  const filtered = staffList.filter((s) => {
    const matchRole   = filterRole === "ALL" || s.role === filterRole;
    const matchSearch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const openDetail = (s) => { setSelected(s); setMode("detail"); };
  const openEdit   = (s) => { setSelected(s); setForm({ ...s }); setMode("edit"); };
  const openAdd    = ()  => { setSelected(null); setForm(EMPTY_FORM); setMode("add"); };
  const closePanel = ()  => { setSelected(null); setMode(null); };

  const handleSave = () => {
    if (mode === "edit") setStaffList((prev) => prev.map((s) => s.id === selected.id ? { ...s, ...form } : s));
    else if (mode === "add") setStaffList((prev) => [...prev, { ...form, id: String(Date.now()), createdAt: new Date().toISOString() }]);
    closePanel();
  };

  const toggleActive = (id) => {
    setStaffList((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !s.is_active } : s));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  return (
    <div className="flex gap-5">
      {/* Left — list */}
      <div className="flex-1 rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>Staff Management</h3>
          <button onClick={openAdd} className="text-xs px-3 py-1.5 rounded-lg font-semibold font-sora"
            style={{ background: "#C3FF51", color: "#0F172A" }}>
            + เพิ่ม Staff
          </button>
        </div>

        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อหรือ email..."
          className="w-full text-sm rounded-lg px-3 py-2 font-sora focus:outline-none mb-3"
          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; }}
        />

        <div className="flex gap-2 mb-4">
          {["ALL", "admin", "staff"].map((r) => (
            <button key={r} onClick={() => setFilterRole(r)}
              className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
              style={filterRole === r ? activeFilter : idleFilter}>
              {r === "ALL" ? `ทั้งหมด (${staffList.length})` : `${r} (${staffList.filter((s) => s.role === r).length})`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && <p className="text-sm font-sora text-center py-6" style={{ color: "#94A3B8" }}>ไม่พบรายการ</p>}
          {filtered.map((s) => (
            <div key={s.id} onClick={() => openDetail(s)}
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={selected?.id === s.id
                ? { border: "1px solid rgba(195,255,81,0.40)", background: "rgba(195,255,81,0.05)" }
                : { border: "1px solid #E2E8F0", background: "transparent" }}
              onMouseEnter={(e) => { if (selected?.id !== s.id) e.currentTarget.style.background = "#F8FAFC"; }}
              onMouseLeave={(e) => { if (selected?.id !== s.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-sora flex-shrink-0"
                  style={{ background: "rgba(195,255,81,0.10)", border: "1px solid rgba(195,255,81,0.25)", color: "#4D7C0F" }}>
                  {initials(s.name, s.surname)}
                </div>
                <div>
                  <p className="text-sm font-medium font-sora" style={{ color: "#0F172A" }}>{s.name} {s.surname}</p>
                  <p className="text-xs font-sora" style={{ color: "#64748B" }}>{s.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                  s.role === "admin" ? "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]" : "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]"
                }`}>{s.role}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                  s.is_active ? "text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]" : "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]"
                }`}>{s.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — detail / edit / add panel */}
      {mode && (
        <div className="w-72 rounded-2xl p-5 flex flex-col gap-4 self-start" style={card}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>
              {mode === "detail" ? "รายละเอียด" : mode === "edit" ? "แก้ไข Staff" : "เพิ่ม Staff"}
            </h4>
            <button onClick={closePanel} className="text-lg leading-none" style={{ color: "#94A3B8" }}>✕</button>
          </div>

          {mode === "detail" && selected && (
            <>
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold font-sora"
                  style={{ background: "rgba(195,255,81,0.10)", border: "1px solid rgba(195,255,81,0.25)", color: "#4D7C0F" }}>
                  {initials(selected.name, selected.surname)}
                </div>
                <p className="font-semibold font-sora" style={{ color: "#0F172A" }}>{selected.name} {selected.surname}</p>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                    selected.role === "admin" ? "text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]" : "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]"
                  }`}>{selected.role}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${
                    selected.is_active ? "text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]" : "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]"
                  }`}>{selected.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid #E2E8F0" }}>
                {[{ label: "Email", value: selected.email }, { label: "Phone", value: selected.phone }, { label: "เพิ่มเมื่อ", value: formatDate(selected.createdAt) }].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{f.label}</p>
                    <p className="text-sm font-sora" style={{ color: "#0F172A" }}>{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(selected)} className="flex-1 text-xs py-2 rounded-lg font-sora"
                  style={{ color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.35)" }}>Edit</button>
                <button onClick={() => toggleActive(selected.id)}
                  className="flex-1 text-xs py-2 rounded-lg border font-sora"
                  style={selected.is_active
                    ? { color: "#DC2626", border: "1px solid #FECACA" }
                    : { color: "#166534", border: "1px solid #BBF7D0" }}>
                  {selected.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </>
          )}

          {(mode === "edit" || mode === "add") && (
            <>
              <div className="flex flex-col gap-3">
                {[{ key: "name", label: "ชื่อ", type: "text" }, { key: "surname", label: "นามสกุล", type: "text" }, { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone", type: "text" }].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-sora mb-1 block" style={{ color: "#64748B" }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full text-sm rounded-lg px-3 py-2 font-sora focus:outline-none"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
                      onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; }}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-sora mb-1 block" style={{ color: "#64748B" }}>Role</label>
                  <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full text-sm rounded-lg px-3 py-2 font-sora focus:outline-none"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg" style={inner}>
                  <span className="text-sm font-sora" style={{ color: "#374151" }}>is_active</span>
                  <button onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                    className="w-10 h-5 rounded-full transition-colors relative"
                    style={{ background: form.is_active ? "#C3FF51" : "#E2E8F0" }}>
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm"
                      style={{ left: form.is_active ? "1.25rem" : "0.125rem" }} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="flex-1 text-sm py-2 rounded-lg font-semibold font-sora"
                  style={{ background: "#C3FF51", color: "#0F172A" }}>
                  {mode === "edit" ? "บันทึก" : "เพิ่ม Staff"}
                </button>
                <button onClick={closePanel} className="flex-1 text-sm py-2 rounded-lg font-sora"
                  style={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
                  ยกเลิก
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
