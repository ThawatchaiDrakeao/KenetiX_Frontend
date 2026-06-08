import { useState } from 'react'
import { useLanguage } from '../context/useLanguage'

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-dark-border transition-colors duration-200 hover:border-neon/20 first:border-t">
      <button
        onClick={onToggle}
        onMouseEnter={() => { if (!isOpen) onToggle() }}
        className="w-full flex items-center justify-between gap-4 px-6 py-1.5 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold leading-relaxed transition-colors duration-200 ${isOpen ? 'text-neon' : 'text-white'}`}>
          {faq.q}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen
              ? 'border-neon bg-neon/10 rotate-45 text-neon'
              : 'border-dark-border text-white/40'
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60' : 'max-h-0'
          }`}
      >
        <p className="px-6 pb-5 text-sm text-white/50 leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = t("faq.items");

  return (
    <section id="faq" className="pt-10 pb-6 lg:pt-12 lg:pb-8 bg-dark-card/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">
            {t("faq.badge")}
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-white">
            {t("faq.title")}
          </h2>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-white/35 text-sm">
          {t("faq.stillQuestions")}{' '}
          <a href="mailto:hello@kinetix.run" className="text-neon hover:underline underline-offset-2 transition-colors">
            hello@kinetix.run
          </a>
        </p>
      </div>
    </section>
  )
}
