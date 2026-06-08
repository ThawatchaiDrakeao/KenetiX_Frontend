import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── THEME ─────────────────────────────────────────────────────────────────────
const LIME    = "#C3FF51";
const LIME2   = "#52D600";
const BG      = "#050505";
const SURFACE = "rgba(255,255,255,0.03)";
const BORDER  = "rgba(255,255,255,0.07)";
const GLOW    = "0 0 40px rgba(141,255,0,0.18), 0 0 80px rgba(141,255,0,0.08)";

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeIn  = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } };

// ── DATA ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "3,500+", label: "Members"           },
  { value: "25+",    label: "Weekly Activities"  },
  { value: "40+",    label: "Monthly Meetups"    },
  { value: "4.9★",   label: "Community Rating"  },
];

const EXPERIENCES = [
  {
    id: "run", title: "RUN CLUB", tag: "Tue & Sat — 19:00",
    icon: "🏃", accentColor: LIME, img: "/community/run-club.png",
    points: ["Group runs every week", "5km / 10km routes", "Urban night running", "GPS tracked sessions"],
  },
  {
    id: "ice", title: "ICE BATH RECOVERY", tag: "Every Thursday — 18:30",
    icon: "❄️", accentColor: "#00D4FF", img: "/community/ice-bath.png",
    points: ["Guided cold exposure", "Breathwork protocol", "3–8 min immersion", "Performance recovery"],
  },
  {
    id: "coffee", title: "COFFEE SOCIAL", tag: "Every Sunday — 08:00",
    icon: "☕", accentColor: "#FFB347", img: "/community/coffee-social.png",
    points: ["Community networking", "Wellness conversations", "Specialty coffee", "Post-run gathering"],
  },
];

const EVENTS = [
  { id: 1, title: "Run Club Night Session",      date: "Sat 14 Jun", time: "19:00", seats: 8,  type: "RUN",    color: LIME,      icon: "🏃" },
  { id: 2, title: "Ice Bath Recovery Workshop",  date: "Thu 19 Jun", time: "18:30", seats: 4,  type: "ICE",    color: "#00D4FF", icon: "❄️" },
  { id: 3, title: "Coffee Community Meetup",     date: "Sun 22 Jun", time: "08:00", seats: 12, type: "COFFEE", color: "#FFB347", icon: "☕" },
];

const FEED = [
  { id: 1, user: "cookieyda",     initials: "CY", color: LIME,      action: "Completed 10km night run",    time: "2h",  likes: 48, comments: 12, badge: "🏃" },
  { id: 2, user: "jirayu_jj",    initials: "JJ", color: "#00D4FF", action: "Ice bath — 5 min hold ❄️",   time: "4h",  likes: 63, comments: 8,  badge: "❄️" },
  { id: 3, user: "annethong",    initials: "AT", color: "#FFB347", action: "Sunday Coffee Social ☕",     time: "6h",  likes: 31, comments: 5,  badge: "☕" },
  { id: 4, user: "toey_run",     initials: "TR", color: LIME,      action: "New PB — 5km in 22:14 🔥",   time: "1d",  likes: 92, comments: 21, badge: "🏆" },
  { id: 5, user: "mint_kinetix", initials: "MK", color: "#FF6B9D", action: "Breathwork + cold plunge",    time: "1d",  likes: 44, comments: 9,  badge: "❄️" },
  { id: 6, user: "pat_stride",   initials: "PS", color: "#FFB347", action: "Best coffee chat ever",       time: "2d",  likes: 27, comments: 6,  badge: "☕" },
];

const LEADERBOARD = [
  { rank: 1, name: "Jirayu J.",  initials: "JJ", pts: 4280, streak: "12w", badge: "🏆", role: "Top Runner",          color: LIME      },
  { rank: 2, name: "Anne T.",    initials: "AT", pts: 3910, streak: "9w",  badge: "❄️", role: "Recovery Champion",   color: "#00D4FF" },
  { rank: 3, name: "Cookie Y.",  initials: "CY", pts: 3540, streak: "8w",  badge: "☕", role: "Community Connector", color: "#FFB347" },
  { rank: 4, name: "Toey P.",    initials: "TP", pts: 3200, streak: "7w",  badge: "🏃", role: "Top Runner",          color: LIME      },
  { rank: 5, name: "Mint K.",    initials: "MK", pts: 2880, streak: "6w",  badge: "⭐", role: "Recovery Champion",   color: "#FF6B9D" },
];

