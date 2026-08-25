import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState, useEffect } from "react";
import servicesServices from "../services/ServicesServices";
import appointmentsServices from "../services/AppointmentServices.jsx";
import toast from "react-hot-toast";
import { SquarePen, Trash2 } from "lucide-react";
import { Services } from "../components/Services.jsx";
import ProfessionalCalendar from "../components/ProfessionalCalendar.jsx";
import { Clients } from "../components/Clients.jsx";

export const Professional = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const profile = store.user || {}; 
    const services = Array.isArray(store.servicesList) && store.servicesList.length > 0
        ? store.servicesList[0]
        : [];

    const clients = Array.isArray(store.clientsList) && store.clientsList.length > 0
        ? store.clientsList[0]
        : [];

    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    const userId = profile?.id;

    // --- Cargar las citas desde el backend ---
    const fetchAppointmentsList = async () => {
        if (!userId) {
            setLoadingAppointments(false);
            return;
        }
        try {
            setLoadingAppointments(true);
            const response = await appointmentsServices.getAppointmentsByUser(userId);
            setAppointments(response?.appointments || []);
        } catch (error) {
            console.error("Error al cargar las citas para la tabla:", error);
        } finally {
            setLoadingAppointments(false);
        }
    };

    useEffect(() => {
        fetchAppointmentsList();
    }, [userId]);

    // --- NUEVO: Función para eliminar una cita directamente desde la tabla ---
    const handleDeleteAppointment = async (appointmentId) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta cita?");
        if (!confirmed) return;

        try {
            const success = await appointmentsServices.deleteAppointment(appointmentId);
            if (success) {
                // Actualizamos el estado localmente para que desaparezca al instante de la tabla
                setAppointments(prev => prev.filter(app => app.id !== appointmentId));
                toast.success("Cita eliminada correctamente");
            }
        } catch (error) {
            console.error("Error al borrar cita desde la tabla:", error);
            toast.error("No se pudo eliminar la cita");
        }
    };

    return (
        <>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="display-6">Dashboard profesional</h1>
                        <p className="text-muted">Resumen de citas, servicios y clientes.</p>
                    </div>
                    <Link to="/" className="btn btn-outline-primary">Volver al inicio</Link>
                </div>

                <div className="row gy-4">
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Perfil</h5>
                                <p className="mb-1"><strong>Nombre: </strong>{`${profile.name || ''} ${profile.last_name || ''}`}</p>
                                <p className="mb-1"><strong>Categoría:</strong> {profile.category}</p>
                                <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                                <p className="mb-0"><strong>Rol:</strong> {profile.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-8">
                        <div className="row g-3">
                            <div className="col-4">
                                <div className="card text-white bg-primary h-100 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title">Clientes</h6>
                                        <p className="display-6 mb-0">{clients.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card text-white bg-success h-100 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title">Servicios</h6>
                                        <p className="display-6 mb-0">{services.length || "0"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card text-white bg-info h-100 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title">Próximas citas</h6>
                                        <p className="display-6 mb-0">{appointments.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row gy-4 mt-4">
                    <div className="col-12 col-xl-6">
                        <Services services={services}></Services>
                    </div>
                    <div className="col-12 col-xl-6">
                        <Clients clients={clients}></Clients>
                    </div>
                </div>

                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Próximas citas</h5>
                            <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => navigate("/appointments")} 
                            >
                                Gestionar agenda
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente</th>
                                        <th>Servicio</th>
                                        <th>Hora</th>
                                        <th>Estado</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingAppointments ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-3 text-muted">Cargando citas...</td>
                                        </tr>
                                    ) : appointments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-3 text-muted">No hay citas registradas todavía.</td>
                                        </tr>
                                    ) : (
                                        appointments.map(appointment => {
                                            const client = clients.find(c => c.id === appointment.client_id);
                                            const service = services.find(s => s.id === appointment.service_id);
                                            const formattedDate = new Date(appointment.start_time).toLocaleString();

                                            return (
                                                <tr key={appointment.id}>
                                                    <td>{appointment.id}</td>
                                                    <td>{client ? client.full_name : `Cliente #${appointment.client_id}`}</td>
                                                    <td>{service ? service.title : `Servicio #${appointment.service_id}`}</td>
                                                    <td>{formattedDate}</td>
                                                    <td>
                                                        <span className={`badge ${appointment.status === "confirmed" ? "bg-success" : appointment.status === "pending" ? "bg-warning text-dark" : "bg-danger"}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        {/* Botón para eliminar directamente desde la tabla */}
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                                            title="Eliminar cita"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="card shadow-sm mt-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="card-title mb-0">Agenda interactiva</h5>
                                        <small className="text-muted">Crea, edita y elimina citas directamente sobre el calendario.</small>
                                    </div>
                                </div>
                                <ProfessionalCalendar
                                    services={services}
                                    clients={clients}
                                    userId={profile?.id || 1}
                                    onAppointmentChange={fetchAppointmentsList}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};