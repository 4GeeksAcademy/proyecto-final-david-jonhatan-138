import { Navigate, useLocation } from "react-router-dom";

export const TokenReset = ({ children }) => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    if (!localStorage.getItem("tokenReset") || localStorage.getItem("tokenReset") !== query.get("tokenReset")) {
        
        return <Navigate to="/professional" replace />
    }

    return children
}