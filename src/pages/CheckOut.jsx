import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const DEPOSIT_MULTIPLIER = 9;

export default function CheckoutPage() {
    const { cart, cartCount, fetchUserCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rentalDays, setRentalDays] = useState(
        Object.fromEntries(cart.map((item) => [item._id, item.rentalDays || 1]))
    );

    // --- Frontend Payment States ---
    const [paymentMethod, setPaymentMethod] = useState("promptpay"); // 'promptpay' | 'card'
    const [isPaying, setIsPaying] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // --- Product Detail Popup State ---
    //const [selectedProduct, setSelectedProduct] = useState(null); // Tracks product for the detail popup

    const itemsWithDays = cart.map((item) => {
        const days = rentalDays[item._id] || item.rentalDays || 1;
        const rentalFee = (item.price || 0) * days * (item.quantity || 1);
        const deposit = (item.price || 0) * DEPOSIT_MULTIPLIER * (item.quantity || 1);
        return { ...item, days, rentalFee, deposit };
    });

    const totalRental = itemsWithDays.reduce((s, i) => s + i.rentalFee, 0);
    const totalDeposit = itemsWithDays.reduce((s, i) => s + i.deposit, 0);
    const grandTotal = totalRental + totalDeposit;

    const updateDays = (itemId, val) => {
        setRentalDays((prev) => ({ ...prev, [itemId]: Math.max(1, Math.min(30, Number(val))) }));
    };

    // 10-Second Countdown Timer Loop
    useEffect(() => {
        let timer;
        if (isPaying && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (isPaying && countdown === 0) {
            setIsPaying(false);
            executeOrderPlacement(); // Fire unchanged backend integration
        }
        return () => clearInterval(timer);
    }, [isPaying, countdown]);

    const handleInitiatePayment = () => {
        if (cart.length === 0) return;
        setError("");
        setCountdown(10);
        setIsPaying(true);
    };

    // Original, unchanged backend API interaction logic
    const executeOrderPlacement = async () => {
        setLoading(true);
        try {
            const orderRes = await API.post("/api/orders/create-order", {
                items: itemsWithDays.map((item) => ({
                    productId: item.item,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    size: item.size,
                    quantity: item.quantity || 1,
                    rentalDays: item.days,
                    rentalFee: item.rentalFee,
                    deposit: item.deposit,
                })),
                totalRental,
                totalDeposit,
                grandTotal,
            });

            if (orderRes.data && orderRes.data.success) {
                await fetchUserCart();

                navigate(`/orderconfirmation/${orderRes.data.orderId}`);
            } else {
                throw new Error("Order creation failed");
            }
        } catch (err) {
            setIsPaying(false);
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                    <button onClick={() => navigate("/catalog")} className="text-[#C3FF51] underline hover:text-white transition">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative">
            <style>{`.day-input::-webkit-outer-spin-button,.day-input::-webkit-inner-spin-button{-webkit-appearance:none}.day-input{-moz-appearance:textfield}`}</style>

            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-5 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition text-sm">← Back</button>
                <h1 className="text-xl font-bold">Checkout</h1>
                <span className="text-gray-500 text-sm">({cartCount} items)</span>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                {/* Left: Items */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {itemsWithDays.map((item) => (
                            <div key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4">
                                {/* Clicking image opens Detail Popup */}
                                <div
                                    onClick={() => setSelectedProduct(item)}
                                    className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition"
                                >
                                    {item.image
                                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    }
                                </div>
                                <div className="flex-grow min-w-0">
                                    {/* Clicking name opens Detail Popup */}
                                    <h3
                                        onClick={() => setSelectedProduct(item)}
                                        className="text-white font-semibold text-sm truncate cursor-pointer hover:text-[#C3FF51] transition"
                                    >
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-0.5">Size: {item.size} · Qty: {item.quantity || 1}</p>
                                    <p className="text-gray-500 text-xs">฿{(item.price || 0).toLocaleString()} / day</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-gray-400 text-xs">Rental days:</span>
                                        <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                                            <button onClick={() => updateDays(item._id, item.days - 1)} className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-zinc-700 transition text-sm">−</button>
                                            <input type="number" value={item.days} min={1} max={30} onChange={(e) => updateDays(item._id, e.target.value)} className="day-input w-10 text-center bg-transparent text-white text-sm py-1 outline-none" />
                                            <button onClick={() => updateDays(item._id, item.days + 1)} className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-zinc-700 transition text-sm">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[#C3FF51] font-bold text-sm">฿{item.rentalFee.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs">rental</p>
                                    </div>
                                    <div>
                                        <p className="text-orange-400 font-semibold text-sm">฿{item.deposit.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs">deposit</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 bg-orange-950/40 border border-orange-800/40 rounded-xl p-4">
                        <p className="text-orange-300 text-xs font-semibold mb-1">📋 Deposit Policy</p>
                        <p className="text-orange-200/70 text-xs leading-relaxed">
                            A refundable deposit of <strong className="text-orange-300">×{DEPOSIT_MULTIPLIER}</strong> the daily rental fee is charged per item. Refunded within 3–5 business days after return.
                        </p>
                    </div>
                </div>

                {/* Right: Payment Sidebar */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Payment</h2>
                        <div className="mb-5 pb-5 border-b border-zinc-800">
                            <p className="text-gray-400 text-xs mb-1">Renting as</p>
                            <p className="text-white text-sm font-semibold">{user?.name} {user?.surname}</p>
                            <p className="text-gray-500 text-xs">{user?.email}</p>
                            {user?.address && <p className="text-gray-500 text-xs mt-1">{user.address}</p>}
                        </div>

                        {/* Payment Method Option Selector Boxes */}
                        <div className="mb-5">
                            <p className="text-gray-400 text-xs mb-2 font-semibold uppercase tracking-wider">Select Payment Method</p>
                            <div className="space-y-2">
                                <div
                                    onClick={() => setPaymentMethod("promptpay")}
                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${paymentMethod === "promptpay" ? "border-[#C3FF51] bg-[#C3FF51]/5" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="paymentMethodSelector" checked={paymentMethod === "promptpay"} readOnly className="accent-[#C3FF51]" />
                                        <span className="text-sm font-medium">PromptPay QR</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Instant</span>
                                </div>
                                <div
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${paymentMethod === "card" ? "border-[#C3FF51] bg-[#C3FF51]/5" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="paymentMethodSelector" checked={paymentMethod === "card"} readOnly className="accent-[#C3FF51]" />
                                        <span className="text-sm font-medium">Credit / Debit Card</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Visa, Mastercard</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Breakdown */}
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

                        {error && (
                            <div className="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleInitiatePayment}
                            disabled={loading || cart.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-base transition ${loading || cart.length === 0
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
                        <p className="text-center text-gray-600 text-xs mt-3">By confirming you agree to our rental terms</p>
                    </div>
                </div>
            </div>

            {/* --- MODAL 2: Simulated Countdown Payment Screen --- */}
            {isPaying && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {paymentMethod === "promptpay" ? (
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-white">Scan PromptPay QR</h3>
                                <p className="text-xs text-zinc-400 mb-4">Please capture and scan with your banking app</p>

                                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                                    <div className="w-44 h-44 bg-zinc-100 flex flex-col items-center justify-center border border-zinc-300 relative rounded-lg">
                                        <div className="absolute top-2 font-bold text-blue-900 text-[11px] tracking-wider uppercase">Prompt Pay</div>
                                        <svg className="w-24 h-24 text-zinc-900 mt-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2 2h6v6H2V2zm2 2v2h2V4H4zm0 12v2h2v-2H4zm12-12h6v6h-6V4zm2 2v2h2V6h-2zm-6 8h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zM10 2h2v2h-2V2zm0 4h2v2h-2V6zm4 0h2v2h-2V6zM2 14h6v6H2v-6zm2 2v2h2v-2H4zm8-6h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                                        </svg>
                                        <div className="absolute bottom-2 text-[11px] font-bold text-zinc-800">฿{grandTotal.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-white">Credit / Debit Card</h3>
                                <p className="text-xs text-zinc-400 mb-4">Secure Gateway Simulation</p>

                                <div className="space-y-3 text-left mb-5">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Card Number</label>
                                        <input type="text" placeholder="4242 •••• •••• 4242" disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-400 outline-none cursor-not-allowed" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Expiry Date</label>
                                            <input type="text" placeholder="12 / 29" disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-400 outline-none cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">CVC / CVV</label>
                                            <input type="text" placeholder="•••" disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-400 outline-none cursor-not-allowed" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Loading Progress & Countdown */}
                        <div className="border-t border-zinc-800 pt-4 flex flex-col items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-zinc-700 border-t-[#C3FF51] rounded-full animate-spin" />
                            <p className="text-xs font-medium text-zinc-400">Verifying secure payment connection...</p>
                            <span className="text-sm font-bold text-[#C3FF51] bg-[#C3FF51]/10 px-4 py-1.5 rounded-full mt-1 tracking-wide">
                                {countdown}s left
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}