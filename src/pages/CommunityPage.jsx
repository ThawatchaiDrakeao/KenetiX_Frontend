import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommunityGallery from "../components/community/CommunityGallery";
import ScrollArrow from "../components/ScrollArrow";
import { useLanguage } from "../context/useLanguage";

// ── THEME ─────────────────────────────────────────────────────────────────────
const LIME    = "#C3FF51";
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

// Experience image map (kept in component since these are static assets, not translatable)
const EXP_IMGS = {
  run:    "/community/run-club.png",
  ice:    "/community/ice-bath.png",
  coffee: "/community/coffee-social.png",
};

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
function Hero({ t }) {
  const stats = t("community.page.stats");

  return (
    <section id="community-hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden"
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
            {t("community.page.heroBadge")}
          </motion.span>

          <motion.h1 variants={fadeUp}
            className="text-5xl font-black text-white leading-[0.95] tracking-tight mb-8 lg:text-6xl">
            {t("community.page.heroLine1")}<br />
            <span style={{ color: LIME }}>{t("community.page.heroLine2")}</span><br />
            {t("community.page.heroLine3")}
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg max-w-lg mx-auto leading-relaxed mb-6"
            style={{ color: "#A0A0A0" }}>
            {t("community.page.heroDesc")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/signup">
              <motion.button
                className="px-8 py-4 rounded-lg font-bold text-sm tracking-wide text-black"
                style={{ background: LIME }}
                whileHover={{ scale: 1.04, boxShadow: GLOW }}
                whileTap={{ scale: 0.97 }}>
                {t("community.page.joinCta")}
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-4 rounded-lg font-semibold text-sm tracking-wide"
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#fff" }}
              whileHover={{ borderColor: "rgba(141,255,0,0.30)", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("experiences")?.scrollIntoView({ behavior: "smooth" })}>
              {t("community.page.exploreActivities")}
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {Array.isArray(stats) && stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <GlassCard className="p-5 text-center" hoverGlow={false}>
                  <p className="text-2xl font-black mb-1" style={{ color: LIME }}>{s.value}</p>
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
function Experiences({ t }) {
  const experiencesData = t("community.page.experiences");
  const experiences = Array.isArray(experiencesData)
    ? experiencesData.map((exp) => ({ ...exp, accentColor: LIME, img: EXP_IMGS[exp.id] }))
    : [];

  return (
    <section id="experiences" className="py-10 px-4" style={{ background: BG }}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center mb-6">
          <SectionLabel text={t("community.page.experiencesBadge")} />
          <motion.h2 variants={fadeUp}
            className="text-3xl sm:text-4xl font-black text-white">
            {t("community.page.whatWeDo")}
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {experiences.map((exp) => (
            <motion.div key={exp.id} variants={fadeUp}>
              <GlassCard className="h-full flex flex-col cursor-pointer overflow-hidden relative">
                {/* Photo */}
                <div className="relative h-48 overflow-hidden rounded-t-3xl shrink-0">
                  <img src={exp.img} alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase block mb-2"
                      style={{ color: exp.accentColor }}>
                      {exp.tag}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-5">{exp.title}</h3>
                    <ul className="space-y-2.5">
                      {Array.isArray(exp.points) && exp.points.map((pt) => (
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
                      {t("community.page.comingSoon")}
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
function Events({ t }) {
  const eventsData = t("community.page.events");
  const events = Array.isArray(eventsData)
    ? eventsData.map((ev) => ({ ...ev, color: LIME }))
    : [];

  return (
    <section id="community-events" className="py-10 px-4" style={{ background: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <div className="mb-6">
            <SectionLabel text={t("community.page.eventsBadge")} />
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white">
              {t("community.page.joinThisWeek")}
            </motion.h2>
          </div>

          <div className="space-y-4">
            {events.map((ev) => (
              <motion.div key={ev.id} variants={fadeUp}>
                <div className="flex items-center gap-5 rounded-lg border border-[#1e1e20] bg-[#0f0f10] px-5 py-4 sm:px-6">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white mb-1">{ev.title}</p>
                    <div className="flex flex-wrap gap-3 text-[12px] text-white/35">
                      <span>{ev.date}</span>
                      <span>{ev.time}</span>
                      <span style={{ color: ev.seats <= 5 ? "#FF6B6B" : undefined }}>
                        {ev.seats <= 5
                          ? `${ev.seats} ${t("community.page.seatsLeft")}`
                          : `${ev.seats} ${t("community.page.seats")}`}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="px-5 py-2 rounded-lg text-sm font-bold shrink-0"
                    style={{ background: "transparent", border: "1px solid #C3FF51", color: "#C3FF51" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}>
                    {t("community.page.join")}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function Testimonials({ t }) {
  const testimonialsData = t("community.page.testimonials");
  const testimonials = Array.isArray(testimonialsData)
    ? testimonialsData.map((item) => ({ ...item, color: LIME, rating: 5 }))
    : [];

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <section id="community-testimonials" className="py-10 px-4" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center mb-6">
          <SectionLabel text={t("community.page.testimonialsBadge")} />
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-black text-white">
            {t("community.page.heardFromCommunity")}
          </motion.h2>
        </motion.div>

        <div className="relative min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <GlassCard className="p-6 sm:p-8 text-center" hoverGlow={false}>
                <p className="text-base lg:text-lg font-medium text-white/85 leading-relaxed mb-5">
                  "{testimonials[active].text}"
                </p>
                <div className="flex flex-col items-center gap-3">
                  <Avatar initials={testimonials[active].initials}
                    color={testimonials[active].color} size="w-12 h-12" textSize="text-sm" />
                  <div>
                    <p className="font-bold text-white">{testimonials[active].name}</p>
                    <p className="text-xs mb-2" style={{ color: "#606060" }}>{testimonials[active].role}</p>
                    <Stars count={testimonials[active].rating} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
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
function FinalCTA({ t }) {
  return (
    <section id="community-cta" className="py-10 px-4" style={{ background: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <GlassCard className="p-8 sm:p-12 text-center relative overflow-hidden" hoverGlow={false}
            style={{ background: "rgba(141,255,0,0.04)", border: "1px solid rgba(141,255,0,0.15)" }}>

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(141,255,0,0.08) 0%, transparent 65%)" }} />

            <div className="relative">
              <motion.p variants={fadeUp}
                className="text-[11px] font-bold tracking-[0.4em] uppercase mb-4"
                style={{ color: LIME }}>
                {t("community.page.readyBadge")}
              </motion.p>
              <motion.h2 variants={fadeUp}
                className="text-3xl font-black text-white leading-[1.05] tracking-tight mb-4 lg:text-4xl">
                {t("community.page.ctaLine1")}<br />
                <span style={{ color: LIME }}>{t("community.page.ctaLine2")}</span><br />
                {t("community.page.ctaLine3")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm mb-5" style={{ color: "#A0A0A0" }}>
                {t("community.page.ctaDesc")}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <motion.button
                    className="px-8 py-3 rounded-lg font-black text-sm tracking-wide text-black"
                    style={{ background: LIME }}
                    whileHover={{ scale: 1.04, boxShadow: GLOW }}
                    whileTap={{ scale: 0.97 }}>
                    {t("community.page.becomeMember")}
                  </motion.button>
                </Link>
                <a href="https://wa.me/66000000000" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wide"
                    style={{ background: SURFACE, border: "1px solid rgba(141,255,0,0.25)", color: LIME }}
                    whileHover={{ background: "rgba(141,255,0,0.08)", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}>
                    {t("community.page.bookActivities")}
                  </motion.button>
                </a>
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
  const { t } = useLanguage();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="font-sora overflow-x-hidden" style={{ background: BG }}>
      <Navbar />
      <Hero t={t} />
      <Experiences t={t} />
      <Events t={t} />
      <div id="community-gallery"><CommunityGallery /></div>
      <Testimonials t={t} />
      <FinalCTA t={t} />
      <Footer />
      <ScrollArrow sections={["community-hero", "experiences", "community-events", "community-gallery", "community-testimonials", "community-cta"]} />
    </div>
  );
}
