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
      case "users":
        return <Table apiRoute="api/users/" name="Users" />;
      case "clients-list":
        return <Table apiRoute="api/clients/" name="Clients" />;
      case "rides":
        return <Table apiRoute="api/rides/" name="Rides" />;
      case "routes":
        return <Table apiRoute="api/routes/" name="Routes" />;
      case "vehicles":
        return <Table apiRoute="api/vehicles/" name="Vehicles" />;
      case "drivers-list":
        return <Table apiRoute="api/drivers/" name="Drivers" />;
      case "agencies":
        return <Table apiRoute="api/agencies/" name="Agencies" />;
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
