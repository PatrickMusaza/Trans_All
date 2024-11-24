import React, { useState } from "react";
import "./Form.css";

const SignInForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="sign-in-container">
            <div className="left-section">
                <h1>Sign In to Recharge Direct</h1>
                <p>
                    If you don’t have an account
                    <a href="/register" className="register-link"> Register here!</a>
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
                            type={passwordVisible ? "text" : "password"}
                            placeholder="●●●●●●●●"
                        />
                        <span
                            className="icon password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            <i className={`fa-regular ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                    </div>
                    <a href="/recover-password" className="recover-password-link">Recover Password?</a>
                    <button className="sign-in-button">
                        <a href="/dashboard">
                            Sign In
                        </a>
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

export default SignInForm;
