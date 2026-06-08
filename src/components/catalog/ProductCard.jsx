import { useState } from "react";
import { useCart } from "../../context/CartContext"; // Fixed import

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const [, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // ✅ Use useCart() hook, not CartProvider()
  const { cart, addToCart, removeFromCart } = useCart();

  const defaultVariant = product?.variants?.[0];
  const defaultSize = defaultVariant?.size?.[0];
  const image = defaultVariant?.images?.[0] || "/placeholder-shoe.png";
  const rentalPrice = product?.rentalPlan?.[0]?.["1day"] || 0;

  // Check if product is in cart
  const cartItemsForThisProduct = cart.filter(
    (cartItem) => cartItem.item === product._id || cartItem.item?._id === product._id
  );
  const quantityInCart = cartItemsForThisProduct.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isInCart = quantityInCart > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!defaultVariant || !defaultSize) {
      alert("Product out of stock");
      return;
    }
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

  const handleRemoveFromCart = async (e) => {
    e.stopPropagation();
    if (!defaultVariant || !defaultSize) return;

    await removeFromCart({
      item: product._id,
      skuColorCode: defaultVariant.skuColorCode,
      size: defaultSize.size
    });
  };

  return (
    <div
      className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden group hover:border-[#C3FF51]/20 transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      {/* Image Section */}
      <div className="relative bg-[#141415] overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className={`w-3 h-3 ${wished ? "text-red-400" : "text-white/40"}`}
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {image && image !== "/placeholder-shoe.png" ? (
          <img src={image} alt={product.modelName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">No Image</div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-white/35 text-[9px] font-bold tracking-widest uppercase">
            {product.category}
          </p>
          <p className="text-white text-sm font-semibold leading-snug mt-1">
            {product.modelName}
          </p>
        </div>

        <div className="text-zinc-400 text-xs">Rental from</div>

        <div className="flex items-center justify-between">
          <span className="text-white font-bold">฿{rentalPrice.toLocaleString()}</span>
          <span className="text-zinc-500 text-xs">/day</span>
        </div>

        {/* Dynamic Cart Button */}
        {isInCart ? (
          <div className="w-full mt-auto flex items-center justify-between bg-[#1e1e20] rounded-md overflow-hidden">
            <button
              onClick={handleRemoveFromCart}
              className="w-10 py-2 text-white/60 hover:text-white hover:bg-white/10 font-bold"
            >
              −
            </button>
            <span className="text-[#C3FF51] text-xs font-bold">
              {quantityInCart} in Cart
            </span>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-10 py-2 text-white/60 hover:text-white hover:bg-white/10 font-bold"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full mt-auto bg-[#C3FF51] text-[#080809] text-[10px] font-bold py-2 rounded-md hover:bg-[#d3ff70] active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

{/*import { useState } from "react";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden group hover:border-[#C3FF51]/20 transition-all duration-300 flex flex-col">
      <div className="relative bg-[#141415] flex items-center justify-center overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Wishlist"
        >
          <svg className={`w-3 h-3 ${wished ? "text-red-400" : "text-white/40"}`} fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#C3FF51]/8 border border-[#C3FF51]/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C3FF51]/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.18L6 21l4.5-2.25c.495.075 1.005.115 1.5.115 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
            </svg>
          </div>
          <p className="text-[#C3FF51]/30 text-[10px]">Coming soon</p>
        </div>
        <div className="absolute inset-0 bg-[#C3FF51]/0 group-hover:bg-[#C3FF51]/[0.03] transition-colors duration-300" />
      </div>

      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <div>
          <p className="text-white/35 text-[9px] font-bold tracking-widest uppercase">{product.brand}</p>
          <p className="text-white text-[11px] font-semibold leading-snug mt-0.5 line-clamp-2">{product.name}</p>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-white font-bold text-xs">฿{product.price.toLocaleString()}</span>
          <div className="flex items-center gap-0.5">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-white/50 text-[10px]">{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <button className="w-full mt-auto bg-[#C3FF51] text-[#080809] text-[10px] font-bold py-1.5 rounded-md hover:bg-[#d3ff70] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1 tracking-wide">
          + ADD TO CART
        </button>
      </div>
    </div>
  );
}
*/}

/*
import { useState } from "react";


export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);

  const image =
    product?.variants?.[0]?.images ||
    "/placeholder-shoe.png";

  const rentalPrice =
    product?.rentalPlan?.[0]?.["1day"] || 0;

  const totalStock =
    product?.variants?.reduce((sum, variant) => {
      return (
        sum +
        (variant?.size?.reduce(
          (s, size) => s + (size.stock || 0),
          0
        ) || 0)
      );
    }, 0) || 0;

  return (
    <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden group hover:border-[#C3FF51]/20 transition-all duration-300 flex flex-col">

      /* Image 
      <div
        className="relative bg-[#141415] overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className={`w-3 h-3 ${wished ? "text-red-400" : "text-white/40"
              }`}
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {image ? (
          <img
            src={image}
            alt={product.modleName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            No Image
          </div>
        )}
      </div>

      {/* Info 
      <div className="p-3 flex flex-col gap-2 flex-1">

        <div>
          <p className="text-white/35 text-[9px] font-bold tracking-widest uppercase">
            {product.category}
          </p>

          <p className="text-white text-sm font-semibold leading-snug mt-1">
            {product.modleName}
          </p>
        </div>

        <div className="text-zinc-400 text-xs">
          Stock: {totalStock}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white font-bold">
            ฿{rentalPrice}
          </span>

          <span className="text-zinc-500 text-xs">
            1 Day Rental
          </span>
        </div>

        <button className="w-full mt-auto bg-[#C3FF51] text-[#080809] text-[10px] font-bold py-2 rounded-md hover:bg-[#d3ff70] active:scale-95 transition-all duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  );
}*/