const BENEFITS = [
  { icon: "⚡", title: "Exclusive Events"       },
  { icon: "🎁", title: "Partner Discounts"      },
  { icon: "⭐", title: "Priority Registration"  },
  { icon: "❄️", title: "Recovery Sessions"      },
  { icon: "🧘", title: "Wellness Workshops"     },
  { icon: "🤝", title: "Community Networking"   },
  { icon: "👕", title: "Merchandise Access"     },
  { icon: "🏅", title: "Private Challenges"     },
];

const TESTIMONIALS = [
  { name: "Jirayu J.",  initials: "JJ", role: "Top Runner",          color: LIME,      rating: 5, text: "Running brought me here. The people made me stay. KINETIX Community completely changed how I approach fitness and recovery." },
  { name: "Anne T.",    initials: "AT", role: "Recovery Champion",   color: "#00D4FF", rating: 5, text: "The best fitness and wellness community I've ever joined. Ice bath sessions combined with Sunday coffee meetups — nothing like it." },
  { name: "Cookie Y.",  initials: "CY", role: "Community Connector", color: "#FFB347", rating: 5, text: "I came for the running, I stayed for the community. Every Sunday coffee social is the absolute highlight of my week." },
];

const GALLERY = [
  { id: 1, label: "Night Run — Silom",     tall: true,  bg: "linear-gradient(160deg, #0c1f00 0%, #162e00 50%, #050505 100%)" },
  { id: 2, label: "Ice Bath Recovery",     tall: false, bg: "linear-gradient(160deg, #001428 0%, #002040 100%)"              },
  { id: 3, label: "Sunday Coffee Social",  tall: false, bg: "linear-gradient(160deg, #1a0e00 0%, #2a1800 100%)"              },
  { id: 4, label: "5km PB Day",            tall: true,  bg: "linear-gradient(160deg, #0a1400 0%, #182400 100%)"              },
  { id: 5, label: "Breathwork Session",    tall: false, bg: "linear-gradient(160deg, #080820 0%, #101030 100%)"              },
  { id: 6, label: "Community Meetup",      tall: false, bg: "linear-gradient(160deg, #1a0500 0%, #280800 100%)"              },
];

// ── SHARED UI COMPONENTS ──────────────────────────────────────────────────────
function GlassCard({ children, className = "", style = {}, glow = false, hoverGlow = true }) {
  return (
    <motion.div
      className={`rounded-3xl ${className}`}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        backdropFilter: "blur(24px)",
        ...(glow ? { boxShadow: GLOW } : {}),
        ...style,
      }}
      whileHover={hoverGlow ? {
        borderColor: "rgba(141,255,0,0.30)",
        boxShadow: GLOW,
        y: -4,
        transition: { duration: 0.25 },
      } : {}}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }) {
  return (
    <motion.span variants={fadeUp}
      className="inline-block text-[11px] font-bold tracking-[0.35em] uppercase mb-5"
      style={{ color: LIME }}>
      {text}
    </motion.span>
  );
}

function Avatar({ initials, color, size = "w-10 h-10", textSize = "text-xs" }) {
  return (
    <div className={`${size} rounded-full flex items-center justify-center font-bold text-black shrink-0 ${textSize}`}
      style={{ background: color }}>
      {initials}
    </div>
  );
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3" fill={i < count ? LIME : "rgba(255,255,255,0.15)"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── HERO SECTION ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden"
      style={{ background: BG }}>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(141,255,0,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(141,255,0,0.04) 0%, transparent 70%)" }} />
        <div className="absolute top-20 right-10 w-60 h-60 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-5xl mx-auto pt-28">
        <motion.div initial="hidden" animate="show" variants={stagger}>

          <motion.span variants={fadeUp}
            className="inline-block text-[11px] font-bold tracking-[0.4em] uppercase mb-6 px-4 py-1.5 rounded-full"
            style={{ color: LIME, border: `1px solid rgba(141,255,0,0.25)`, background: "rgba(141,255,0,0.06)" }}>
            KINETIX COMMUNITY
          </motion.span>

          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">
            Move Better.<br />
            <span style={{ color: LIME }}>Recover</span> Smarter.<br />
            Connect Stronger.
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10"
            style={{ color: "#A0A0A0" }}>
            Join a community built around movement, recovery, and meaningful connections. Run together. Grow together.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Link to="/signup">
              <motion.button
                className="px-8 py-4 rounded-2xl font-bold text-sm tracking-wide text-black"
                style={{ background: LIME }}
                whileHover={{ scale: 1.04, boxShadow: GLOW }}
                whileTap={{ scale: 0.97 }}>
                Join Community →
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide"
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#fff" }}
              whileHover={{ borderColor: "rgba(141,255,0,0.30)", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("experiences")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Activities
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <GlassCard className="p-5 text-center" hoverGlow={false}>
                  <p className="text-3xl font-black mb-1" style={{ color: LIME }}>{s.value}</p>
                  <p className="text-[11px] uppercase tracking-widest" style={{ color: "#606060" }}>{s.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: LIME }} />
        </div>
      </motion.div>
    </section>
  );
}

