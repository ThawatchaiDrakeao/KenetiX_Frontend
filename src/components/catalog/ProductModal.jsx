import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart, openCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("1day");
  const [adding, setAdding] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [wished, setWished] = useState(false);

  const rentalPlans = [
    { key: "1day", label: "1 Day" },
    { key: "3day", label: "3 Days" },
    { key: "7day", label: "7 Days" },
  ];

  useEffect(() => {
    if (product && isOpen) {
      const defaultVariant = product.variants?.[0] || null;
      setSelectedVariant(defaultVariant);
      setSelectedSize(null);
      setSelectedImageIndex(0);
      setSelectedPlan("1day");
      setAddedFeedback(false);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!product) return null;

  const images = selectedVariant?.images || [];
  const currentImage = images[selectedImageIndex] || null;
  const rentalPrice = product.rentalPlan?.[0]?.[selectedPlan] || 0;

  const perDayPrice =
    selectedPlan === "1day"
      ? rentalPrice
      : Math.round(rentalPrice / parseInt(selectedPlan));

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedSize) return;
    setAdding(true);
    await addToCart({
      item: product._id,
      name: product.modelName,
      image: selectedVariant.images?.[0] || "",
      price: rentalPrice,
      skuColorCode: selectedVariant.skuColorCode,
      size: selectedSize.size,
      quantity: 1,
      rentalPlan: selectedPlan,
    });
    setAdding(false);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      onClose();
      openCart();
    }, 600);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* Sheet — not full screen, max-height caps it */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "#0f0f10",
          borderRadius: "20px 20px 0 0",
          borderTop: "0.5px solid #2a2a2d",
          maxHeight: "78dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle + close */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
          <div style={{ width: 28 }} />
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: "#2e2e30",
            }}
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "#1e1e22", border: "0.5px solid #2a2a2d" }}
          >
            <svg
              className="w-3.5 h-3.5 text-white/50"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-4 pb-6">
            {/* ── TOP ROW: image left + info right ── */}
            <div className="flex gap-3 items-start mb-4">
              {/* Image block */}
              <div className="flex-shrink-0" style={{ width: 320 }}>
                <div
                  className="overflow-hidden"
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 14,
                    background: "#141415",
                    border: "0.5px solid #1e1e22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.modelName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span className="text-zinc-600 text-xs">No Image</span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-1.5 mt-2">
                    {images.slice(0, 3).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          overflow: "hidden",
                          border:
                            i === selectedImageIndex
                              ? "1.5px solid #C3FF51"
                              : "1.5px solid transparent",
                          opacity: i === selectedImageIndex ? 1 : 0.5,
                          flexShrink: 0,
                          background: "#141415",
                        }}
                        className="transition-all duration-200"
                      >
                        <img
                          src={img}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info block */}
              <div className="flex-1 min-w-0 pt-1">
                <span
                  className="text-[9px] font-bold tracking-widest uppercase inline-block mb-2"
                  style={{
                    color: "#555",
                    background: "#1a1a1c",
                    border: "0.5px solid #2a2a2d",
                    borderRadius: 6,
                    padding: "3px 8px",
                  }}
                >
                  {product.category}
                </span>

                <p className="text-white font-bold leading-snug text-sm mb-1">
                  {product.modelName}
                </p>

                {product.brand && (
                  <p className="text-[11px] mb-3" style={{ color: "#555" }}>
                    {product.brand}
                  </p>
                )}

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: "#C3FF51", letterSpacing: "-0.5px" }}
                  >
                    ฿{rentalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs" style={{ color: "#555" }}>
                    /day
                  </span>
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => setWished(!wished)}
                  className="flex items-center gap-1.5 mt-2.5 transition-colors duration-200"
                  style={{
                    fontSize: 11,
                    color: wished ? "#f87171" : "#444",
                    background: "#131313",
                    border: "0.5px solid #222",
                    borderRadius: 8,
                    padding: "5px 10px",
                  }}
                >
                  <svg
                    style={{ width: 13, height: 13 }}
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
                  {wished ? "Wishlisted" : "Wishlist"}
                </button>
              </div>
            </div>

            {/* ── DIVIDER ── */}
            <div
              style={{
                height: "0.5px",
                background: "#1e1e22",
                margin: "0 0 16px",
              }}
            />

            {/* ── RENTAL PLAN ── */}
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "#444" }}
            >
              Rental plan
            </p>
            <div
              className="grid gap-2 mb-4"
              style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}
            >
              {rentalPlans.map((plan) => {
                const price = product.rentalPlan?.[0]?.[plan.key] || 0;
                const isSel = selectedPlan === plan.key;
                return (
                  <button
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className="flex flex-col items-center py-2.5 transition-all duration-200 active:scale-95"
                    style={{
                      borderRadius: 10,
                      border: isSel
                        ? "1px solid #C3FF51"
                        : "0.5px solid #1e1e22",
                      background: isSel ? "rgba(195,255,81,0.07)" : "#141415",
                    }}
                  >
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: isSel ? "#C3FF51" : "#555" }}
                    >
                      {plan.label}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#fff" }}
                    >
                      ฿{price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── COLOR / VARIANT ── */}
            {product.variants?.length > 1 && (
              <>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#444" }}
                >
                  Color —{" "}
                  <span className="normal-case font-normal tracking-normal text-white/60">
                    {selectedVariant?.colorName ||
                      selectedVariant?.skuColorCode}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {product.variants.map((variant) => {
                    const thumbImg = variant.images?.[0];
                    const isSel =
                      selectedVariant?.skuColorCode === variant.skuColorCode;
                    return (
                      <button
                        key={variant.skuColorCode}
                        onClick={() => handleVariantSelect(variant)}
                        className="transition-all duration-200 active:scale-95"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: isSel
                            ? "1.5px solid #C3FF51"
                            : "1.5px solid transparent",
                          outline: isSel
                            ? "2px solid rgba(195,255,81,0.25)"
                            : "none",
                          outlineOffset: 1,
                          opacity: isSel ? 1 : 0.55,
                          background: "#141415",
                          flexShrink: 0,
                        }}
                      >
                        {thumbImg ? (
                          <img
                            src={thumbImg}
                            alt={variant.colorName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: variant.colorHex || "#333",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── SIZE ── */}
            {selectedVariant?.size?.length > 0 && (
              <>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#444" }}
                >
                  Size —{" "}
                  <span className="normal-case font-normal tracking-normal text-white/60">
                    {selectedSize ? `EU ${selectedSize.size}` : "pick one"}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedVariant.size.map((s) => {
                    const isSel = selectedSize?.size === s.size;
                    const isOOS = s.stock === 0;
                    return (
                      <button
                        key={s.size}
                        disabled={isOOS}
                        onClick={() => setSelectedSize(s)}
                        className="relative transition-all duration-200 active:scale-95"
                        style={{
                          width: 44,
                          height: 40,
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          border: isSel
                            ? "1px solid #C3FF51"
                            : "0.5px solid #1e1e22",
                          background: isSel
                            ? "#C3FF51"
                            : isOOS
                              ? "transparent"
                              : "#141415",
                          color: isSel ? "#080809" : isOOS ? "#2e2e30" : "#aaa",
                          cursor: isOOS ? "not-allowed" : "pointer",
                        }}
                      >
                        {s.size}
                        {isOOS && (
                          <span
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                width: "100%",
                                height: 1,
                                background: "#2e2e30",
                                transform: "rotate(45deg)",
                              }}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── ADD TO CART ── */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedSize}
              className="w-full transition-all duration-300 active:scale-95"
              style={{
                borderRadius: 14,
                border: "none",
                padding: "14px 0",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.02em",
                cursor: !selectedSize ? "not-allowed" : "pointer",
                background: addedFeedback
                  ? "rgba(195,255,81,0.08)"
                  : !selectedSize
                    ? "#1a1a1c"
                    : "#C3FF51",
                color: addedFeedback
                  ? "#C3FF51"
                  : !selectedSize
                    ? "#333"
                    : "#080809",
                border: addedFeedback
                  ? "0.5px solid rgba(195,255,81,0.3)"
                  : "none",
              }}
            >
              {addedFeedback ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    style={{ width: 15, height: 15 }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Added to cart
                </span>
              ) : adding ? (
                "Adding..."
              ) : !selectedSize ? (
                "Select a size"
              ) : (
                `Add to cart — ฿${rentalPrice.toLocaleString()}`
              )}
            </button>

            <div className="h-2" />
          </div>
        </div>
      </div>
    </>
  );
}
