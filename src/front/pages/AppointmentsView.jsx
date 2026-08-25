import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ProfessionalCalendar from "../components/ProfessionalCalendar.jsx";

export const AppointmentsView = () => {
    const { store } = useGlobalReducer();
    const profile = store.user || {};
    
    const services = Array.isArray(store.servicesList) && store.servicesList.length > 0
        ? store.servicesList[0]
        : [];

    const clients = Array.isArray(store.clientsList) && store.clientsList.length > 0
        ? store.clientsList[0]
        : [];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-6">Gestión de Citas y Agenda</h1>
                    <p className="text-muted">Administra, crea y modifica las citas de tu negocio.</p>
                </div>
                <Link to="/professional" className="btn btn-outline-primary">Volver al Dashboard</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Se renderiza una única vez de forma limpia */}
                    <ProfessionalCalendar
                        services={services}
                        clients={clients}
                        userId={profile?.id || 1}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppointmentsView;