import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function OrderConfirmationPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/api/orders/${orderId}`)
            .then((res) => { if (res.data.success) setOrder(res.data.data); })
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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Success icon */}
                <div className="w-16 h-16 bg-[#1db559]/20 border border-[#1db559]/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-[#C3FF51] text-2xl">✓</span>
                </div>

                <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-400 text-sm mb-1">Order ID</p>
                <p className="text-gray-500 text-xs font-mono mb-6">{orderId}</p>

                {order && (
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
    );
}