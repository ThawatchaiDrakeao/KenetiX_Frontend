import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function ProductModal({ product, isOpen, onClose }) {
    if (!isOpen || !product) return null;

    // 1. Extract data safely matching your Mongoose schema
    const defaultVariant = product?.variants?.[0];
    const images = defaultVariant?.images || ["/placeholder-shoe.png"];
    const sizes = defaultVariant?.size || [];
    const rentalPlans = product?.rentalPlan?.[0] || {};

    // 2. Local interactive state
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [selectedSize, setSelectedSize] = useState(sizes[0]?.size || "");
    const [selectedPlan, setSelectedPlan] = useState("1day"); // Default to 1 day
    const [adding, setAdding] = useState(false);

    const { cart, addToCart, removeFromCart } = useCart();

    // 3. Match the price dynamically to the selected plan
    const rentalPrice = rentalPlans[selectedPlan] || 0;

    // 4. Cart verification logic
    const cartItemsForThisProduct = cart.filter(
        (item) => item.item === product._id && item.size === selectedSize
    );
    const quantityInCart = cartItemsForThisProduct.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const isInCart = quantityInCart > 0;

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Please select a size first");
            return;
        }
        setAdding(true);
        await addToCart({
            item: product._id,
            name: product.modelName,
            image: selectedImage,
            price: rentalPrice,
            skuColorCode: defaultVariant?.skuColorCode || "",
            size: selectedSize,
            rentalDuration: selectedPlan, // Passes selected "1day", "3day", "7day"
            quantity: 1,
        });
        setAdding(false);
    };

    const handleRemoveFromCart = async () => {
        await removeFromCart({
            item: product._id,
            skuColorCode: defaultVariant?.skuColorCode || "",
            size: selectedSize,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            {/* Modal Wrapper Container */}
            <div className="relative w-full max-w-4xl bg-[#0f0f10] border border-[#1e1e20] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white bg-zinc-900/50 p-2 rounded-full transition"
                >
                    ✕
                </button>

                {/* Split Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* LEFT SIDE: Big Product Media Layout */}
                    <div className="p-6 bg-[#141415] flex flex-col justify-center items-center gap-4 border-b md:border-b-0 md:border-r border-[#1e1e20]">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/20">
                            <img
                                src={selectedImage}
                                alt={product.modelName}
                                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                            />
                        </div>
                        {/* Small Image Thumbnails if multi-image exists */}
                        {images.length > 1 && (
                            <div className="flex gap-2 justify-start w-full overflow-x-auto">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-[#C3FF51]' : 'border-transparent'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Details and Purchasing Controls */}
                    <div className="p-8 flex flex-col justify-between h-full gap-6">
                        <div>
                            <span className="text-[#C3FF51] text-xs font-bold uppercase tracking-widest bg-[#C3FF51]/10 px-2.5 py-1 rounded-md">
                                {product.category} · {product.gender}
                            </span>
                            <h2 className="text-white text-2xl font-extrabold mt-3 tracking-tight">{product.modelName}</h2>
                            <p className="text-zinc-500 text-xs mt-1">Brand ID: {product.brandId?.$oid || product.brandId}</p>

                            <hr className="border-[#1e1e20] my-4" />

                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Description</h3>
                            <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{product.description}</p>

                            {/* Rental Term Selector (1day, 3day, 7day) */}
                            <div className="mt-6">
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Select Rental Plan</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(rentalPlans).map(([key, value]) => {
                                        if (key === '_id') return null;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedPlan(key)}
                                                className={`py-3 px-2 rounded-lg border text-center transition flex flex-col justify-center items-center ${selectedPlan === key
                                                    ? "bg-[#C3FF51] text-black border-[#C3FF51] font-bold"
                                                    : "bg-transparent border-[#1e1e20] text-white hover:border-zinc-700"
                                                    }`}
                                            >
                                                <span className="text-xs uppercase font-semibold">{key}</span>
                                                <span className="text-sm font-extrabold mt-0.5">฿{value}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Size Field Selector */}
                            <div className="mt-6">
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((sz) => (
                                        <button
                                            key={sz.size}
                                            disabled={sz.stock === 0}
                                            onClick={() => setSelectedSize(sz.size)}
                                            className={`h-11 px-4 rounded-md border text-xs font-bold transition ${sz.stock === 0 ? "opacity-30 cursor-not-allowed bg-zinc-900 border-transparent text-zinc-600" :
                                                selectedSize === sz.size
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent border-[#1e1e20] text-zinc-400 hover:border-zinc-500"
                                                }`}
                                        >
                                            EU {sz.size}
                                            <span className="block text-[9px] font-normal opacity-60">({sz.stock} left)</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price & Synchronized Add-to-Cart Action Bar */}
                        <div className="mt-auto pt-6 border-t border-[#1e1e20] flex items-center justify-between gap-4">
                            <div>
                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Price</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white text-2xl font-black">฿{rentalPrice.toLocaleString()}</span>
                                    <span className="text-zinc-500 text-xs">/{selectedPlan}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                {isInCart ? (
                                    <div className="w-full flex items-center justify-between bg-[#1e1e20] h-12 rounded-xl overflow-hidden">
                                        <button onClick={handleRemoveFromCart} className="w-12 h-full text-white/60 hover:text-white hover:bg-white/10 font-bold text-lg">
                                            −
                                        </button>
                                        <span className="text-[#C3FF51] text-xs font-bold">
                                            {quantityInCart} in Cart (Size {selectedSize})
                                        </span>
                                        <button onClick={handleAddToCart} disabled={adding} className="w-12 h-full text-white/60 hover:text-white hover:bg-white/10 font-bold text-lg">
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="w-full h-12 bg-[#C3FF51] text-[#080809] text-xs font-black rounded-xl hover:bg-[#d3ff70] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                                    >
                                        {adding ? "ADDING TO CART..." : "RENT NOW"}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}