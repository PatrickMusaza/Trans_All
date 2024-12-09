import React, { useState, useEffect } from "react";
import Dashboard from "../../components/User/Dashboard/Dashboard";
import TopNav from "../../components/User/TopNav/TopNav"
import Routes from "../../components/User/Route/Routes";
import LiveMap from "../../components/User/LiveMap/LiveMap";
import Table from "../../components/User/Table/Table";
import Sidebar from "../../components/User/Sidebar/Sidebar";
import axiosInstance from "../../api/axios";
import "./User.css";

function User() {
    const [activeView, setActiveView] = useState("dashboard");
    const [routes, setRoutes] = useState([]);
    const [trips, setTrips] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

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
    }, []);


    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
    };

    const renderContent = () => {
        switch (activeView) {
            case "dashboard":
                return (
                    <>
                        <Dashboard trips={trips} />
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
            default:
                return <alert>hy</alert>;
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

export default User;
