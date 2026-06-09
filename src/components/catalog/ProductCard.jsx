import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/useLanguage";

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();
  const { t } = useLanguage();

  const defaultVariant = product?.variants?.[0];
  const defaultSize    = defaultVariant?.size?.[0];
  const image          = defaultVariant?.images?.[0] || null;
  const rentalPrice    = product?.rentalPlan?.[0]?.["1day"] || 0;

  const isInCart = cart.some(
    (i) => i.item === product._id || i.item?._id === product._id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!defaultVariant || !defaultSize) { alert(t("catalog.outOfStock")); return; }
    setAdding(true);
    await addToCart({
      item: product._id,
      name: product.modelName,
      image: defaultVariant.images?.[0] || "",
      price: rentalPrice,
      skuColorCode: defaultVariant.skuColorCode,
      size: defaultSize.size,
      quantity: 1,
    });
    setAdding(false);
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (!defaultVariant || !defaultSize) return;
    await removeFromCart({ item: product._id, skuColorCode: defaultVariant.skuColorCode, size: defaultSize.size });
  };

  return (
    <div className="group bg-dark-card border border-dark-border rounded-lg overflow-hidden transition-all duration-300 hover:border-neon/20 flex flex-col">

      {/* Image */}
      <div className="relative bg-dark-elevated h-48 flex items-center justify-center overflow-hidden">
        <button
          onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
          className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform"
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors ${wished ? "text-red-500" : "text-white/40"}`}
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {image ? (
          <img src={image} alt={product.modelName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-neon/8 border border-neon/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-neon/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-white/20 text-xs">{t("catalog.noImage")}</p>
          </div>
        )}
        <span className="absolute bottom-3 right-3 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-white font-semibold text-sm leading-snug">{product.modelName}</h3>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">{product.brand || ""}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
          <div>
            <span className="text-neon font-bold text-lg">฿{rentalPrice.toLocaleString()}</span>
            <span className="text-white/35 text-xs ml-1">{t("catalog.perDay")}</span>
          </div>

          {isInCart ? (
            <button
              onClick={handleRemove}
              className="text-xs font-semibold text-red-400 border border-red-400/30 rounded-full px-3 py-1.5 hover:bg-red-400/10 transition-all duration-200"
            >
              {t("catalog.remove")}
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="text-xs font-semibold text-neon border border-neon/30 rounded-full px-3 py-1.5 hover:bg-neon hover:text-dark transition-all duration-200 disabled:opacity-50"
            >
              {adding ? t("catalog.adding") : t("catalog.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
