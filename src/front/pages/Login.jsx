// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useNavigate, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useState } from "react";
import { loginService } from "../services/AuthServices";
import clientsServices from "../services/ClientsServices";
import servicesServices from "../services/ServicesServices";

export const Login = props => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const [data, error] = await loginService(form);

        if (error) {
            alert(error);
            return;
        }

        dispatch({ type: "login", payload: { token: data.token, user: data.user } });
        try {
            const dataClients = await clientsServices.getAllClientsByUser(data.user.id)
            const dataServices = await servicesServices.getAllServicesByUser(data.user.id)
            dispatch({ type: 'setClients', payload: dataClients })
            dispatch({ type: 'setServices', payload: dataServices })
        } catch (error) {
            toast.error("Services didn't work.")
        }
        navigate("/professional");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow p-2" style={{ maxWidth: "380px", width: "100%" }}>

                <h3 className="text-center mb-4">Iniciar sesión</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" name="email" placeholder="tuemail@ejemplo.com" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" name="password" placeholder="••••••••" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Entrar</button>

                    <div className="text-center mt-3">
                        <Link to="/signup" className="text-decoration-none">Crear Cuenta</Link>
                    </div>
                </form>

            </div>
        </div>
    )

};