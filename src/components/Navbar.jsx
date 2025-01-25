import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';  // Ensure Boxicons are correctly loaded
import "../styles/Navbar.css";  // Make sure the path to your CSS is correct

function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    return (
        <div className="navbar">
            {/* Left Side: Elderly Connect */}
            <div className="leftSide">
                <div className="navbar-logo">
                    <i className="bx bxs-heart"></i> {/* Heart icon from Boxicons */}
                    <span>Elderly Connect</span>
                </div>
            </div>

            {/* Right Side: Menu Links */}
            <div className={`rightSide ${openLinks ? "open" : ""}`}>
                <Link to="/">
                    <i className="bx bxs-home"></i> Home
                </Link>
                <Link to="/user">
                    <i className="bx bxs-user"></i> User
                </Link>
                <Link to="/volunteerlogin">
                    <i className="bx bxs-user"></i> Volunteer
                </Link>
                <Link to="/login">
                    <i className="bx bxs-log-in"></i> Login
                </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button onClick={toggleNavbar} className="menu-toggle">
                <i className="bx bx-menu"></i> {/* Menu icon */}
            </button>
        </div>
    );
}

export default Navbar;
