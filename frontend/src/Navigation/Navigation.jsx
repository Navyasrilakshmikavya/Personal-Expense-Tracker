import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook for redirection

  const handleLogout = () => {
    logout();  // Call logout function
    navigate("/");  // Redirect to Home after logout
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>

      {/* Show Login and Signup only if the user is NOT logged in */}
      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}

      {/* Show Dashboard & Logout only if the user IS logged in */}
      {user && (
        <>
          <Link to={user.role === "admin" ? "/admin" : "/expenses"}>Dashboard</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navigation;
