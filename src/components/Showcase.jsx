import { useState } from 'react'
import Button from './ui/Button'
import { useLanguage } from '../context/useLanguage'

const CATEGORIES = ['All', 'Road', 'Trail', 'Daily trainer']

const SHOES = [
  { id: 1,  name: 'Nike Vaporfly 3',            category: 'Road',         price: 490, badge: 'Best seller',  badgeColor: 'neon',   desc: 'Carbon-plate race day rocket. Best for marathon & tempo.',                  image: '/shoes/1.avif' },
  { id: 2,  name: 'Adidas Adizero Adios Pro 3', category: 'Road',         price: 450, badge: "Editor's pick", badgeColor: 'cyan',   desc: 'Energyrods technology. Lethal for long-distance speed.',                    image: '/shoes/2.avif' },
  { id: 3,  name: 'ASICS MetaSpeed Sky+',        category: 'Road',         price: 420, badge: 'Top rated',    badgeColor: 'orange', desc: 'Stride-type racer. Ideal for runners with longer stride.',                  image: '/shoes/3.webp' },
  { id: 13, name: 'Saucony Endorphin Pro 4',     category: 'Road',         price: 460, badge: null,           desc: 'PWRRUN HG foam with carbon plate. Built for race-day speed.',            hideFromAll: true, image: '/shoes/13.png' },
  { id: 4,  name: 'On Cloudmonster 3',           category: 'Daily trainer', price: 400, badge: 'New arrival',  badgeColor: 'purple', desc: 'Pillowy CloudTec sole. Maximum cushioning for everyday road runs.',           image: '/shoes/4.png' },
  { id: 5,  name: 'Hoka Speedgoat 6',            category: 'Trail',        price: 360, badge: null,           desc: 'Maximum grip, maximum protection. Kings of the trails.',                   image: '/shoes/5.webp' },
  { id: 7,  name: 'Salomon Sense Ride 5',        category: 'Trail',        price: 380, badge: 'Staff pick',   badgeColor: 'cyan',   desc: 'Versatile trail racer. Superior grip and response on any terrain.',          image: '/shoes/7.jpg' },
  { id: 8,  name: 'Saucony Peregrine 14',        category: 'Trail',        price: 340, badge: null,           desc: 'PWRTRAC outsole for aggressive grip. Built for technical trails.',            image: '/shoes/8.jpg' },
  { id: 9,  name: 'Nike Wildhorse 8',            category: 'Trail',        price: 320, badge: null,           desc: 'React foam cushioning with rugged trail protection.',                        image: '/shoes/9.webp' },
  { id: 10, name: 'Nike Pegasus 42',             category: 'Daily trainer', price: 290, badge: 'Best value',   badgeColor: 'neon',   desc: 'The do-everything trainer. ReactX foam for a smooth, bouncy ride.',          image: '/shoes/10.jpeg' },
  { id: 11, name: 'New Balance More v4',         category: 'Daily trainer', price: 370, badge: null,           desc: 'Maximum cushioning for high-mileage days. Soft and stable all day long.',  image: '/shoes/11.jpeg' },
  { id: 12, name: 'ASICS Gel-Nimbus 26',         category: 'Daily trainer', price: 390, badge: null,           desc: 'Maximum GEL cushioning. Gold standard for daily mileage comfort.',           image: '/shoes/12.jpeg' },
]

const BADGE_COLORS = {
  neon:   'bg-neon text-dark',
  cyan:   'bg-cyan text-dark',
  orange: 'bg-[#FF6B35] text-white',
  purple: 'bg-[#A855F7] text-white',
}

function ShoeCard({ shoe, t }) {
  return (
    <div className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-neon/20 flex flex-col">
      <div className="relative bg-dark-elevated h-48 flex items-center justify-center overflow-hidden">
        {shoe.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 ${BADGE_COLORS[shoe.badgeColor] ?? 'bg-white/20 text-white'}`}>
            {shoe.badge}
          </span>
        )}
        {shoe.image ? (
          <img src={shoe.image} alt={shoe.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-neon/8 border border-neon/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-neon/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-white/20 text-xs">
              <code className="text-neon/40">public/shoes/{shoe.id}.png</code>
            </p>
          </div>
        )}
        <span className="absolute bottom-3 right-3 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
          {shoe.category}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-white font-semibold text-sm leading-snug">{shoe.name}</h3>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">{shoe.desc}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
          <div>
            <span className="text-neon font-bold text-lg">฿{shoe.price}</span>
            <span className="text-white/35 text-xs ml-1">{t("showcase.perDay")}</span>
          </div>
          <button className="text-xs font-semibold text-neon border border-neon/30 rounded-full px-3 py-1.5 hover:bg-neon hover:text-dark transition-all duration-200">
            {t("showcase.reserve")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Showcase() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { t } = useLanguage()

  const filtered = (
    activeCategory === 'All'
      ? SHOES.filter((s) => !s.hideFromAll)
      : SHOES.filter((s) => s.category === activeCategory)
  ).sort((a, b) => b.price - a.price)

  return (
    <section id="showcase" className="py-10 lg:py-12 bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-neon text-xs font-semibold tracking-widest uppercase">{t("showcase.badge")}</span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-extrabold text-white">{t("showcase.title")}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${activeCategory === cat
                  ? 'bg-neon text-dark'
                  : 'bg-dark-elevated border border-dark-border text-white/50 hover:border-neon/30 hover:text-white'
                }`}
            >
              {t(`showcase.categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.slice(0, 4).map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} t={t} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" size="md" to="/catalog">{t("showcase.viewAll")}</Button>
        </div>
      </div>
    </section>
  )
}
