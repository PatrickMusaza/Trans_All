import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import TopNav from "../../components/Admin/TopNav/TopNav";
import SummaryCard from "../../components/Admin/SummaryCard/SummaryCard";
import Table from "../../components/Admin/CRUD/Table";
import Chart from "../../components/Admin/Chart/Chart";
import axiosInstance from "../../api/axios";
import "./Dashboard.css";
import NotificationPanel from "../../components/Admin/Notification/NotificationPanel";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const [trips, setTrips] = useState([]);
  const [chartFormattedData, setChartFormattedData] = useState([]);

  // Fetch trips, drivers, and users
  useEffect(() => {
    // Fetch trips
    axiosInstance.get("api/trips/")
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });

    // Prepare data for the chart component
    const formattedData = Object.keys(aggregatedData).map((key) => ({
      route: key,
      tripsCount: aggregatedData[key],
    }));

    setChartFormattedData(formattedData); // Set the chart formatted data state
  })

  // Prepare data for chart
  const chartData = trips.map((trip) => ({
    from: trip.from_place,
    to: trip.to_place,
  }));

  // Aggregate data for the chart
  const aggregatedData = chartData.reduce((acc, { from, to }) => {
    const key = `${from} → ${to}`;
    if (acc[key]) {
      acc[key] += 1;
    } else {
      acc[key] = 1;
    }
    return acc;
  }, {});

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <>
          <SummaryCard />
          <Chart chartType="bar" xField="route" yField="tripsCount" tableData={chartFormattedData} />
          {/*<Chart chartType="pie" xField="day" yField="earnings" tableData={sampleData} />*/}
        </>;
      case "users":
        return <>
          <Table apiRoute="api/auth/user/" name="Users" />
          {/*<NotificationPanel
            tableData={sampleTableData}
            summaryField="summary"
            detailField="details"
          />
            */}
        </>
      case "clients-list":
        return <>
          <Table apiRoute="api/clients/" name="Clients" />
          {/*<NotificationPanel
            tableData={sampleTableData}
            summaryField="summary"
            detailField="details"
          />*/}

        </>;
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
