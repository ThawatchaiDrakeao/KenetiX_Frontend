import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductModal from "./ProductModal";

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const { cart, addToCart, removeFromCart } = useCart();
  const { isWished, toggleWishlist } = useWishlist();
  const wished = isWished(product._id);

  const defaultVariant = product?.variants?.[0];
  const defaultSize = defaultVariant?.size?.[0];
  const image = defaultVariant?.images?.[0] || "/placeholder-shoe.png";
  const rentalPrice = product?.rentalPlan?.[0]?.["1day"] || 0;

  const cartItemsForThisProduct = cart.filter(
    (cartItem) =>
      cartItem.item === product._id || cartItem.item?._id === product._id,
  );
  const quantityInCart = cartItemsForThisProduct.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
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
      size: defaultSize.size,
    });
  };

  return (
    <>
      <div
        className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden group hover:border-[#C3FF51]/20 transition-all duration-300 flex flex-col cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image Section */}
        <div
          className="relative bg-[#141415] overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg
              className={`w-4 h-4 ${wished ? "text-red-400" : "text-zinc-400"}`}
              fill="currentColor"
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
            <img
              src={image}
              alt={product.modelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              No Image
            </div>
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

          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-white font-bold">
              ฿{rentalPrice.toLocaleString()}
              <span className="text-zinc-500 text-xs font-normal">/day</span>
            </span>

            {/* Dynamic Cart Button */}
            {isInCart ? (
              <div className="flex items-center justify-between bg-[#1e1e20] rounded-md overflow-hidden">
                <button
                  onClick={handleRemoveFromCart}
                  className="w-8 py-1.5 text-white/60 hover:text-white hover:bg-white/10 font-bold"
                >
                  −
                </button>
                <span className="text-[#C3FF51] text-xs font-bold px-1">
                  {quantityInCart} in Cart
                </span>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-8 py-1.5 text-white/60 hover:text-white hover:bg-white/10 font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="bg-[#C3FF51] text-[#080809] text-[10px] font-bold py-2 px-4 rounded-md hover:bg-[#d3ff70] active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
