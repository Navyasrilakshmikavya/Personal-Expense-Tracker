import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";  
import Navigation from "./Navigation/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Expenses from "./pages/Expenses";
import AdminPanel from "./pages/AdminPanel";

function PrivateRoute({ element, allowedRoles, user }) {
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/home" />;
  return element;
}

function App() {
  const { user } = useContext(AuthContext);  

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />

       

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} allowedRoles={["admin"]} user={user} />} />
      </Routes>
    </>
  );
}

export default App;
