import Button from "./ui/Button";
import { useLanguage } from "../context/useLanguage";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section id="cta" className="py-10 lg:py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(195,255,81,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grid-dark bg-grid opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span className="text-neon text-xs font-semibold tracking-wider uppercase">
            {t("cta.badge")}
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          {t("cta.title1")}{" "}
          <span className="text-neon">{t("cta.title2")}</span>
        </h2>

        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          {t("cta.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" to="/catalog">
            {t("cta.browseCatalog")}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </div>

      </div>
    </section>
  );
}
