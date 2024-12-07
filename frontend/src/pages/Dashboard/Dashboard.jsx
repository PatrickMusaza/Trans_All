import React, { useState } from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import TopNav from "../../components/Admin/TopNav/TopNav";
import SummaryCard from "../../components/Admin/SummaryCard/SummaryCard";
import Table from "../../components/Admin/Users/Table";
import Chart from "../../components/Admin/Chart/Chart";
import RecentTrip from "../../components/Admin/RecentTrip/RecentTripTable";
import "./Dashboard.css";
import NotificationPanel from "../../components/Admin/Notification/NotificationPanel";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const sampleData = [
    { day: "Mon", earnings: 400 },
    { day: "Tue", earnings: 600 },
    { day: "Wed", earnings: 800 },
    { day: "Thu", earnings: 500 },
    { day: "Fri", earnings: 700 },
    { day: "Sat", earnings: 900 },
    { day: "Sun", earnings: 1000 },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <>
          <SummaryCard />
          <Chart chartType="bar" xField="day" yField="earnings" tableData={sampleData} />
          <Chart chartType="pie" xField="day" yField="earnings" tableData={sampleData} />
        </>;
      case "users":
        return <><Table apiRoute="api/auth/user/" name="Users" />
        <NotificationPanel /></>;
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
