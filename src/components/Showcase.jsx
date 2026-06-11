import { useEffect, useState } from 'react'
import Button from './ui/Button'
import API from '../api/axios'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/useLanguage'

const CATEGORIES = ['All', 'Road', 'Trail', 'Daily trainer']

const BADGES = [
  { label: 'Best seller', color: 'neon' },
  { label: "Editor's pick", color: 'cyan' },
  { label: 'Top rated', color: 'orange' },
  { label: 'New arrival', color: 'purple' },
]

const BADGE_COLORS = {
  neon:   'bg-neon text-dark',
  cyan:   'bg-cyan text-dark',
  orange: 'bg-[#FF6B35] text-white',
  purple: 'bg-[#A855F7] text-white',
}

function ShoeCard({ product, badge, t }) {
  const { cart, addToCart, removeFromCart } = useCart()
  const [adding, setAdding] = useState(false)

  const defaultVariant = product?.variants?.[0]
  const defaultSize    = defaultVariant?.size?.[0]
  const image          = defaultVariant?.images?.[0] || null
  const price          = product?.rentalPlan?.[0]?.['1day'] || 0

  const isInCart = cart.some(
    (i) => i.item === product._id || i.item?._id === product._id
  )

  const handleAddToCart = async () => {
    if (!defaultVariant || !defaultSize) { alert(t('catalog.outOfStock')); return }
    setAdding(true)
    await addToCart({
      item: product._id,
      name: product.modelName,
      image: defaultVariant.images?.[0] || '',
      price,
      skuColorCode: defaultVariant.skuColorCode,
      size: defaultSize.size,
      quantity: 1,
    })
    setAdding(false)
  }

  const handleRemove = async () => {
    if (!defaultVariant || !defaultSize) return
    await removeFromCart({ item: product._id, skuColorCode: defaultVariant.skuColorCode, size: defaultSize.size })
  }

  return (
    <div className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-neon/20 flex flex-col">
      <div className="relative bg-dark-elevated h-48 flex items-center justify-center overflow-hidden">
        {badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 ${BADGE_COLORS[badge.color] ?? 'bg-white/20 text-white'}`}>
            {badge.label}
          </span>
        )}
        {image ? (
          <img src={image} alt={product.modelName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-neon/8 border border-neon/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-neon/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-white/20 text-xs">{t('catalog.noImage')}</p>
          </div>
        )}
        <span className="absolute bottom-3 right-3 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
          {product.category}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-white font-semibold text-sm leading-snug">{product.modelName}</h3>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
          <div>
            <span className="text-neon font-bold text-lg">฿{price}</span>
            <span className="text-white/35 text-xs ml-1">{t('showcase.perDay')}</span>
          </div>
          {isInCart ? (
            <button
              onClick={handleRemove}
              className="text-xs font-semibold text-red-400 border border-red-400/30 rounded-full px-3 py-1.5 hover:bg-red-400/10 transition-all duration-200"
            >
              {t('catalog.remove')}
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="text-xs font-semibold text-neon border border-neon/30 rounded-full px-3 py-1.5 hover:bg-neon hover:text-dark transition-all duration-200 disabled:opacity-50"
            >
              {adding ? t('catalog.adding') : t('catalog.addToCart')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Showcase() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [products, setProducts] = useState([])
  const { t } = useLanguage()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/api/products')
        if (res.data?.success) {
          setProducts(res.data.data || [])
        }
      } catch (err) {
        console.error('Failed to load products', err)
      }
    }
    fetchProducts()
  }, [])

  const filtered = (
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)
  )
    .slice()
    .sort((a, b) => (b.rentalPlan?.[0]?.['1day'] || 0) - (a.rentalPlan?.[0]?.['1day'] || 0))
    .slice(0, 4)

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
          {filtered.map((product, i) => (
            <ShoeCard key={product._id} product={product} badge={BADGES[i]} t={t} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" size="md" to="/catalog">{t("showcase.viewAll")}</Button>
        </div>
      </div>
    </section>
  )
}
