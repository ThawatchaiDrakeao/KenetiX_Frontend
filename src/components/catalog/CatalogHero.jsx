import { useLanguage } from "../../context/useLanguage";

export default function CatalogHero() {
  const { t } = useLanguage();

  return (
    <div className="relative bg-[#080809] overflow-hidden pt-16" style={{ minHeight: 220 }}>
      <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-extrabold leading-none" style={{ fontSize: "28vw", color: "rgba(255,255,255,0.025)", letterSpacing: "-0.05em" }}>X</span>
      </div>

      <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(195,255,81,0.1) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-none mb-3">{t("catalog.hero.title")}</h1>
        <p className="text-white/35 text-sm mb-4">{t("catalog.hero.desc")}</p>
        <p className="text-white/55 text-sm font-semibold">{t("catalog.hero.count")}</p>
      </div>
    </div>
  );
}
