import React, { useState } from "react";
import toast from "react-hot-toast";
import { getUserByEmail, updateUserService } from "../services/AuthServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export function ResetPass() {
    const { store } = useGlobalReducer();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            return toast.error("El campo contraseña no puede estar vacio")
        }
        if (password !== confirm) {
            return toast.error("Las contraseñas no coinciden")
        }
        if (!localStorage.getItem("email")) {
            updateUserService(store.user.id, {password: password})
        }else{
            let data = await getUserByEmail({email: localStorage.getItem("email")})
            updateUserService(data[0].user.id, {password: password})
        }
        localStorage.removeItem("tokenReset")
        localStorage.removeItem("email")
        toast.success("Contraseña actualizada correctamente")
        setTimeout(()=>{
            navigate("/professional");
        },3000)

    };

    
    return (
        <div className="d-flex justify-content-center">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px" }}>
                <h4 className="mb-3">Resetear contraseña</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Guardar nueva contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}
