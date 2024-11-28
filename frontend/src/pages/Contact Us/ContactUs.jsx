import React from "react";
import { motion } from "framer-motion";
import ContactUsBackground from "../../components/Contact/Background";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactUs.css";

const leftVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } }
};

const rightVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } }
};

const ContactUs = () => {
    return (
        <>
            <ContactUsBackground />
            <div className="container py-5 contact-us-container">
                <div className="row">
                    {/* Left Section */}
                    <motion.div
                        className="col-md-6 d-flex flex-column justify-content-center contact-left"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={leftVariants}
                    >
                        <h2 className="mb-4">Let's talk with us</h2>
                        <p className="mb-4">
                            Questions, comments, or suggestions? Simply fill in the form
                            and we'll be in touch shortly.
                        </p>
                        <div className="social-links">
                            <p>
                                <span className="me-2">📘</span>
                                <a href="#" className="social-link">TransConnect Rwanda</a>
                            </p>
                            <p>
                                <span className="me-2">📸</span>
                                <a href="#" className="social-link">TransConnect Official</a>
                            </p>
                            <p>
                                <span className="me-2">🔗</span>
                                <a href="#" className="social-link">Transconnect Rwanda</a>
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Section */}
                    <motion.div
                        className="col-md-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={rightVariants}
                    >
                        <div className="contact-form bg-white p-4 rounded shadow">
                            <form>
                                <div className="row mb-3">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name*"
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name*"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email*"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Phone Number*"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        placeholder="Your message..."
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
