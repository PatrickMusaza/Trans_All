// Routes.jsx
import React, {useState,useEffect} from "react";
import "./Routes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Routes = () => {
  const [routes, setRoutes] = useState([]); // Ensure `routes` starts as an empty array

  useEffect(() => {
    // Simulate fetching data from an API or database
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/routes"); // Replace with your actual API endpoint
        const data = await response.json();
        setRoutes(data); // Ensure the response is an array
      } catch (error) {
        console.error("Error fetching routes:", error);
        setRoutes([]); // Fallback to an empty array if there's an error
      }
    };

    fetchRoutes();
  }, []);

  if (!Array.isArray(routes)) {
    console.error("routes is not an array:", routes);
    return <div>Invalid data format for routes</div>;
  }

  return (
    <div>
      <h1>Available Routes</h1>
      <ul>
        {routes.map((route, index) => (
          <li key={index}>{route.name}</li> // Ensure each route object has a `name` property
        ))}
      </ul>
    </div>
  );
};

export default Routes;
