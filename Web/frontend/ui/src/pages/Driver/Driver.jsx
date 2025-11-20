import React, { useState, useEffect } from "react";
import Dashboard from "../../components/Driver/Dashboard/Dashboard";
import TopNav from "../../components/Admin/TopNav/TopNav";
import Routes from "../../components/User/Route/Routes";
import LiveMap from "../../components/User/LiveMap/LiveMap";
import Table from "../../designs/CRUD/Table";
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
    const [loading, setLoading] = useState(true);

    const notificationMapping = {
        "rides": "rides",
        "moved": "moved",
    };

    useEffect(() => {
        // Fetch all data: routes, trips, notifications
        const fetchData = async () => {
            try {
                const [routesData, tripsData, messagesData] = await Promise.all([
                    axiosInstance.get("api/routes/"),
                    axiosInstance.get("api/trips/"),
                    axiosInstance.get("api/messages/"),
                ]);
                
                setRoutes(routesData.data);
                setTrips(tripsData.data);
                setNotifications(messagesData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
    };

    const renderContent = () => {
        // If loading, show a loading message
        if (loading) {
            return <div>Loading...</div>;
        }

        // Default handling for notifications filtering
        const notificationCategory = notificationMapping[activeView];
        const filteredNotifications = notificationCategory
            ? notifications?.filter(
                (notification) => notification.category.toLowerCase() === notificationCategory.toLowerCase()
            )
            : [];

        switch (activeView) {
            case "dashboard":
                return <Dashboard trips={trips} />;
            case "rides":
                return (
                    <>
                        <Routes routes={routes} onSelectRoute={handleRouteSelect} />
                        {selectedRoute && <LiveMap route={selectedRoute} />}
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
            default:
                return <div>No data available</div>;
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
