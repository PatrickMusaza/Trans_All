import React, { useState } from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import TopNav from "../../components/Admin/TopNav/TopNav";
import SummaryCard from "../../components/Admin/SummaryCard/SummaryCard";
import Table from "../../components/Admin/Users/Table";
import RecentTrip from "../../components/Admin/RecentTrip/RecentTripTable";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <SummaryCard />;
      case "clients-list":
        return <Table />;
      case "rides":
        return <div>Rides Content</div>;
      case "routes":
        return <div>Routes Content</div>;
      case "vehicles":
        return <div>Vehicle Content</div>;
      case "drivers-list":
        return <RecentTrip />;
      default:
        return <div>Coming Soon...</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="dashboard-main">
        <TopNav />
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
