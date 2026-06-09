import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const DEPOSIT_MULTIPLIER = 9; // deposit = rental fee × 9

export default function CheckoutPage() {
    const { cart, cartCount, fetchUserCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rentalDays, setRentalDays] = useState(
        // initialize per item from cart data
        Object.fromEntries(cart.map((item) => [item._id, item.rentalDays || 1]))
    );

    // ── Derived totals ──────────────────────────────────────────
    const itemsWithDays = cart.map((item) => {
        const days = rentalDays[item._id] || item.rentalDays || 1;
        const rentalFee = item.price * days * (item.quantity || 1);
        const deposit = item.price * DEPOSIT_MULTIPLIER * (item.quantity || 1);
        return { ...item, days, rentalFee, deposit };
    });

    const totalRental = itemsWithDays.reduce((s, i) => s + i.rentalFee, 0);
    const totalDeposit = itemsWithDays.reduce((s, i) => s + i.deposit, 0);
    const grandTotal = totalRental + totalDeposit;

    // ── Submit order ────────────────────────────────────────────
    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        setError("");
        try {
            const orderItems = itemsWithDays.map((item) => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                size: item.size,
                quantity: item.quantity || 1,
                rentalDays: item.days,
                rentalFee: item.rentalFee,
                deposit: item.deposit,
            }));

            const res = await API.post("/api/order", {
                items: orderItems,
                totalRental,
                totalDeposit,
                grandTotal,
            });

            if (res.data.success) {
                await fetchUserCart(); // refresh cart (backend should clear it after order)
                navigate(`/order-confirmation/${res.data.orderId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Update rental days ──────────────────────────────────────
    const updateDays = (itemId, val) => {
        const days = Math.max(1, Math.min(30, Number(val)));
        setRentalDays((prev) => ({ ...prev, [itemId]: days }));
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="text-[#C3FF51] underline hover:text-white transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <style>{`
        .day-input::-webkit-outer-spin-button,
        .day-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .day-input { -moz-appearance: textfield; }
      `}</style>

            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-20 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2"
                >
                    ← Back
                </button>
                <h1 className="text-xl font-bold">Checkout</h1>
                <span className="text-gray-500 text-sm ml-1">({cartCount} items)</span>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                {/* ── Left: Order Items ────────────────────────────── */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Order Summary
                    </h2>

                    <div className="space-y-4">
                        {itemsWithDays.map((item) => (
                            <div
                                key={item._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4"
                            >
                                {/* Image */}
                                <div className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity || 1}
                                    </p>
                                    <p className="text-gray-500 text-xs">฿{item.price.toLocaleString()} / day</p>

                                    {/* Rental days picker */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-gray-400 text-xs">Rental days:</span>
                                        <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateDays(item._id, item.days - 1)}
                                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-zinc-700 transition text-sm"
                                            >−</button>
                                            <input
                                                type="number"
                                                value={item.days}
                                                min={1}
                                                max={30}
                                                onChange={(e) => updateDays(item._id, e.target.value)}
                                                className="day-input w-10 text-center bg-transparent text-white text-sm py-1 outline-none"
                                            />
                                            <button
                                                onClick={() => updateDays(item._id, item.days + 1)}
                                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-zinc-700 transition text-sm"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Per-item fees */}
                                <div className="text-right flex-shrink-0 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[#C3FF51] font-bold text-sm">
                                            ฿{item.rentalFee.toLocaleString()}
                                        </p>
                                        <p className="text-gray-500 text-xs">rental</p>
                                    </div>
                                    <div>
                                        <p className="text-orange-400 font-semibold text-sm">
                                            ฿{item.deposit.toLocaleString()}
                                        </p>
                                        <p className="text-gray-500 text-xs">deposit</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Deposit note */}
                    <div className="mt-4 bg-orange-950/40 border border-orange-800/40 rounded-xl p-4">
                        <p className="text-orange-300 text-xs font-semibold mb-1">📋 Deposit Policy</p>
                        <p className="text-orange-200/70 text-xs leading-relaxed">
                            A refundable deposit of <strong className="text-orange-300">×{DEPOSIT_MULTIPLIER}</strong> the daily rental fee is charged per item.
                            It will be returned in full within 3–5 business days after the shoes are returned in original condition.
                        </p>
                    </div>
                </div>

                {/* ── Right: Payment Summary ───────────────────────── */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Payment
                        </h2>

                        {/* Customer info */}
                        <div className="mb-5 pb-5 border-b border-zinc-800">
                            <p className="text-gray-400 text-xs mb-1">Renting as</p>
                            <p className="text-white text-sm font-semibold">{user?.name || user?.email}</p>
                            <p className="text-gray-500 text-xs">{user?.email}</p>
                            <p className="text-gray-500 text-xs">{user?.address}</p>
                        </div>

                        {/* Fee breakdown */}
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Rental fee</span>
                                <span className="text-[#C3FF51] font-semibold">฿{totalRental.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Deposit (refundable)</span>
                                <span className="text-orange-400 font-semibold">฿{totalDeposit.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-zinc-700 pt-3 flex justify-between">
                                <span className="text-white font-bold">Total Due Now</span>
                                <span className="text-white font-bold text-lg">฿{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Deposit refund reminder */}
                        <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                            Deposit of <span className="text-orange-400">฿{totalDeposit.toLocaleString()}</span> is
                            fully refundable upon return.
                        </p>

                        {error && (
                            <div className="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading || cart.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-base transition
                ${loading || cart.length === 0
                                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    : "bg-[#1db559] hover:bg-[#189b4c] text-white active:scale-95"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                `CONFIRM & PAY ฿${grandTotal.toLocaleString()}`
                            )}
                        </button>

                        <p className="text-center text-gray-600 text-xs mt-3">
                            By confirming you agree to our rental terms
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}