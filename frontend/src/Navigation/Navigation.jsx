import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("role");
        navigate("/");  // Redirect to Home after logout
    };

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>

            {/* Show Login and Signup only if the token is NOT in localStorage */}
            {!token ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </>
            ) : (
                <>
                    <Link to={role === "admin" ? "/admin" : "/expenses"}>Dashboard</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navigation;
