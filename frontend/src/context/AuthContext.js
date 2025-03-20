import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get("https://personal-expense-tracker-jnqb.onrender.com/api/auth/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, []);

    // 🔹 Logout Function
    const logout = () => {
        localStorage.removeItem("token");  // Remove token from storage
        setUser(null);  // Clear user state
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};