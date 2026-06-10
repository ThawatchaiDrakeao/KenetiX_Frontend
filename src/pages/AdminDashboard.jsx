import { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import SummaryMetrics from "../components/admin/SummaryMetrics";
import JobTable from "../components/admin/JobTable";
import StaffTable from "../components/admin/StaffTable";
import CancellationQueue from "../components/admin/CancellationQueue";
import NotificationPanel from "../components/admin/NotificationPanel";
import OrderManagement from "../components/admin/OrderManagement";
import ShoeLookup from "../components/admin/ShoeLookup";
import RecentActivity from "../components/admin/RecentActivity";
import QuickConfirm from "../components/admin/QuickConfirm";
import ProfitAnalysis from "../components/admin/ProfitAnalysis";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-7">
      <h1
        className="font-extrabold font-sora leading-tight"
        style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#FFFFFF" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[13px] font-sora mt-1" style={{ color: "#94A3B8" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Simplified Overview Page - NO driver components
function OverviewPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* CHANGED COLORS ONLY BELOW */}
        <div className="bg-black rounded-2xl p-6 border border-gray-800">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold text-gray-200">{stats.totalOrders}</p>
        </div>

        <div className="bg-black rounded-2xl p-6 border border-gray-800">
          <p className="text-sm text-gray-400">Pending Orders</p>
          <p className="text-3xl font-bold text-gray-200">{stats.pendingOrders}</p>
        </div>

        <div className="bg-black rounded-2xl p-6 border border-gray-800">
          <p className="text-sm text-gray-400">Total Customers</p>
          <p className="text-3xl font-bold text-gray-200">{stats.totalUsers}</p>
        </div>

        <div className="bg-black rounded-2xl p-6 border border-gray-800">
          <p className="text-sm text-gray-400">Active Shoes</p>
          <p className="text-3xl font-bold text-gray-200">{stats.activeShoes}</p>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickConfirm />
        <RecentActivity />
      </div>

      <NotificationPanel />
      <OrderManagement />
    </div>
  );
}

// Jobs Page - Simplified for rental (no driver assignment)
function JobsPage() {
  return (
    <>
      <PageHeader title="Order Management" subtitle="Track customer orders and shipments" />
      <JobTable />
    </>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today" />
            <OverviewPage />
          </>
        );

      case "profit":
        return (
          <>
            <PageHeader title="Profit & Analytics" subtitle="Revenue, costs, and performance metrics" />
            <ProfitAnalysis />
          </>
        );

      case "jobs":
        return (
          <>
            <PageHeader title="Order Management" subtitle="Create, track, and manage all rental orders" />
            <JobsPage />
          </>
        );

      case "staff":
        return (
          <>
            <PageHeader title="Staff Management" subtitle="Manage admin staff and their roles" />
            <StaffTable />
          </>
        );

      case "cancellations":
        return (
          <>
            <PageHeader title="Cancellation Queue" subtitle="Review and process cancellation requests" />
            <CancellationQueue />
          </>
        );

      case "notifications":
        return (
          <>
            <PageHeader title="Notifications" subtitle="System alerts and platform events" />
            <NotificationPanel />
          </>
        );

      case "orders":
        return (
          <>
            <PageHeader title="Order Management" subtitle="Manage customer orders and fulfilment" />
            <OrderManagement />
          </>
        );

      case "shoes":
        return (
          <>
            <PageHeader title="Shoe Inventory" subtitle="Search product catalog and manage inventory" />
            <ShoeLookup />
          </>
        );

      default:
        return (
          <>
            <PageHeader title="Dashboard" subtitle="Welcome to Admin Panel" />
            <OverviewPage />
          </>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen overflow-hidden" style={{ background: "#000000" }}>
        <AdminSidebar active={activeTab} onChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto" style={{ background: "#000000" }}>
          <div className="px-8 py-8 max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}