import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Feature.css';

const features = [
    { title: "Quality", description: "We ensure the best quality services" },
    { title: "Fast", description: "We ensure you the best fast services" },
    { title: "Safe", description: "Safe and on-time delivery" }
];

const FeaturesSection = () => {
    return (
        <div className="features-section py-5">
            <h2 className="text-center mb-5">Transport <span className="text-primary-feature">Solution</span> for everyone</h2>
            <div className="row">
                {features.map((feature, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="card shadow-sm p-3">
                            <h4>{feature.title}</h4>
                            <p>{feature.description}</p>
                            <button className="btn btn-link">Read More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;
