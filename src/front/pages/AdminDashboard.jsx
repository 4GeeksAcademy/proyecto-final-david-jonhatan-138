import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, TrendingUp, Briefcase, CalendarCheck, Settings, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        professionals: 0,
        clients: 0,
        active_subscriptions: 0,
        total_users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/stats");
                if (!response.ok) throw new Error("Error al cargar métricas");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error:", error);
                toast.error("No se pudieron cargar las estadísticas");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold mb-1">Bienvenido, Administrador 👋</h1>
                    <p className="text-muted mb-0">Este es el resumen general de tu plataforma SaaS.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/" className="btn btn-outline-secondary">Ir a la Web</Link>
                </div>
            </div>

            {/* Tarjetas de Métricas Principales */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100 bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="mb-1 opacity-75 fw-medium">Suscripciones Activas</p>
                                    <h2 className="fw-bold mb-0">
                                        {loading ? "..." : stats.active_subscriptions}
                                    </h2>
                                </div>
                                <div className="p-2 bg-white bg-opacity-25 rounded">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Total Profesionales</p>
                                    <h2 className="fw-bold mb-0 text-dark">
                                        {loading ? "..." : stats.professionals}
                                    </h2>
                                </div>
                                <div className="p-2 bg-light text-primary rounded">
                                    <Briefcase size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Clientes Registrados</p>
                                    <h2 className="fw-bold mb-0 text-dark">
                                        {loading ? "..." : stats.clients}
                                    </h2>
                                </div>
                                <div className="p-2 bg-light text-success rounded">
                                    <Users size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Usuarios Totales</p>
                                    <h2 className="fw-bold mb-0 text-dark">
                                        {loading ? "..." : stats.total_users}
                                    </h2>
                                </div>
                                <div className="p-2 bg-light text-warning rounded">
                                    <Users size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accesos Directos */}
            <h4 className="fw-bold mb-3">Accesos Directos</h4>
            <div className="row g-4">
                <div className="col-md-4">
                    <Link to="/admin/users" className="text-decoration-none">
                        <div className="card shadow-sm border-0 h-100 feature-card user-select-none">
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">Gestión de Usuarios</h5>
                                        <small className="text-muted">Administra profesionales y roles</small>
                                    </div>
                                </div>
                                <ArrowRight className="text-muted" />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100 feature-card opacity-50 user-select-none" style={{ cursor: "not-allowed" }}>
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-secondary bg-opacity-10 text-secondary p-3 rounded-circle">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold text-dark">Configuración</h5>
                                    <small className="text-muted">Próximamente</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .feature-card:hover:not(.opacity-50) { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;