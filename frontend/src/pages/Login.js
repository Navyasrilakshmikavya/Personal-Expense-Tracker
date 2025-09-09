import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { APIUrl, handleError, handleSuccess } from "../utils";
import './Login.css'
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const { setUser } = useContext(AuthContext); // Access AuthContext
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError("Email and password are required");
        }

        try {
            const response = await fetch(`${APIUrl}/api/auth/login`,  {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            const { success, message, jwtToken, name, role, error } = result;
            console.log(result)
            if (success) {
                handleSuccess(message);
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("loggedInUser", name);
                localStorage.setItem("role", role||"user");

                setUser({ name, role, token: jwtToken }); // Set user in context
                console.log("role", role)
                setTimeout(() => {
                    if (role === "admin") {
                        navigate("/admin"); // Redirect Admin
                    } else {
                        navigate("/expenses"); // Redirect Normal User
                    }
                }, 1000);
            } else {
                handleError(error?.message || message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={loginInfo.password}
                    />
                </div>
                <button type="submit">Login</button>
                <span>
                    Don't have an account?
                    <Link to="/signup"> Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;