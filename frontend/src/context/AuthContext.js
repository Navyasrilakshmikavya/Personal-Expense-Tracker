import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // ✅ FIX: Add a loading state to track the initial auth check
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get("http://localhost:8080/api/auth/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    // ✅ FIX: If token is invalid, remove it from storage
                    localStorage.removeItem("token"); 
                    setUser(null);
                }
            }
            // ✅ FIX: Mark loading as false after the check is complete
            setLoading(false);
        };
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // ✅ FIX: Pass the loading state in the provider's value
    const value = { user, setUser, loading, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

