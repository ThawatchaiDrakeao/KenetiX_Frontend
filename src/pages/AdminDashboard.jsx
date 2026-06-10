import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import SummaryMetrics from "../components/admin/SummaryMetrics";
import JobTable from "../components/admin/JobTable";
import JobTimeline from "../components/admin/JobTimeline";
import StaffTable from "../components/admin/StaffTable";
import CancellationQueue from "../components/admin/CancellationQueue";
import NotificationPanel from "../components/admin/NotificationPanel";
import OrderManagement from "../components/admin/OrderManagement";
import ShoeLookup from "../components/admin/ShoeLookup";
import JobStatusChart from "../components/admin/JobStatusChart";
import RecentActivity from "../components/admin/RecentActivity";
import QuickConfirm from "../components/admin/QuickConfirm";
import ProfitAnalysis from "../components/admin/ProfitAnalysis";
import DriverOverview from "../components/admin/DriverOverview";
import LiveDeliveryMap from "../components/admin/LiveDeliveryMap";

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-7">
      <h1
        className="font-extrabold font-sora leading-tight"
        style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#0F172A" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[13px] font-sora mt-1" style={{ color: "#64748B" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <SummaryMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <JobStatusChart />
        </div>
        <div className="lg:col-span-3">
          <QuickConfirm />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DriverOverview />
        <RecentActivity />
      </div>
      <LiveDeliveryMap />
    </div>
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
            <PageHeader title="Overview" subtitle="Platform-wide performance at a glance" />
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
            <PageHeader title="Job Management" subtitle="Create, assign, and track all delivery jobs" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <JobTable onViewTimeline={setSelectedJobId} />
              </div>
              <JobTimeline jobId={selectedJobId} />
            </div>
          </>
        );
      case "staff":
        return (
          <>
            <PageHeader title="Staff Management" subtitle="Manage drivers and operations staff" />
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
            <PageHeader title="Shoe Lookup" subtitle="Search product catalog and inventory" />
            <ShoeLookup />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFC" }}>
      <AdminSidebar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto" style={{ background: "#F8FAFC" }}>
        <div className="px-8 py-8 max-w-[1200px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
