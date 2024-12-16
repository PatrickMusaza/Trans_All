import React from "react";
import busImage from "../../assets/images/download.jpg";
import "./Services.css";

const services = [
  {
    name: "Transport", href: "#transport",
    content: "Our transport services are designed to meet the highest standards of safety and efficiency. Whether you're shipping goods across the country or internationally, we ensure secure and timely deliveries with a fleet of modern vehicles and experienced drivers.",
    features: [
      "Reliable fleet of modern vehicles.",
      "Experienced and licensed drivers.",
      "Timely and secure delivery of goods.",
      "24/7 tracking and customer support.",
      "Cost-effective transport solutions.",
    ],
    image: busImage
  },
  {
    name: "Logistic",
    href: "#logistic",
    features: [
      "End-to-end inventory management.",
      "Real-time tracking and analytics.",
      "Flexible warehousing solutions.",
      "Scalable services for all business sizes.",
      "Dedicated logistic experts.",
    ],
    content: "Our logistic solutions cover everything from warehousing to inventory management and order fulfillment. We use advanced tracking systems to provide real-time updates, ensuring seamless operations for businesses of all sizes.",
    image: busImage
  },
  {
    name: "Route",
    href: "#route",
    features: [
      "Traffic pattern analysis for efficiency.",
      "Advanced route optimization technology.",
      "Cost and time savings.",
      "Environmental sustainability through reduced emissions.",
      "Support for complex delivery networks.",
    ],
    content: "With our intelligent route planning, we help you optimize your journeys to save time and reduce costs. Our cutting-edge technology analyzes traffic patterns and road conditions to provide the most efficient routes.",
    image: busImage
  },
  {
    name: "Fleet",
    href: "#fleet",
    features: [
      "Wide range of vehicle sizes and capacities.",
      "Regular maintenance for reliability.",
      "Customizable fleet options.",
      "Equipped with advanced safety features.",
      "Trained and experienced drivers.",
    ],
    content: "Our extensive fleet of vehicles is equipped to handle diverse transportation needs. From small vans to large trucks, we offer reliable and well-maintained vehicles that ensure the safe and efficient movement of goods.",
    image: busImage
  },
  {
    name: "Stations",
    href: "#stations", features: [
      "Modern facilities for storage and transit.",
      "Real-time operational tracking.",
      "Proximity to major routes and hubs.",
      "Highly skilled station staff.",
      "Support for multi-modal logistics.",
    ],
    content: "Our strategically located stations act as hubs for your logistics operations. Equipped with modern facilities and staffed by experienced personnel, they support smooth and efficient transitions along your supply chain.",
    image: busImage
  },
];

const ServicesPage = () => {
  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="services-page">
      {/* Navigation Bar */}
      <nav className="services-nav">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => scrollToSection(service.href)}
            className="nav-link"
          >
            {service.name}
          </button>
        ))}
      </nav>

      {/* Service Sections */}
      <div className="services-container">
        {services.map((service) => (
          <section id={service.href.substring(1)} className="service-section" key={service.name}>
            <img src={service.image} alt={service.name} className="service-image" />
            <div className="service-content">
              <h2>{service.name}</h2>
              <p>{service.content}</p>
              <ul className="features-list">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
