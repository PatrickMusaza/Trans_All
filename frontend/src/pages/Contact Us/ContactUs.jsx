import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axios";
import ContactUsBackground from "../../components/Contact/Background";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./ContactUs.css";

const leftVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const rightVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const categories = ["Feedback","Users", "Drivers", "Routes","Rides","Clients","Drivers","Vehicles","Agencies"];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to your API
      await axiosInstance.post("api/messages/add/", formData);

      // Show success toast
      setToastMessage("We have received your message and will reach out to you soon.");
      setShowToast(true);

      // Clear form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending data:", error);
      setToastMessage("An error occurred. Please try again later.");
      setShowToast(true);
    }
  };

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
                <span className="me-2"><i className="fab fa-facebook"></i></span>
                <a href="#" className="social-link">
                  TransConnect Rwanda
                </a>
              </p>
              <p>
                <span className="me-2"><i className="fab fa-instagram"></i></span>
                <a href="#" className="social-link">
                  TransConnect Official
                </a>
              </p>
              <p>
                <span className="me-2"><i className="fab fa-twitter"></i></span>
                <a href="#" className="social-link">
                  Transconnect Rwanda
                </a>
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
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name*"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Phone Number*"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Subject*"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category*</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Your message..."
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
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

      {/* Toast Notification */}
      <div
        className={`toast-container position-fixed bottom-0 end-0 p-3`}
        style={{ zIndex: 1050 }}
      >
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Notification</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
