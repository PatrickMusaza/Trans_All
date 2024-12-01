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

    const standalonePages = ['/dashboard',];

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
