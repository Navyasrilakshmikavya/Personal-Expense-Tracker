import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000, // ✅ Ensure toast disappears automatically
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false, // ✅ If you don't want an icon
    });
};

export const handleError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000, // ✅ Added auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const APIUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
