import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NEON = "#D6FF3F";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// ── LOCAL STORAGE FALLBACK ────────────────────────────────────────────────────
const LS_KEY = "kinetix_moments";

function localGet() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function localSave(moments) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(moments)); }
  catch { /* storage full */ }
}

// ── API (with localStorage fallback) ─────────────────────────────────────────
async function getMoments() {
  try {
    const res = await fetch("/api/moments");
    if (res.ok) return await res.json();
  } catch { /* no backend yet */ }
  return localGet();
}

async function uploadImage(file) {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: form });
    if (res.ok) return await res.json();
  } catch { /* no backend yet */ }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve({ url: e.target.result });
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function createMoment({ imageUrl, caption }) {
  try {
    const res = await fetch("/api/moments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption }),
    });
    if (res.ok) return await res.json();
  } catch { /* no backend yet */ }
  const existing = localGet();
  const moment = {
    id: Date.now(),
    imageUrl,
    caption,
    user: { name: "You", avatar: null },
    createdAt: new Date().toISOString(),
  };
  localSave([moment, ...existing]);
  return moment;
}

// ── MOMENT CARD (used in full gallery modal) ──────────────────────────────────
function MomentCard({ moment }) {
  const date = new Date(moment.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] cursor-pointer"
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(214,255,63,0.25)",
        boxShadow: "0 0 28px rgba(214,255,63,0.10)",
      }}
      transition={{ duration: 0.22 }}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={moment.imageUrl}
          alt={moment.caption || "Community moment"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        {moment.caption && (
          <p className="text-sm text-white/75 leading-relaxed mb-3 line-clamp-2">{moment.caption}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {moment.user?.avatar ? (
              <img src={moment.user.avatar} alt={moment.user.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-black shrink-0"
                style={{ background: NEON }}>
                {moment.user?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-xs font-semibold text-white/50 truncate">
              {moment.user?.name ?? "Community Member"}
            </span>
          </div>
          <span className="text-[11px] text-white/20 shrink-0">{date}</span>
        </div>
      </div>
    </motion.article>
  );
}

// ── PHOTO MARQUEE ─────────────────────────────────────────────────────────────
function PhotoMarquee({ moments, onViewAll }) {
  const items = [...moments, ...moments];

  return (
    <div className="overflow-hidden">
      <div className="flex gap-3 animate-marquee w-max hover:[animation-play-state:paused]">
        {items.map((m, i) => (
          <div
            key={`${m.id}-${i}`}
            onClick={onViewAll}
            className="relative flex-shrink-0 w-[220px] h-[220px] rounded-lg overflow-hidden bg-white/[0.04] cursor-pointer group"
          >
            <img
              src={m.imageUrl}
              alt={m.caption || ""}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay: caption + username */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-3 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              {m.caption && (
                <p className="text-white text-xs font-medium leading-snug line-clamp-2 mb-1.5">{m.caption}</p>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-black shrink-0"
                  style={{ background: NEON }}>
                  {m.user?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="text-white/60 text-[11px] truncate">{m.user?.name ?? "Community Member"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
function EmptyState({ onShare }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5">
        <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5V19.5A1.5 1.5 0 0 0 3.75 21Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-white/40 mb-1">No moments shared yet.</p>
      <p className="text-xs text-white/20 mb-7">Be the first to share your experience.</p>
      <button
        onClick={onShare}
        className="px-6 py-2.5 rounded-lg text-sm font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-transform"
        style={{ background: NEON }}
      >
        Share First Moment
      </button>
    </motion.div>
  );
}

// ── SHARE MODAL ───────────────────────────────────────────────────────────────
function ShareModal({ onClose, onPosted }) {
  const MAX_CAPTION = 150;
  const inputRef    = useRef(null);

  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [caption,  setCaption]  = useState("");
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState("");
  const [status,   setStatus]   = useState("idle");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    setFile(f);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please upload a photo."); return; }
    try {
      setStatus("uploading");
      const { url } = await uploadImage(file);
      setStatus("posting");
      const moment = await createMoment({ imageUrl: url, caption });
      onPosted(moment);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const busy = status === "uploading" || status === "posting";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e0f] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Share a Moment</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {preview ? (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all duration-200"
              style={{
                borderColor: dragging ? NEON : "rgba(255,255,255,0.12)",
                background:  dragging ? "rgba(214,255,63,0.04)" : "rgba(255,255,255,0.02)",
              }}
            >
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <div className="text-center">
                <p className="text-sm text-white/50">
                  <span className="font-semibold" style={{ color: NEON }}>Click to upload</span>{" "}or drag and drop
                </p>
                <p className="text-xs text-white/20 mt-1">PNG, JPG, WEBP</p>
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          )}

          <div className="relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
              placeholder="Sunday recovery session after our morning run..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 pr-14 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none transition-colors"
              onFocus={(e) => { e.target.style.borderColor = "rgba(214,255,63,0.30)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; }}
            />
            <span className="absolute bottom-3 right-3 text-[11px] pointer-events-none"
              style={{ color: caption.length >= MAX_CAPTION ? "#f87171" : "rgba(255,255,255,0.20)" }}>
              {caption.length}/{MAX_CAPTION}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-red-400 text-xs -mt-1">{error}</motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={busy}
              className="flex-1 py-3 rounded-lg border border-white/10 text-sm font-semibold text-white/50 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40">
              Cancel
            </button>
            <button type="submit" disabled={busy}
              className="flex-1 py-3 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: NEON }}>
              {status === "uploading" ? "Uploading…" : status === "posting" ? "Posting…" : "Post Moment"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── FULL GALLERY MODAL ────────────────────────────────────────────────────────
function GalleryModal({ moments, onClose, onPosted }) {
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape" && !shareOpen) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, shareOpen]);

  const handlePosted = (newMoment) => {
    onPosted(newMoment);
    setShareOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: "rgba(5,5,5,0.97)", backdropFilter: "blur(8px)" }}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 border-b border-white/[0.06] px-4 py-4 sm:px-6"
          style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(16px)" }}>
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 mb-0.5">Community Gallery</p>
              <h2 className="text-lg font-black text-white leading-tight">Moments We Share
                <span className="ml-2 text-sm font-normal text-white/25">({moments.length})</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                style={{ background: NEON }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Share a Moment
              </button>
              <button onClick={onClose}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* All photos */}
        <div className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6">
          {moments.length === 0 ? (
            <EmptyState onShare={() => setShareOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {moments.map((m) => <MomentCard key={m.id} moment={m} />)}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {shareOpen && (
          <ShareModal onClose={() => setShareOpen(false)} onPosted={handlePosted} />
        )}
      </AnimatePresence>
    </>
  );
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function PreviewSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-white/[0.04] animate-pulse" />
      ))}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function CommunityGallery() {
  const [moments,    setMoments]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [shareOpen,  setShareOpen]  = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    getMoments()
      .then(setMoments)
      .catch(() => setFetchError("Could not load moments. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const handlePosted = (newMoment) => {
    setMoments((prev) => [newMoment, ...prev]);
  };

  return (
    <>
      <section className="py-16 px-4 sm:px-6" style={{ background: "#080808" }}>
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div>
              <motion.span variants={fadeUp}
                className="inline-block text-[11px] font-bold tracking-[0.35em] uppercase mb-3"
                style={{ color: NEON }}>
                Community Gallery
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white">
                Moments We Share
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-sm text-white/35 leading-relaxed">
                Capture and share your favorite community moments.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="flex items-center gap-3 shrink-0">
              {moments.length > 0 && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  View All
                </button>
              )}
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: NEON }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Share a Moment
              </button>
            </motion.div>
          </motion.div>

          {/* Content */}
          {loading      ? <PreviewSkeleton />
          : fetchError  ? <p className="text-white/25 text-sm py-12 text-center">{fetchError}</p>
          : moments.length === 0 ? <EmptyState onShare={() => setShareOpen(true)} />
          : <PhotoMarquee moments={moments} onViewAll={() => setGalleryOpen(true)} />
          }
        </div>
      </section>

      <AnimatePresence>
        {galleryOpen && (
          <GalleryModal
            moments={moments}
            onClose={() => setGalleryOpen(false)}
            onPosted={handlePosted}
          />
        )}
        {shareOpen && !galleryOpen && (
          <ShareModal
            onClose={() => setShareOpen(false)}
            onPosted={(m) => { handlePosted(m); setShareOpen(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
