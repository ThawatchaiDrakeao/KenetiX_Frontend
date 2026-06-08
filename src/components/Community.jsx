import { useLanguage } from "../context/useLanguage";

const MEMBERS = [
  { handle: '@cookieyda',      img: '/community/cookie.png' },
  { handle: '@annethong',      img: '/community/anne.png'   },
  { handle: '@jirayu_jj',      img: '/community/jirayu.png' },
  { handle: '@toey_pongsakon', img: '/community/toey.png'   },
]

export default function Community() {
  const { t } = useLanguage();

  return (
    <section id="community" className="py-10 lg:py-12 bg-dark-card/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">{t("community.badge")}</span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-extrabold text-white">
            {t("community.title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MEMBERS.map(({ handle, img }) => (
            <div
              key={handle}
              className="group relative rounded-lg bg-dark-elevated border border-dark-border aspect-[3/4] overflow-hidden flex items-end p-3 cursor-pointer hover:border-neon/20 transition-all duration-300"
            >
              <img
                src={img}
                alt={handle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="relative text-white/90 text-xs font-medium drop-shadow">{handle}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-2xl font-light leading-none">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
