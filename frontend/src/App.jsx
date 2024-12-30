import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axiosInstance from './api/axios';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ContactUs from './pages/Contact Us/ContactUs';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound/NotFound';
import AboutPage from './pages/About/About';
import User from './pages/User/User';
import Services from './pages/Services/Services';
import LiveMapDetails from './components/User/LiveMap/LiveMap';
import Confirmation from './components/User/Confirmation/Confirmation';
import { BookPage } from './pages/Book/Book';
import Driver from './pages/Driver/Driver';
import BookingConfirmation from './components/User/Confirmation/Confirmation';

function Logout() {
    localStorage.clear();
    return <Navigate to="/sign-in" />;
}

const App = () => {
    const location = useLocation();
    const [users, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const user = {
        role: localStorage.getItem("USER_ROLE")
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get('api/users/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setUser(response.data); // Set user data
                } else {
                    console.error('Failed to fetch user profile:', response.status);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false); // If no token, set loading to false
        }
    }, [token]);

    const standalonePages = ['/users', '/dashboard', '/live-map', '/drivers','/confirm'];
    const isStandalonePage = standalonePages.includes(location.pathname);

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div className="app">
            {!isStandalonePage && <Header />}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/confirm" element={<BookingConfirmation />} />
                <Route path="*" element={<NotFound />} />

                {/* Protected Routes */}
                <Route
                    path="/users"
                    element={
                        user && (user.role === 'user' || user.role === 'client') ? (
                            <ProtectedRoute>
                                <User />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/sign-in" />
                        )
                    }
                />
                <Route
                    path="/live-map"
                    element={
                        user && (user.role === 'user' || user.role === 'client') ? (
                            <ProtectedRoute>
                                <LiveMapDetails />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/sign-in" />
                        )
                    }
                />
                <Route
                    path="/confirmation"
                    element={
                        user && (user.role === 'user' || user.role === 'client') ? (
                            <ProtectedRoute>
                                <Confirmation />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/sign-in" />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        user && (user.role === 'staff') ? (
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/sign-in" />
                        )
                    }
                />
                <Route
                    path="/drivers"
                    element={
                        user && (user.role === 'driver') ? (
                            <ProtectedRoute>
                                <Driver />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/sign-in" />
                        )
                    }
                />

            </Routes>
            {!isStandalonePage && <Footer />}
        </div>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
