import { useLanguage } from "../context/useLanguage";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"

const REVIEWS = [
  {
    name: 'Nattawut P.',
    handle: '@nattawut_runs',
    rating: 5,
    shoe: 'Nike Vaporfly 3',
    text: 'ลองครั้งแรกก็รู้เลยว่าใช่ ไม่ต้องเดาว่าซื้อแล้วจะชอบไหม',
  },
  {
    name: 'Praewa S.',
    handle: '@praewa.runner',
    rating: 5,
    shoe: 'Adidas Adizero Adios Pro 3',
    text: 'ลองแล้วไม่ถูกใจก็เปลี่ยนตัวอื่นได้เลย บริการดีมาก คืนง่าย',
  },
  {
    name: 'Krittin L.',
    handle: '@krittin.bkk',
    rating: 5,
    shoe: 'Hoka Speedgoat 6',
    text: 'Speedgoat 6 ฟิตเท้าผมมาก ตัดสินใจซื้อได้เลยหลังลอง 48 ชม.',
  },
  {
    name: 'Thanya W.',
    handle: '@thanya_pace',
    rating: 4,
    shoe: 'ASICS MetaSpeed Sky+',
    text: 'รู้เลยหลังวิ่งครั้งแรกว่า MetaSpeed เหมาะกับ stride ตัวเอง',
  },
]

export default function Reviews() {
  const { t } = useLanguage();

  return (
    <section id="reviews" className="py-10 lg:py-12 bg-dark-card/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-neon text-xs font-semibold tracking-widest uppercase">
              {t("reviews.badge")}
            </span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-extrabold text-white">
              {t("reviews.title")}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-4xl font-extrabold text-white">4.9</span>
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-neon" fill="currentColor" viewBox="0 0 20 20">
                    <path d={STAR_PATH} />
                  </svg>
                ))}
              </div>
              <span className="text-white/35 text-xs">{t("reviews.count")}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r, i) => (
            <div
              key={r.handle}
              className="group relative rounded-lg bg-dark-elevated border border-dark-border overflow-hidden flex flex-col p-5 gap-4 hover:border-neon/20 transition-all duration-300"
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${20 + i * 20}% 80%, rgba(195,255,81,0.4), transparent 55%)`,
                }}
              />

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-neon' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d={STAR_PATH} />
                  </svg>
                ))}
              </div>

              {/* Quote — always visible */}
              <p className="relative text-white/70 text-sm leading-relaxed flex-1">
                "{r.text}"
              </p>

              {/* Footer */}
              <div className="relative flex items-center gap-2.5 pt-3 border-t border-dark-border">
                <div className="w-8 h-8 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                  <span className="text-neon text-[10px] font-bold">
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">{r.name}</p>
                  <p className="text-white/35 text-[10px]">{r.shoe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
