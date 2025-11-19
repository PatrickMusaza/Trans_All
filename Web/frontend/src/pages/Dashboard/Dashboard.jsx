import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import TopNav from "../../components/Admin/TopNav/TopNav";
import SummaryCard from "../../components/Admin/SummaryCard/SummaryCard";
import Table from "../../designs/CRUD/Table";
import Chart from "../../components/Admin/Chart/Chart";
import NotificationPanel from "../../components/Admin/Notification/NotificationPanel";
import axiosInstance from "../../api/axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [chartFormattedData, setChartFormattedData] = useState([]);
  const [pieChartFormattedData, setPieChartFormattedData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const notificationMapping = {
    "dashboard": null,
    "users": "users",
    "staff": "staff",
    "clients-list": "clients",
    "drivers-list": "drivers",
    "vehicles": "vehicles",
    "agencies": "agencies",
    "rides": "rides",
    "routes": "routes",
    "moved": "moved",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, drivers, clients, staff, agencies, vehicles, routes] = await Promise.all([
          axiosInstance.get("api/users/").then((res) => res.data.length),
          axiosInstance.get("api/drivers/").then((res) => res.data.length),
          axiosInstance.get("api/clients/").then((res) => res.data.length),
          axiosInstance.get("api/staff/").then((res) => res.data.length),
          axiosInstance.get("api/agencies/").then((res) => res.data.length),
          axiosInstance.get("api/vehicles/").then((res) => res.data.length),
          axiosInstance.get("api/routes/").then((res) => res.data.length),
        ]);

        const stats = [
          { label: "Users", value: users },
          { label: "Drivers", value: drivers },
          { label: "Clients", value: clients },
          { label: "Staff", value: staff },
          { label: "Agencies", value: agencies },
          { label: "Vehicles", value: vehicles },
          { label: "Routes", value: routes },
        ];

        setPieChartFormattedData(stats);
      } catch (error) {
        console.error("Error fetching stats for the pie chart:", error);
      }
    };

    const fetchTripData = async () => {
      try {
        const trips = await axiosInstance.get("api/trips/").then((res) => res.data);
        
        const aggregatedTrips = trips.reduce((acc, trip) => {
          const routeKey = `${trip.route.from_place}→${trip.route.to_place}`;
          acc[routeKey] = (acc[routeKey] || 0) + 1;
          return acc;
        }, {});

        const formattedBarData = Object.keys(aggregatedTrips).map((route) => ({
          route,
          tripsCount: aggregatedTrips[route],
        }));

        setChartFormattedData(formattedBarData);
      } catch (error) {
        console.error("Error fetching trip data for the bar chart:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const messages = await axiosInstance.get("api/messages/").then((res) => res.data);
        setNotifications(messages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchStats();
    fetchTripData();
    fetchNotifications();
  }, []);

  const renderContent = () => {
    const notificationCategory = notificationMapping[activeView];

    const filteredNotifications = notificationCategory
      ? notifications.filter(
        (notification) => notification.category.toLowerCase() === notificationCategory.toLowerCase()
      )
      : [];

    switch (activeView) {
      case "dashboard":
        return (
          <>
            <SummaryCard />
            <Chart
              chartType="bar"
              xField="route"
              yField="tripsCount"
              tableData={chartFormattedData}
            />
            <Chart
              chartType="pie"
              xField="label"
              yField="value"
              tableData={pieChartFormattedData}
            />
          </>
        );
      case "users":
        return (
          <>
            <Table apiRoute="api/users/" name="Users" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
      case "clients-list":
        return (
          <>
            <Table apiRoute="api/clients/" name="Clients" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
        case "trips":
          return (
            <>
              <Table apiRoute="api/trips/" name="Trips" />
              <NotificationPanel
                tableData={filteredNotifications}
                summaryField="subject"
                detailField="message"
              />
            </>
          );
          case "moved":
            return (
              <>
                <Table apiRoute="api/moved/" name="Moved" />
                <NotificationPanel
                  tableData={filteredNotifications}
                  summaryField="subject"
                  detailField="message"
                />
              </>
            );
      case "routes":
        return (
          <>
            <Table apiRoute="api/routes/" name="Routes" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
      case "vehicles":
        return (
          <>
            <Table apiRoute="api/vehicles/" name="Vehicles" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
      case "drivers-list":
        return (
          <>
            <Table apiRoute="api/drivers/" name="Drivers" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
      case "staff":
        return (
          <>
            <Table apiRoute="api/staff/" name="Staff" />
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </>
        );
        case "agencies":
          return (
            <>
              <Table apiRoute="api/agencies/" name="Agencies" />
              <NotificationPanel
                tableData={filteredNotifications}
                summaryField="subject"
                detailField="message"
              />
            </>
          );
          case "messages":
            return (
              <>
                <Table apiRoute="api/messages/" name="Messages" />
              </>
            );
      default:
        return (
          <div>
            Coming Soon...
            <NotificationPanel
              tableData={filteredNotifications}
              summaryField="subject"
              detailField="message"
            />
          </div>
        );
    }
  };


  return (
    <div className="dashboard-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="dashboard-main">
        <TopNav />
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;