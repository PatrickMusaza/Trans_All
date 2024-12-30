import React, { useEffect, useRef } from 'react';
import './Stats.css';

const stats = [
    { icon: "fa-bus", count: 400, label: "Vehicles" },
    { icon: "fa-route", count: 250, label: "Routes" },
    { icon: "fa-handshake", count: 50, label: "Partners" },
    { icon: "fa-users", count: 3000, label: "Users" }
];

const StatsSection = () => {
    const statsRef = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            const endValue = parseInt(element.dataset.target, 10);
                            const increment = Math.ceil(endValue / 100);
                            let currentValue = 0;

                            const counter = setInterval(() => {
                                currentValue += increment;
                                if (currentValue >= endValue) {
                                    currentValue = endValue;
                                    clearInterval(counter);
                                }
                                element.innerText = currentValue;
                            }, 20);

                            observer.unobserve(element); 
                        }
                    });
                },
                { threshold: 0.5 } 
            );

            statsRef.current.forEach((ref) => observer.observe(ref));
        };

        handleScroll();
    }, []);

    return (
        <div className="stats-section py-5 text-center bg-dark text-white">
            <div className="container">
                <div className="row">
                    {stats.map((stat, index) => (
                        <div className="col-md-3" key={index}>
                            <i className={`fas ${stat.icon} display-4`}></i>
                            <h3
                                className="mt-3 counter"
                                ref={(el) => (statsRef.current[index] = el)}
                                data-target={stat.count}
                            >
                                0
                            </h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
