import React, { useState } from "react";
import toast from "react-hot-toast";

export function ResetPass() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirm) {
            return toast.error("Las contraseñas no coinciden")
        }
        toast.success("Contraseña actualizada correctamente")
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
