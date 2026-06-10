import { useLanguage } from "../context/useLanguage";

export default function OurStory() {
  const { t } = useLanguage();

  return (
    <section id="story" className="py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — label + heading */}
          <div>
            <span className="text-neon text-xs font-semibold tracking-widest uppercase">
              {t("ourStory.badge")}
            </span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {t("ourStory.title1")}
              <br />
              <span className="text-white">KINETI<span className="text-[#C3FF51]">X</span></span>
            </h2>
          </div>

          {/* Right — story text */}
          <div className="flex flex-col gap-6">
            <p className="text-white/70 text-lg leading-relaxed">
              {t("ourStory.body")}
            </p>
            <div className="border-l-2 border-neon pl-5">
              <p className="text-white font-semibold text-2xl leading-relaxed">
                "{t("ourStory.quote")}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
