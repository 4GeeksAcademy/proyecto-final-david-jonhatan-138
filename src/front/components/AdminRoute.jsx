import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const AdminRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    const user = store.user || {};

    // Comprobamos si el usuario logueado tiene el rol de administrador
    const isAdmin = user && user.role === "admin";

    if (!isAdmin) {
        // Si no es admin, lo redirigimos fuera del panel de control
        return <Navigate to="/professional" replace />;
    }

    return children;
};