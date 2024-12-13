// Services.jsx
import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <h1 className="services-title">Our Services</h1>
      <div className="services-grid">
        <ServiceCard
          title="Transport"
          content="We provide reliable public transport services connecting various locations efficiently. Our fleet is equipped with modern amenities to ensure a comfortable journey."
        />
        <ServiceCard
          title="Logistics"
          content="Our logistics services ensure timely delivery of goods across the region. With a dedicated team and advanced tracking systems, we guarantee the safety of your cargo."
        />
        <ServiceCard
          title="Route"
          content="Explore our extensive network of routes designed for maximum convenience. Whether you're commuting or traveling, we have the best routes to suit your needs."
        />
        <ServiceCard
          title="Fleet"
          content="Our fleet features a variety of vehicles, from buses to vans, ensuring we meet the diverse needs of our passengers. All vehicles are regularly maintained for safety."
        />
        <ServiceCard
          title="Stations"
          content="Our strategically located stations provide easy access to transport services. Each station is equipped with amenities to make your wait comfortable."
        />
      </div>
    </div>
  );
};

const ServiceCard = ({ title, content }) => {
  return (
    <div className="service-card">
      <h2 className="service-title">{title}</h2>
      <p className="service-content">{content}</p>
    </div>
  );
};

export default Services;
