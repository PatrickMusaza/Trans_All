import React, { useState } from "react";
import "./Form.css";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../api/constants";
import { Alert } from "bootstrap/dist/js/bootstrap.bundle.min";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");

    const togglePasswordVisibility = (setter) => {
        setter((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const name = method === "login" ? "Sign In" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (method === "register" && password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post(route, { username, password });

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/dashboard");
            } else {
                navigate("/sign-in");
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="sign-in-form">
            <div className="input-group">
                <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email"
                    required
                />
                <span className="icon"><i className="fa-regular fa-envelope"></i></span>
            </div>
            <div className="input-group">
                <input
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="●●●●●●●●"
                    required
                    className={error && name === "Register" ? "error" : ""}
                />
                <span
                    className="icon toggle-icon"
                    onClick={() => togglePasswordVisibility(setPasswordType)}
                >
                    <i className={`fa-regular ${passwordType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                </span>
            </div>
            {name === "Register" && (
                <div className="input-group">
                    <input
                        type={confirmPasswordType}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className={error && name === "Register" ? "error" : ""}
                    />
                    <span
                        className="icon toggle-icon"
                        onClick={() => togglePasswordVisibility(setConfirmPasswordType)}
                    >
                        <i className={`fa-regular ${confirmPasswordType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                    </span>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <a href="/recover-password" className="recover-password-link">Recover Password?</a>
            <button className="sign-in-button" type="submit" disabled={loading}>
                {name}
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
    );
}

export default Form;