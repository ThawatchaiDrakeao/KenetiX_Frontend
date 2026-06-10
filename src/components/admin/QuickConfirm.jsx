import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function QuickConfirm() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      // CHANGE THIS - Use admin endpoint instead
      const response = await API.get("/admin/orders?status=pending");
      setPendingOrders(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      // CHANGE THIS - Use admin endpoint
      await API.put(`/order/${orderId}/status`, { status: "confirmed" });
      fetchPendingOrders(); // Refresh list
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleReject = async (orderId) => {
    try {
      // CHANGE THIS - Use admin endpoint
      await API.put(`/order/${orderId}/status`, { status: "cancelled" });
      fetchPendingOrders(); // Refresh list
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-6 bg-white border border-gray-200">
        <p className="text-gray-500">Loading pending orders...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">Quick Confirm</h3>
          <p className="text-xs text-gray-500 mt-0.5">Pending approval</p>
        </div>
        {pendingOrders.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
            {pendingOrders.length} pending
          </span>
        )}
      </div>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No pending orders</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingOrders.map((order) => (
            <div key={order._id} className="rounded-xl p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-600">{order._id?.slice(-8)}</span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="font-semibold text-sm">{order.userId?.name || "Customer"}</p>
              <p className="text-xs text-gray-500 mt-1">
                {order.items?.length} items · ฿{order.grandTotal?.toLocaleString()}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleConfirm(order._id)}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-green-100 text-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleReject(order._id)}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-red-100 text-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}