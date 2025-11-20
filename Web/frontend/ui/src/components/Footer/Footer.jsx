import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-container">
            {/* Footer Main Section */}
            <div className="footer-main">
                {/* Details and Social Icons */}
                <div className="footer-section">
                    <h3>
                        <i className="fas fa-bus"></i>
                        TransConnect</h3>
                    <p>We provide exceptional services to help you grow.</p><br /><br />
                    <div className="social-icons">
                        <i className="fab fa-facebook"></i>
                        <i className="fab fa-twitter"></i>
                        <i className="fab fa-instagram"></i>
                    </div>
                </div>

                {/* Pages */}
                <div className="footer-section">
                    <h3>Pages</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/about-us">About</a></li>
                        <li><a href="/book">Book Seat</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Phone: +250 798 219 444</p>
                    <p>Email: info@transconnect.com</p>
                    <p>Address: 123 Main Street, City</p>
                </div>

                {/* Map */}<div className="footer-section">
                    <h3>Our Location</h3>
                    <iframe
                        title="map"
                        className="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.4554373634027!2d30.06191732556484!3d-1.9440792971018545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7f674ae6b3d%3A0x63ed3c2c8df7e6a9!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1690039321658!5m2!1sen!2sus"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>

            </div>

            {/* Footer Bottom Section */}
            <div className="footer-bottom">
                <p>&copy; {new Date().toLocaleDateString("en-GB", {year: 'numeric' })} TransConnect | Powered by Patrick Designs | All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
