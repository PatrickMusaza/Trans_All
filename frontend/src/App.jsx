import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigation, Navigate } from 'react-router-dom';
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
import ViewProfile from './components/Admin/Profile/ViewProfile';
import TopNav from './components/Admin/TopNav/TopNav';
import Sidebar from './components/Admin/Sidebar/Sidebar';
import User from './pages/User/User';

function Logout() {
    localStorage.clear()
    return <Navigate to='/sign-in' />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <SignUp />
}

const App = () => {

    const location = useLocation();
    const user = {
        avatar: "https://via.placeholder.com/120",
        name: "John Doe",
        email: "john.doe@example.com",
        details: {
            Address: "123 Main Street, Springfield",
            Phone: "+1 234 567 890",
            "Date of Birth": "1990-01-01",
            "Membership Status": "Gold Member",
        },
    };

    const det = {
        avatar: "https://via.placeholder.com/120",
        name: "John Doe",
        email: "john.doe@example.com",
        details: {
            Address: "123 Main Street, Springfield",
            Phone: "+1 234 567 890",
            "Date of Birth": "1990-01-01",
            "Membership Status": "Gold Member",
        },
    };

    const standalonePages = ['/dashboard', '/profile_view', '/users'];

    const isStandalonePage = standalonePages.includes(location.pathname);

    return (
        <div className="app">
            {!isStandalonePage && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />

                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
                />
                <Route path='/profile_view' element={
                    <ProtectedRoute>
                        <TopNav />
                        <Sidebar />
                        <ViewProfile user={user} />
                    </ProtectedRoute>
                }
                />

                <Route path='/users' element={<User />} />

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
