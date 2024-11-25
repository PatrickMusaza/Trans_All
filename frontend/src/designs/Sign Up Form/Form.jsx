import React, { useState } from "react";
import "./Form.css";

const SignUpForm = () => {
    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");

    const togglePasswordVisibility = (setter) => {
        setter((prevType) => (prevType === "password" ? "text" : "password"));
    };

    return (
        <div className="sign-in-container">
            <div className="left-section">
                <h1>Sign Up to Continue with TransConnect</h1>
                <p>
                    If you already have an account
                    <a href="/sign-in" className="register-link"> Sign In here!</a>
                </p>
            </div>
            <div className="right-section">
                <form className="sign-in-form">
                    <div className="input-group">
                        <input type="email" placeholder="Enter Email" />
                        <span className="icon"><i className="fa-regular fa-envelope"></i></span>
                    </div>
                    <div className="input-group">
                        <input
                            type={passwordType}
                            placeholder="Password"
                        />
                        <span
                            className="icon toggle-icon"
                            onClick={() => togglePasswordVisibility(setPasswordType)}
                        >
                            <i className={`fa-regular ${passwordType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <input
                            type={confirmPasswordType}
                            placeholder="Confirm Password"
                        />
                        <span
                            className="icon toggle-icon"
                            onClick={() => togglePasswordVisibility(setConfirmPasswordType)}
                        >
                            <i className={`fa-regular ${confirmPasswordType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>
                    <a href="/recover-password" className="recover-password-link">Recover Password?</a>
                    <button type="submit" className="sign-in-button">
                        <a href="/sign-in">Sign Up</a>
                    </button>
                    <div className="divider">
                        <span>Or continue with</span>
                    </div>
                    <div className="social-buttons">
                        <button className="social-button google">
                            <span className="fa-brands fa-google"></span>
                        </button>
                        <button className="social-button apple">
                            <span className="fa-brands fa-apple"></span>
                        </button>
                        <button className="social-button facebook">
                            <span className="fa-brands fa-facebook"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