// ── FEATURED EXPERIENCES ──────────────────────────────────────────────────────
function Experiences() {
  return (
    <section id="experiences" className="py-28 px-4" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center mb-16">
          <SectionLabel text="Featured Experiences" />
          <motion.h2 variants={fadeUp}
            className="text-4xl sm:text-5xl font-black text-white">
            What We Do Together
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EXPERIENCES.map((exp) => (
            <motion.div key={exp.id} variants={fadeUp}>
              <GlassCard className="h-full flex flex-col cursor-pointer overflow-hidden relative">
                {/* Photo */}
                <div className="relative h-48 overflow-hidden rounded-t-3xl shrink-0">
                  <img src={exp.img} alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${exp.accentColor}20`, backdropFilter: "blur(8px)", border: `1px solid ${exp.accentColor}40` }}>
                    {exp.icon}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase block mb-2"
                      style={{ color: exp.accentColor }}>
                      {exp.tag}
                    </span>
                    <h3 className="text-xl font-black text-white mb-5">{exp.title}</h3>
                    <ul className="space-y-2.5">
                      {exp.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5 text-sm" style={{ color: "#A0A0A0" }}>
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: exp.accentColor }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: BORDER }}>
                    <button className="text-sm font-semibold transition-colors"
                      style={{ color: exp.accentColor }}>
                      Learn more →
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── UPCOMING EVENTS ───────────────────────────────────────────────────────────
function Events() {
  return (
    <section className="py-28 px-4" style={{ background: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mb-16">
          <SectionLabel text="Upcoming Events" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            Join This Week
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="space-y-4">
          {EVENTS.map((ev) => (
            <motion.div key={ev.id} variants={fadeUp}>
              <GlassCard className="p-5 sm:p-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${ev.color}15`, border: `1px solid ${ev.color}30` }}>
                    {ev.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white mb-1">{ev.title}</p>
                    <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: "#606060" }}>
                      <span>📅 {ev.date}</span>
                      <span>🕐 {ev.time}</span>
                      <span style={{ color: ev.seats <= 5 ? "#FF6B6B" : "#606060" }}>
                        {ev.seats <= 5 ? `🔥 ${ev.seats} seats left` : `${ev.seats} seats`}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="px-5 py-2.5 rounded-xl text-sm font-bold shrink-0 text-black"
                    style={{ background: ev.color }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}>
                    Join
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── COMMUNITY FEED ────────────────────────────────────────────────────────────
function Feed() {
  return (
    <section className="py-28 px-4" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mb-16">
          <SectionLabel text="Community Feed" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            What's Happening
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEED.map((post) => (
            <motion.div key={post.id} variants={fadeUp}>
              <GlassCard className="p-5 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={post.initials} color={post.color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">@{post.user}</p>
                    <p className="text-xs" style={{ color: "#606060" }}>{post.time} ago</p>
                  </div>
                  <span className="text-lg">{post.badge}</span>
                </div>

                <div className="flex-1 rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
                  <p className="text-sm text-white/80 leading-relaxed">{post.action}</p>
                </div>

                <div className="flex gap-5 pt-1">
                  <motion.button className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#606060" }}
                    whileHover={{ color: LIME }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {post.likes}
                  </motion.button>
                  <motion.button className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#606060" }}
                    whileHover={{ color: "#A0A0A0" }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
function Leaderboard() {
  return (
    <section className="py-28 px-4" style={{ background: "#080808" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mb-16">
          <SectionLabel text="Leaderboard" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            Top Performers
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="space-y-3">
          {LEADERBOARD.map((member, i) => (
            <motion.div key={member.rank} variants={fadeUp}>
              <GlassCard className="p-4 sm:p-5" glow={i === 0}>
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    {i === 0
                      ? <span className="text-xl">👑</span>
                      : <span className="text-sm font-bold" style={{ color: "#404040" }}>#{member.rank}</span>
                    }
                  </div>
                  <Avatar initials={member.initials} color={member.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${member.color}15`, color: member.color }}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "#606060" }}>🔥 {member.streak} streak</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black" style={{ color: LIME }}>{member.pts.toLocaleString()}</p>
                    <p className="text-[10px]" style={{ color: "#404040" }}>pts</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
function Gallery() {
  return (
    <section className="py-28 px-4" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mb-16">
          <SectionLabel text="Community Gallery" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            Moments We Share
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px]">
          {GALLERY.map((item) => (
            <motion.div key={item.id} variants={fadeUp}
              className={`relative rounded-3xl overflow-hidden cursor-pointer group ${item.tall ? "row-span-2" : ""}`}
              style={{ background: item.bg, border: `1px solid ${BORDER}` }}
              whileHover={{ borderColor: "rgba(141,255,0,0.40)", boxShadow: GLOW, scale: 1.01 }}
              transition={{ duration: 0.3 }}>
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
              {/* Label overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-bold text-white tracking-wider">{item.label}</span>
              </div>
              {/* Corner accent */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-60"
                style={{ background: LIME }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── MEMBERSHIP BENEFITS ───────────────────────────────────────────────────────
function Benefits() {
  return (
    <section className="py-28 px-4" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center mb-16">
          <SectionLabel text="Membership Benefits" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            Everything Included
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BENEFITS.map((b) => (
            <motion.div key={b.title} variants={fadeUp}>
              <GlassCard className="p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: "rgba(141,255,0,0.08)", border: "1px solid rgba(141,255,0,0.15)" }}>
                  {b.icon}
                </div>
                <p className="text-sm font-semibold text-white leading-tight">{b.title}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-28 px-4" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center mb-16">
          <SectionLabel text="Testimonials" />
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
            Heard from the Community
          </motion.h2>
        </motion.div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <GlassCard className="p-10 text-center" glow>
                <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-8">
                  "{TESTIMONIALS[active].text}"
                </p>
                <div className="flex flex-col items-center gap-3">
                  <Avatar initials={TESTIMONIALS[active].initials}
                    color={TESTIMONIALS[active].color} size="w-12 h-12" textSize="text-sm" />
                  <div>
                    <p className="font-bold text-white">{TESTIMONIALS[active].name}</p>
                    <p className="text-xs mb-2" style={{ color: "#606060" }}>{TESTIMONIALS[active].role}</p>
                    <Stars count={TESTIMONIALS[active].rating} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: active === i ? 24 : 8,
                height: 8,
                background: active === i ? LIME : "rgba(255,255,255,0.15)",
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-32 px-4" style={{ background: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <GlassCard className="p-12 sm:p-20 text-center relative overflow-hidden" hoverGlow={false}
            style={{ background: "rgba(141,255,0,0.04)", border: "1px solid rgba(141,255,0,0.15)" }}>

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(141,255,0,0.08) 0%, transparent 65%)" }} />

            <div className="relative">
              <motion.p variants={fadeUp}
                className="text-[11px] font-bold tracking-[0.4em] uppercase mb-6"
                style={{ color: LIME }}>
                Ready to Join?
              </motion.p>
              <motion.h2 variants={fadeUp}
                className="text-5xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Run Together.<br />
                <span style={{ color: LIME }}>Recover</span> Together.<br />
                Grow Together.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base mb-10" style={{ color: "#A0A0A0" }}>
                Your community is waiting. Join KINETIX and start your journey.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <motion.button
                    className="px-10 py-4 rounded-2xl font-black text-sm tracking-wide text-black"
                    style={{ background: LIME }}
                    whileHover={{ scale: 1.04, boxShadow: GLOW }}
                    whileTap={{ scale: 0.97 }}>
                    Become a Member
                  </motion.button>
                </Link>
                <motion.button
                  className="px-10 py-4 rounded-2xl font-semibold text-sm tracking-wide"
                  style={{ background: SURFACE, border: "1px solid rgba(141,255,0,0.25)", color: LIME }}
                  whileHover={{ background: "rgba(141,255,0,0.08)", scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  Book a Trial Session
                </motion.button>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  return (
    <div className="font-sora overflow-x-hidden" style={{ background: BG }}>
      <Navbar />
      <Hero />
      <Experiences />
      <Events />
      <Feed />
      <Leaderboard />
      <Gallery />
      <Benefits />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
