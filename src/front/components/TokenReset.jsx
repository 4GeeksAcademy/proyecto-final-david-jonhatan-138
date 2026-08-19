import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const TokenReset = ({children}) =>{
    if (!localStorage.getItem("tokenReset")) {
        return <Navigate to="/professional" replace/>
    }
    
    return children
}