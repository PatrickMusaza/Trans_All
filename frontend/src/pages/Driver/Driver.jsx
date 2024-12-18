import React, { useState, useEffect } from "react";
import Dashboard from "../../components/User/Dashboard/Dashboard";
import TopNav from "../../components/Admin/TopNav/TopNav"
import Routes from "../../components/User/Route/Routes";
import LiveMap from "../../components/User/LiveMap/LiveMap";
import Table from "../../components/User/Table/Table";
import Sidebar from "../../components/Driver/Sidebar/Sidebar";
import axiosInstance from "../../api/axios";
import NotificationPanel from "../../components/Admin/Notification/NotificationPanel";
import "./Driver.css";

function Driver() {
    const [activeView, setActiveView] = useState("dashboard");
    const [routes, setRoutes] = useState([]);
    const [trips, setTrips] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

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
    };


    useEffect(() => {
        // Fetch routes
        axiosInstance.get("api/routes/")
            .then((response) => {
                setRoutes(response.data);
            })
            .catch((error) => {
                console.error("Error fetching routes:", error);
            });

        // Fetch trips
        axiosInstance.get("api/trips/")
            .then((response) => {
                setTrips(response.data);
            })
            .catch((error) => {
                console.error("Error fetching trips:", error);
            });

        const fetchNotifications = async () => {
            try {
                const messages = await axiosInstance.get("api/messages/").then((res) => res.data);
                setNotifications(messages);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);


    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
    };

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
                        <Dashboard trips={trips} />
                        {/* <Chart chartType="bar" xField="" yField="" tableData=""/>*/}
                    </>);
            case "routes":
                return (
                    <>
                        <Routes routes={routes} onSelectRoute={handleRouteSelect} />
                        {selectedRoute &&
                            <LiveMap route={selectedRoute} />}
                    </>
                );
            case "trips":
                return (
                    <>
                        <Table trips={trips} />
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

            default:
                return <alert>No data</alert>;
        }
    };

    return (
        <>
            <TopNav />
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="dashboard-contents">{renderContent()}</div>
        </>
    );
}

export default Driver;
