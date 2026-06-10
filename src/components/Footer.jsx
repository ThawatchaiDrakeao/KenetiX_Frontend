import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
    timerRef.current = setTimeout(() => setSubmitted(false), 3000);
  };

  const FOOTER_LINKS = {
    [t("footer.sections.rental")]: [
      { label: t("footer.links.catalog"),    href: "/catalog" },
      { label: t("footer.links.howItWorks"), href: "#features" },
      { label: t("footer.links.reviews"),    href: "#reviews" },
    ],
    [t("footer.sections.brand")]: [
      { label: t("footer.links.ourStory"),  href: "/#story" },
      { label: t("footer.links.partners"),  href: "/catalog#partners" },
    ],
    [t("footer.sections.legal")]: [
      { label: t("footer.links.terms"),        href: "/terms" },
      { label: t("footer.links.privacy"),      href: "/privacy" },
      { label: t("footer.links.damagePolicy"), href: "/damage" },
    ],
  };

  return (
    <footer className="bg-[#0e0e0f] border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 lg:pt-10 lg:pb-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a
              href="/"
              className="text-white font-bold text-[24px] tracking-widest"
            >
              KINETI<span className="text-[#C3FF51]">X</span>
            </a>
            <p className="text-white/35 text-sm leading-relaxed">
              {t("footer.tagline1")}
              <br />
              {t("footer.tagline2")}
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-white/30 hover:border-neon/40 hover:text-neon transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-white/30 hover:border-neon/40 hover:text-neon transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#x"
                aria-label="X"
                className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-white/30 hover:border-neon/40 hover:text-neon transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-3 grid grid-cols-3 gap-10">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className="flex flex-col gap-4">
                <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">
                  {heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/55 text-sm hover:text-neon transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">{t("footer.newsletter.label")}</p>
            <p className="text-white/35 text-xs leading-relaxed">{t("footer.newsletter.desc")}</p>
            <form onSubmit={handleSubscribe} className="flex mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletter.placeholder")}
                className="flex-1 bg-dark-elevated border border-dark-border border-r-0 rounded-l-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-neon/30 transition-colors"
              />
              <button type="submit" className="bg-neon text-dark px-3 py-2 rounded-r-lg hover:bg-neon-hover transition-colors flex items-center justify-center">
                {submitted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </button>
            </form>
            {submitted && <p className="text-neon text-[11px] mt-1">Subscribed!</p>}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} KINETIX. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
