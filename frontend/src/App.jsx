import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ContactUs from './pages/Contact Us/ContactUs';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound/NotFound';
import TopNav from './components/Admin/TopNav/TopNav';

const App = () => {

    const location = useLocation();

    const standalonePages = ['/dashboard','/drivers'];

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/drivers" element={<TopNav />} />
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
