import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userServices from "../services/UserServices";
import toast from "react-hot-toast";
import { Users, ShieldAlert, CheckCircle, Search, UserPlus } from "lucide-react";

export const AdminUsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Estados para el Modal de Creación de Usuario
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        role: "professional",
        subscription_status: "active",
        category: ""
    });
    const [creating, setCreating] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userServices.getAllUsers();
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (error) {
            console.error("Error al cargar los usuarios:", error);
            toast.error("No se pudo cargar la lista de usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Función para actualizar roles o estados de suscripción de usuarios existentes
    const handleUpdateUser = async (userId, field, value) => {
        try {
            await userServices.updateUserField(userId, { [field]: value });
            setUsers(prevUsers =>
                prevUsers.map(user => user.id === userId ? { ...user, [field]: value } : user)
            );
            toast.success("Actualizado correctamente en la plataforma");
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            toast.error("No se pudo completar la actualización");
        }
    };

    // Función para manejar los inputs del formulario de creación
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Función para enviar la creación del nuevo usuario al backend
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const payload = {
                name: formData.name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                category: formData.category || "",
                biografi: formData.biografi || ""
            };

            // USAR SIEMPRE RUTA RELATIVA PURA PARA EVITAR CORS EN CODESPACE
            const response = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Error al registrar el usuario");
            }

            toast.success("¡Usuario creado con éxito!");
            setShowModal(false);
            setFormData({
                name: "",
                last_name: "",
                email: "",
                password: "",
                role: "professional",
                subscription_status: "active",
                category: ""
            });
            fetchUsers(); // Recargamos la tabla
        } catch (error) {
            console.error("Error al crear usuario:", error);
            toast.error(error.message || "No se pudo crear el usuario");
        } finally {
            setCreating(false);
        }
    };
    // Filtrar usuarios por nombre o email
    const filteredUsers = users.filter(user => {
        const fullName = `${user.name || ""} ${user.last_name || ""}`.toLowerCase();
        const email = (user.email || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term) || email.includes(term);
    });

    // Métricas rápidas
    const totalUsers = users.length;
    const professionalsCount = users.filter(u => u.role === "professional" || u.category).length;
    const activeSubsCount = users.filter(u => u.subscription_status === "active" || !u.subscription_status).length;
    const suspendedSubsCount = users.filter(u => u.subscription_status === "suspended").length;

    return (
        <div className="container py-5">
            {/* Cabecera del Panel */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="h3 fw-bold mb-1">Panel de Control (Dueños)</h1>
                    <p className="text-muted mb-0">Gestión de profesionales, accesos y control de suscripciones de la plataforma.</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setShowModal(true)}
                    >
                        <UserPlus size={18} /> Nuevo Usuario
                    </button>
                    <Link to="/professional" className="btn btn-outline-secondary">Volver al Dashboard</Link>
                </div>
            </div>

            {/* Tarjetas de Estadísticas / Resumen */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-1 font-monospace small">TOTAL USUARIOS</h6>
                                <h3 className="fw-bold mb-0">{totalUsers}</h3>
                            </div>
                            <Users className="text-primary opacity-75" size={32} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-1 font-monospace small">PROFESIONALES</h6>
                                <h3 className="fw-bold mb-0">{professionalsCount}</h3>
                            </div>
                            <Users className="text-dark opacity-75" size={32} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-1 font-monospace small">SUSCRIPCIONES ACTIVAS</h6>
                                <h3 className="fw-bold text-success mb-0">{activeSubsCount}</h3>
                            </div>
                            <CheckCircle className="text-success opacity-75" size={32} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-1 font-monospace small">SUSPENSIONES / BLOQUEOS</h6>
                                <h3 className="fw-bold text-danger mb-0">{suspendedSubsCount}</h3>
                            </div>
                            <ShieldAlert className="text-danger opacity-75" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <Search size={18} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Buscar profesional por nombre, apellido o correo electrónico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabla Principal de Gestión */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-uppercase fs-7">
                                <tr>
                                    <th className="py-3 ps-3">#ID</th>
                                    <th className="py-3">Profesional / Cliente</th>
                                    <th className="py-3">Correo Electrónico</th>
                                    <th className="py-3">Rol de Acceso</th>
                                    <th className="py-3">Estado Suscripción</th>
                                    <th className="py-3 pe-3">Especialidad / Nota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">Cargando registros de la plataforma...</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">No se encontraron usuarios que coincidan con la búsqueda.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="ps-3 fw-bold text-muted">#{user.id}</td>
                                            <td>
                                                <div className="fw-bold">{user.name || "Sin nombre"} {user.last_name || ""}</div>
                                            </td>
                                            <td className="text-muted">{user.email}</td>

                                            {/* Selector de Rol */}
                                            <td>
                                                <select
                                                    className="form-select form-select-sm fw-bold border-0 bg-light"
                                                    value={user.role || "user"}
                                                    onChange={(e) => handleUpdateUser(user.id, "role", e.target.value)}
                                                >
                                                    <option value="user">Cliente (User)</option>
                                                    <option value="professional">Profesional (Cliente SaaS)</option>
                                                    <option value="admin">Dueño (Admin)</option>
                                                </select>
                                            </td>

                                            {/* Selector de Estado de Suscripción */}
                                            <td>
                                                <select
                                                    className={`form-select form-select-sm fw-bold ${user.subscription_status === "suspended" ? "text-danger bg-danger-subtle" :
                                                        user.subscription_status === "pending" ? "text-warning bg-warning-subtle" : "text-success bg-success-subtle"
                                                        }`}
                                                    value={user.subscription_status || "active"}
                                                    onChange={(e) => handleUpdateUser(user.id, "subscription_status", e.target.value)}
                                                >
                                                    <option value="active">Activa (Al día)</option>
                                                    <option value="pending">Pendiente de pago</option>
                                                    <option value="suspended">Suspendida (Bloqueada)</option>
                                                </select>
                                            </td>

                                            <td className="pe-3 text-muted small">{user.biografi || user.category || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL DE CREACIÓN DE USUARIO */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">Crear Nuevo Usuario / Profesional</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreateUser}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Apellidos</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Contraseña Temporal</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Rol en la Plataforma</label>
                                            <select
                                                className="form-select"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="professional">Profesional (SaaS)</option>
                                                <option value="admin">Administrador (Dueño)</option>
                                                <option value="user">Cliente estándar</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Estado de Suscripción</label>
                                            <select
                                                className="form-select"
                                                name="subscription_status"
                                                value={formData.subscription_status}
                                                onChange={handleChange}
                                            >
                                                <option value="active">Activa</option>
                                                <option value="pending">Pendiente de pago</option>
                                                <option value="suspended">Suspendida</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Categoría / Especialidad (Opcional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="category"
                                                placeholder="Ej. Fisioterapia, Barbería, Reformas..."
                                                value={formData.category}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={creating}>
                                        {creating ? "Creando..." : "Crear Usuario"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersView;