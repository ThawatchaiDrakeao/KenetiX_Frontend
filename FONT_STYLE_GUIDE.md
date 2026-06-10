# KinetiX — Font & Color Style Guide

> Font family ทุกหน้า: **SF Pro Display / SF Pro Text** (CSS variable `--font-sora`, class `font-sora`)

---

## สรุปตามกลุ่มธีม

### 🌑 Dark Theme Pages (Frontend)

---

#### Navbar (`src/components/Navbar.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Logo "KINETIX" | `text-[24px]` / `font-extrabold` | `text-white` / `X` = `#C3FF51` |
| Nav links | `text-sm` | `text-white/60` → hover `text-neon` |
| Mobile menu links | `text-sm` | `text-white/70` |
| Cart badge | `text-[9px]` | `#C3FF51` |

---

#### Hero (`src/components/Hero.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Badge / label | `text-xs` | `text-neon` (#C3FF51) |
| Heading หลัก | `text-4xl` → `text-7xl` (responsive) | `text-white` |
| Subheading | `text-base` / `text-lg` | `text-white/55` |
| Body text | `text-sm` | `text-white/40` |
| Stat numbers | `text-2xl` | `text-neon` |

---

#### HowItWorksPage (`src/pages/HowItWorksPage.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Section label | `text-xs` / `text-[11px]` | `text-kinetix-lime` (#C3FF51) |
| Heading | `text-4xl` → `text-7xl` (responsive) | `text-white` |
| Body / description | `text-sm` / `text-base` | `text-zinc-400` |
| Step number | `text-[10px]` | `text-zinc-500` |
| Sub-heading | `text-2xl` / `text-3xl` | `text-white` |
| CTA button text | `text-sm` | `text-black` |

---

#### Catalog (`src/pages/Catalog.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Filter label | `text-[9px]` | `#C3FF51` |
| Product name | `text-xl` / `text-2xl` | `text-white` |
| Price / meta | `text-[11px]` / `text-xs` | `text-white/35` / `text-white/30` |
| Error | `text-sm` | `text-red-400` |
| Empty state | `text-sm` | `text-zinc-400` / `text-zinc-500` |

---

#### Contact (`src/pages/ContactPage.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Section heading | `text-4xl` | `text-white` |
| Label / caption | `text-xs` / `text-[10px]` | `#b4ff39` |
| Body | `text-sm` | `text-gray-400` |
| Placeholder | `text-[10px]` | `text-gray-500` |
| Error | `text-sm` | `text-red-500` |

---

#### User Dashboard (`src/pages/UserDashboard.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Stat number ใหญ่ | `text-4xl` / `text-5xl` | `text-neutral-100` |
| Section heading | `text-2xl` / `text-3xl` | `text-neutral-100` |
| Card heading | `text-lg` | `text-neutral-100` |
| Body / label | `text-sm` | `text-neutral-400` / `text-neutral-500` |
| Caption / meta | `text-xs` | `text-neutral-500` / `text-neutral-600` |
| Lime accent | `text-sm` | `text-lime-400` |
| Error | `text-sm` | `text-red-400` / `text-red-300` |
| Table text | `text-[13px]` | `text-neutral-300` |

---

### ☀️ Light Theme Pages (Auth & Admin)

---

#### Login (`src/pages/Login.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Brand label "RUNNING SHOE RENTAL" | `text-xs` | `#94A3B8` |
| Logo "KINETIX" | `text-3xl` / `font-bold` | `#0F172A` / `X` = `#C3FF51` |
| Card heading | `text-xl` | `#0F172A` |
| Subtitle | `text-sm` | `#94A3B8` |
| Input label | `text-xs` | `#64748B` |
| Input text | `text-sm` | `#0F172A` |
| Button "Sign In" | `text-sm` / `font-semibold` | `#0F172A` บน `#C3FF51` |
| "Don't have an account?" | `text-sm` | `#64748B` |
| "Sign up" link | `text-sm` | `#4D7C0F` → hover `#C3FF51` |
| "Back to Home" | `text-sm` | `#94A3B8` → hover `#0F172A` |
| Error message | `text-sm` | `#DC2626` บน `#FEE2E2` |

---

#### Sign Up (`src/components/SignupPage.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Badge label | `text-sm` | `text-lime-400` (#C3FF51) |
| Heading หลัก | `text-5xl` / `font-bold` | `text-white` / `KINETIX` = `text-lime-400` |
| Body / description | `text-sm` | `text-zinc-400` |
| Feature card title | `text-lg` | `text-white` |
| Feature card body | `text-sm` | `text-zinc-400` |
| Form heading (section) | `text-sm` / `uppercase` | `text-lime-400` |
| Form heading "Create Account" | `text-4xl` | `text-white` |
| Subtitle form | `text-sm` | `text-zinc-400` |
| Input placeholder | `text-sm` | `text-white` (บน `bg-black`) |
| Input label / hint | `text-xs` | — |
| Error field | `text-xs` | `text-red-400` |
| Button "CREATE ACCOUNT" | `text-base` / `font-bold` | `text-black` บน `bg-lime-400` |
| Already have account | `text-sm` | `text-zinc-500` |
| Success heading | `text-3xl` | `text-white` |
| Success sub | `text-sm` | `text-zinc-400` / `text-amber-400` |

---

### 🟢 Admin Dashboard (Light Theme)

---

#### Admin Sidebar (`src/components/admin/AdminSidebar.jsx`)
| Element | Font Size | Color |
|---|---|---|
| Logo "KINETIX" | `text-[14px]` / `font-bold` | `#0F172A` / `X` = `#C3FF51` |
| Nav label (active) | `text-[13px]` | `#4D7C0F` |
| Nav label (idle) | `text-[13px]` | `#64748B` |
| Section label | `text-[10px]` / `uppercase` | `#94A3B8` |
| Admin name | `text-[12px]` / `font-semibold` | `#0F172A` |
| Admin email | `text-[11px]` | `#94A3B8` |
| Logout icon | — | `#CBD5E1` → hover `#94A3B8` |

---

#### Admin Dashboard Pages (ทุกหน้าใน `/admin`)
| Element | Font Size | Color |
|---|---|---|
| Page heading | `text-[14px]` / `font-semibold` | `#0F172A` |
| Dashboard title | `22px` / `font-bold` | `#0F172A` |
| Section subtitle | `text-[13px]` | `#64748B` |
| Card body | `text-sm` | `#0F172A` |
| Label / caption | `text-xs` | `#94A3B8` |
| Muted text | `text-xs` | `#CBD5E1` |
| Filter button (active) | `text-xs` | `#4D7C0F` |
| Filter button (idle) | `text-xs` | `#64748B` |
| Badge lime (success) | `text-xs` | `#4D7C0F` บน `rgba(195,255,81,0.12)` |
| Badge yellow (waiting) | `text-xs` | `#92400E` บน `#FEF3C7` |
| Badge red (fail/error) | `text-xs` | `#DC2626` บน `#FEE2E2` |
| Badge blue (info) | `text-xs` | `#0369A1` บน `#E0F2FE` |

---

## Color Reference

| ชื่อ | Hex | ใช้ใน |
|---|---|---|
| Brand Lime | `#C3FF51` | ปุ่มหลัก, accent, focus border |
| Dark Lime (text) | `#4D7C0F` | text บน white bg |
| Primary Text | `#0F172A` | heading, body (light theme) |
| Secondary Text | `#64748B` | label, subtitle |
| Muted Text | `#94A3B8` | caption, placeholder |
| Disabled Text | `#CBD5E1` | icon, muted |
| Border | `#E2E8F0` | card border, divider |
| Page BG | `#F8FAFC` | background (light) |
| Card BG | `#FFFFFF` | card (light) |
| Dark BG | `#080809` | background (dark theme) |
| Error | `#DC2626` | error text |
| Error BG | `#FEE2E2` | error banner |
| Brand Lime (Contact) | `#C3FF51` | Contact page (updated) |
