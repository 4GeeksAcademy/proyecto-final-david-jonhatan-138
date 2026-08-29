import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { loginService, signinService } from "../services/AuthServices";

export default function Signin() {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", name: "", last_name: "", password: "", category: "", biografi: "", role: "professional"});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [data, error] = await signinService(form);

        if (error) {
            alert(error);
            return;
        }
        dispatch({ type: "login", payload: { token: data.token, user: data.user } });
        window.location = data.url
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div
                className="card shadow p-4"
                style={{ maxWidth: "380px", width: "100%" }}
            >
                <h3 className="text-center mb-4">Crear cuenta</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" name="email" placeholder="tuemail@ejemplo.com" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" name="name" placeholder="Nombre" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input type="text" className="form-control" name="last_name" placeholder="Apellido" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" name="password" placeholder="••••••••" required onChange={handleChange} />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Categoria</label>
                        <input type="text" className="form-control" name="category" placeholder="Categoria" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Biografia</label>
                        <textarea type="text" className="form-control" name="biografi" placeholder="Biografia" onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        Registrarse
                    </button>

                    <div className="text-center mt-3">
                        <a href="#" className="text-decoration-none">
                            ¿Ya tienes cuenta? Inicia sesión
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}