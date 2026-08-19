// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useNavigate, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useState } from "react";
import { loginService } from "../services/AuthServices";
import clientsServices from "../services/ClientsServices";
import servicesServices from "../services/ServicesServices";
import { sendMessage } from "../services/SendMessageServices"
import toast from "react-hot-toast";


export const Login = props => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [email, setEmail] = useState("");


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

    const handleSubmitEmail = (e) => {
        e.preventDefault();
        const modalEl = document.getElementById("emailModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
        sendMessage({ email: email })
		const tokenReset = crypto.randomUUID()
		localStorage.setItem("tokenReset", tokenReset)
        localStorage.setItem("email", email)
		toast.success("Correo de recuperacion envido correctamente")
    };

    return (
        <>
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

                        <button type="button" className="text-primary border-0 bg-transparent w-100" data-bs-toggle="modal" data-bs-target="#emailModal">Olvide la contraseña</button>
                    </form>

                </div>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="emailModal"
                tabIndex="-1"
                aria-labelledby="emailModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="emailModalLabel">
                                Recuperar Contraseña
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <form onSubmit={handleSubmitEmail}>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>

                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )

};