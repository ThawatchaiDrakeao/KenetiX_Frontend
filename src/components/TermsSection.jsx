import { useLanguage } from '../context/useLanguage';

export default function TermsSection() {
  const { t } = useLanguage();
  const items = t("terms.items");

  return (
    <section id="terms" className="py-16 lg:py-20 bg-dark-card/20 border-t border-dark-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">
            {t("terms.badge")}
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-white">
            {t("terms.title")}
          </h2>
          <p className="mt-2 text-white/35 text-sm">{t("terms.updated")}</p>
        </div>

        {/* Blocks */}
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-dark-elevated border border-dark-border rounded-xl px-6 py-5 hover:border-neon/20 transition-colors duration-200"
            >
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {item.body.split(' · ').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && (
                      <span className="block mt-1" />
                    )}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
