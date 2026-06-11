import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Footer from "../components/Footer";

export default function OrderConfirmationPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Change route mapping context to match plural/singular structure
        API.get(`/api/orders/${orderId}`)
            .then((res) => {
                if (res.data.success) {
                    setOrder(res.data.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-zinc-600 border-t-[#C3FF51] rounded-full animate-spin" />
            </div>
        );
    }

    const orderDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleString("th-TH", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <div className="flex-grow flex items-center justify-center px-6 py-16">
                <div className="max-w-md w-full text-center">
                    {/* Success icon */}
                    <div className="w-16 h-16 bg-[#1db559]/20 border border-[#1db559]/40 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-[#C3FF51] text-2xl">✓</span>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                    {orderDate && (
                        <p className="text-gray-500 text-xs mb-1">{orderDate}</p>
                    )}
                    <p className="text-gray-400 text-sm mb-1">Order ID</p>
                    <p className="text-gray-500 text-xs font-mono mb-6">{orderId}</p>

                    {order && (
                        <>
                            {/* Items Purchased List */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-left mb-4">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                    Items Ordered
                                </h2>
                                <div className="space-y-4">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex gap-3 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                                            <div className="w-14 h-14 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                                                <p className="text-gray-400 text-xs">Size: {item.size} · Qty: {item.quantity}</p>
                                                <p className="text-gray-500 text-xs">{item.rentalDays} day{item.rentalDays > 1 ? "s" : ""}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[#C3FF51] text-sm font-bold">฿{item.rentalFee?.toLocaleString()}</p>
                                                <p className="text-orange-400 text-xs">+฿{item.deposit?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary Panel */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-left mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Rental fee</span>
                                    <span className="text-[#C3FF51] font-semibold">฿{order.totalRental?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Deposit (refundable)</span>
                                    <span className="text-orange-400 font-semibold">฿{order.totalDeposit?.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-zinc-700 pt-3 flex justify-between font-bold">
                                    <span>Total Paid</span>
                                    <span>฿{order.grandTotal?.toLocaleString()}</span>
                                </div>
                            </div>
                        </>
                    )}

                    <p className="text-gray-500 text-xs mb-6">
                        Your deposit will be refunded within 3–5 business days after return.
                    </p>

                    <button
                        onClick={() => navigate("/catalog")}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}