import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, cartCount, removeFromCart, fetchUserCart } = useCart();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isOpen) return;

    const loadCart = async () => {
      setLoading(true);
      await fetchUserCart();
      setLoading(false);
    };

    loadCart();
  }, [isOpen, fetchUserCart]);

  const handleRemoveItem = async (item) => {
    await removeFromCart({
      item: item.item,
      skuColorCode: item.skuColorCode,
      size: item.size,
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-zinc-800 z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-white text-2xl font-bold">
            Your Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <p className="text-gray-400 text-center">Loading cart...</p>
          )}
          {!loading && cart.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Your cart is empty</p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/catalog");
                }}
                className="mt-4 text-[#C3FF51] text-sm hover:underline"
              >
                Browse Products
              </button>
            </div>
          )}
          {cart.map((item, index) => (
            <div
              key={item._id || index}
              className="flex gap-4 mb-6 pb-6 border-b border-zinc-800 last:border-0"
            >
              {/* Image */}
              <div className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink:0 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-zinc-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="grow">
                <h3 className="text-white font-bold text-sm">{item.name}</h3>{" "}
                {/* ← name instead of ID */}
                <p className="text-gray-400 text-xs mt-1">
                  Size: {item.size} | Qty: {item.quantity || 1}
                </p>
                <p className="text-gray-500 text-xs">
                  ฿{(item.price || 0).toLocaleString()} / day
                </p>{" "}
                {/* ← price instead of SKU */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#C3FF51] font-bold text-sm">
                    ฿
                    {(
                      (item.price || 0) * (item.quantity || 1)
                    ).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-red-400 text-xs underline hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-[#050505]">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-400">Total Items</span>
            <span className="text-white font-bold">{cartCount}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
            disabled={cart.length === 0}
            className={`w-full text-white font-bold py-4 rounded-xl transition text-lg ${cart.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-[#1db559] hover:bg-[#189b4c] active:scale-95"}`}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
}
