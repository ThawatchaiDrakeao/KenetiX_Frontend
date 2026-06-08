import { Link } from "react-router-dom";

export default function CatalogHero() {
  return (
    <div className="relative bg-[#080809] overflow-hidden pt-16" style={{ minHeight: 220 }}>
      <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-extrabold leading-none" style={{ fontSize: "28vw", color: "rgba(255,255,255,0.025)", letterSpacing: "-0.05em" }}>X</span>
      </div>

      <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(195,255,81,0.1) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="absolute right-0 top-0 bottom-0 w-[48%] hidden md:flex items-center justify-center pr-10">
        <div className="relative flex flex-col items-center">
          <div className="absolute w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(195,255,81,0.12) 0%, transparent 65%)" }} aria-hidden="true" />
          <div className="relative w-56 h-40 rounded-2xl border border-[#1e1e20] bg-[#0f0f10] flex flex-col items-center justify-center gap-2 z-10">
            <svg className="w-20 h-14 text-white/10" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M8 38 Q15 10 38 14 Q62 18 86 26 L90 36 Q60 44 24 42 Z" />
              <path d="M8 38 Q9 42 14 43" />
              <path d="M38 14 Q42 8 50 8 Q58 8 62 14" />
            </svg>
            <p className="text-white/15 text-[9px] text-center leading-relaxed px-4">
              Drop <code className="text-[#C3FF51]/30">hero-banner.jpg</code><br />
              into <code className="text-[#C3FF51]/30">public/catalog/</code>
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-1.5 text-[11px] text-white/35 mb-4">
          <Link to="/" className="hover:text-[#C3FF51] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/60">All Products</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-none mb-3">ALL PRODUCTS</h1>
        <p className="text-white/35 text-sm mb-4">Discover the best performance running shoes and gear.</p>
        <p className="text-white/55 text-sm font-semibold">1,248 products</p>
      </div>
    </div>
  );
}
