import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', href: '/' },
        {
            name: 'Services', href: '/services', dropdown: true, items: [
                { name: 'Transport', href: '#' },
                { name: 'Logistic', href: '#' },
                { name: 'Route', href: '#' },
                { name: 'Fleet', href: '#' },
                { name: 'Stations', href: '#' },
            ]
        },
        { name: 'Book', href: '/book' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust the offset to match your hero section height
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
                <div className="container-fluid">
                    <a className="navbar-brand brand-logo" href="/">
                        <i className="fas fa-bus brand-icon"></i>TransConnect
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                    >
                        <span className={isMenuOpen ? 'fas fa-times' : 'navbar-toggler-icon'}></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {navLinks.map((link, index) => (
                                link.dropdown ? (
                                    <li className="nav-item dropdown" key={index}>
                                        <a
                                            className={`nav-link dropdown-toggle ${location.pathname === link.href ? 'active' : ''
                                                }`}
                                            href={link.href}
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {link.name}
                                        </a>
                                        <ul className="dropdown-menu">
                                            {link.items.map((item, idx) => (
                                                <li key={idx}>
                                                    <a className="dropdown-item" href={item.href}>
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ) : (
                                    <li className="nav-item" key={index}>
                                        <a
                                            className={`nav-link ${location.pathname === link.href ? 'active' : ''
                                                }`}
                                            href={link.href}
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                )
                            ))}
                        </ul>
                        <form className="d-flex search" role="search">
                            <input
                                className="form-control me-2 search-input"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                        </form>
                            <i className="fas fa-search search-icon"></i>
                        <a href="/sign-in">
                            <button className="btn btn-primary get-started-btn">
                                Get Started
                            </button>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
