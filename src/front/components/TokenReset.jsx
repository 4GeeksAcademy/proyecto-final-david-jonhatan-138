import { Navigate, useLocation } from "react-router-dom";

export const TokenReset = ({ children }) => {
    console.log("Storage: "+localStorage.getItem("tokenReset"));
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    console.log("Url: " + query.get("tokenReset"));
    console.log(localStorage.getItem("tokenReset") === query.get("tokenReset"));
    if (!localStorage.getItem("tokenReset") || localStorage.getItem("tokenReset") !== query.get("tokenReset")) {
        console.log("entra");
        
        return <Navigate to="/professional" replace />
    }

    return children
}