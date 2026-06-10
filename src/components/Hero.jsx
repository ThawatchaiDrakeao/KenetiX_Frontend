import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { useLanguage } from "../context/useLanguage";

const HERO_SHOES = [
  { name: "Adizero Adios Pro 4", price: "490", video: "/hero/1.webm" },
  { name: "Adidas Adizero Adios Pro 3", price: "450", video: "/hero/2.webm" },
  { name: "Adidas Adizero Zero SL", price: "350", video: "/hero/3.webm" },
  { name: "Nike Vomero Plus", price: "420", video: "/hero/4.mp4" },
  { name: "Nike Pegasus 42", price: "290", video: "/hero/5.mp4" },
];

const N = HERO_SHOES.length;
const CAROUSEL_INTERVAL = 3500;

export default function Hero() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const currentRef = useRef(0);

  const STATS = [
    { value: "120+", label: t("hero.stats.models") },
    { value: "4.9★", label: t("hero.stats.rating") },
    { value: "24h", label: t("hero.stats.delivery") },
    { value: "12k+", label: t("hero.stats.runners") },
  ];

  const advance = () => {
    const c = currentRef.current;
    const next = (c + 1) % N;
    setOutgoing(c);
    setCurrent(next);
    currentRef.current = next;
    setTimeout(() => setOutgoing(null), 520);
  };

  useEffect(() => {
    const timer = setInterval(advance, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const getStyle = (i) => {
    const isOut = i === outgoing;
    const dist = (i - current + N) % N;
    const zIndex = isOut ? N + 1 : N - dist;

    return {
      position: "absolute",
      inset: 0,
      zIndex,
      transform: isOut ? "translateX(-115%)" : "translateX(0)",
      transition: isOut ? "transform 500ms ease-in-out" : "none",
    };
  };

  const active = HERO_SHOES[current];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-dark bg-grid opacity-100 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(195,255,81,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-100 h-100 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Left — copy */}
          <div className="flex flex-col gap-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/20 rounded-full px-4 py-1.5 w-fit">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span className="text-neon text-xs font-semibold tracking-wider uppercase">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight">
              <span className="text-white">{t("hero.title1")}</span>{" "}
              <span className="text-white">{t("hero.title2")}</span>{" "}
              <span className="text-neon">{t("hero.title3")}</span>
              <br />
              <span className="text-white/40">{t("hero.title4")}</span>
            </h1>

            <p className="text-lg text-white/55 max-w-md leading-relaxed">
              {t("hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="primary" size="lg" to="/catalog">
                {t("hero.browseCatalog")}
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
              <Button variant="outline" size="lg" href="#features">
                {t("hero.howItWorks")}
              </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-dark-border">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold text-neon">
                    {s.value}
                  </span>
                  <span className="text-xs text-white/40 font-medium">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — deck carousel */}
          <div className="relative flex items-stretch justify-center lg:justify-end min-h-0">
            <div
              className="absolute w-80 h-80 lg:w-120 lg:h-120 rounded-full pointer-events-none top-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(195,255,81,0.12) 0%, transparent 65%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 w-full h-full">
              {/* Deck */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden">
                {HERO_SHOES.map((shoe, i) => (
                  <div
                    key={shoe.video}
                    style={getStyle(i)}
                    className="rounded-3xl overflow-hidden"
                  >
                    <video
                      src={shoe.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Neon corner accents */}
              <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon/40 rounded-tl-lg z-20 pointer-events-none" />
              <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon/40 rounded-tr-lg z-20 pointer-events-none" />
              <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon/40 rounded-bl-lg z-20 pointer-events-none" />
              <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon/40 rounded-br-lg z-20 pointer-events-none" />

              {/* Dot indicators */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {HERO_SHOES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setOutgoing(current);
                      setCurrent(i);
                      currentRef.current = i;
                      setTimeout(() => setOutgoing(null), 520);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-neon" : "w-1.5 bg-white/20"
                      }`}
                  />
                ))}
              </div>

              {/* Floating badge — price */}
              <div className="absolute -bottom-4 -left-6 bg-dark-elevated border border-dark-border rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-neon/15 flex items-center justify-center">
                  <span className="text-neon text-sm font-bold">฿</span>
                </div>
                <div>
                  <p className="text-xs text-white/40">{t("hero.startingFrom")}</p>
                  <p className="text-white font-bold text-sm">
                    {active.price} / day
                  </p>
                </div>
              </div>

              {/* Floating badge — model */}
              <div className="absolute -top-4 -right-6 bg-dark-elevated border border-neon/20 rounded-2xl px-4 py-3 shadow-xl z-20">
                <p className="text-neon text-xs font-semibold">{active.name}</p>
                <p className="text-white/40 text-xs">{t("hero.availableNow")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
