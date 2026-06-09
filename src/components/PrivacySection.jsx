import { useLanguage } from '../context/useLanguage';

export default function PrivacySection() {
  const { t } = useLanguage();
  const items = t("privacy.items");

  return (
    <section id="privacy" className="py-16 lg:py-20 bg-dark border-t border-dark-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">
            {t("privacy.badge")}
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-white">
            {t("privacy.title")}
          </h2>
          <p className="mt-2 text-white/35 text-sm">{t("privacy.updated")}</p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-dark-elevated border border-dark-border rounded-xl px-6 py-5 hover:border-neon/20 transition-colors duration-200"
            >
              <h3 className="text-sm font-bold text-white mb-3">{item.title}</h3>
              <ul className="flex flex-col gap-1.5">
                {item.lines.map((line, j) => (
                  <li key={j} className="flex gap-2 text-sm text-white/50 leading-relaxed">
                    <span className="text-neon mt-0.5 flex-shrink-0">–</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
