import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ProfessionalCalendar from "../components/ProfessionalCalendar.jsx";

export const Professional = () => {
    const { store } = useGlobalReducer()
    const profile = store.user || {
        id: 1,
        name: "Ana",
        last_name: "Pérez",
        category: "Fisioterapia",
        email: "ana.perez@clinic.com",
        role: "profesional",
        servicesCount: 5,
        upcomingAppointments: 6,
    };
    const services = [
        { id: 1, title: "Terapia de espalda", duration: 45, price: 35 },
        { id: 2, title: "Masaje deportivo", duration: 60, price: 45 },
        { id: 3, title: "Rehabilitación muscular", duration: 50, price: 40 },
    ];

    const clients = Array.isArray(store.clientsList) && store.clientsList.length > 0
        ? store.clientsList[0]
        : [
            { id: 1, full_name: "María López", email: "maria.lopez@email.com", phone: "600123456" },
            { id: 2, full_name: "Pablo Ruiz", email: "pablo.ruiz@email.com", phone: "611223344" },
        ];

    return (
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
                            <p className="mb-1"><strong>Nombre: </strong>{`${profile.name} ${profile.last_name}`}</p>
                            <p className="mb-1"><strong>Categoría:</strong> {profile.category}</p>
                            <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                            {/* <p className="mb-1"><strong>Teléfono:</strong> {profile.phone}</p> */}
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
                                    <p className="display-6 mb-0">{profile.servicesCount ?? "Falta añadir"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-info h-100 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Próximas citas</h6>
                                    <p className="display-6 mb-0">{profile.upcomingAppointments ?? "Falta añadir"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row gy-4 mt-4">
                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0">Servicios</h5>
                                <button className="btn btn-sm btn-outline-secondary">Agregar servicio</button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-borderless align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Duración</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id}>
                                                <td>{service.title}</td>
                                                <td>{service.duration} min</td>
                                                <td>€ {service.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0">Clientes recientes</h5>
                                <Link to={"/show-clients"}>
                                    <button className="btn btn-sm btn-outline-secondary">Ver todos</button>
                                </Link>
                            </div>
                            <div className="list-group">
                                {clients.slice(-3).reverse().map(client => (
                                    <div key={client.id} className="list-group-item">
                                        <h6 className="mb-1">{client.full_name}</h6>
                                        <p className="mb-1 text-muted">{client.email}</p>
                                        <small>{client.phone}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="card-title mb-0">Agenda interactiva</h5>
                            <small className="text-muted">Crea, edita y elimina citas directamente sobre el calendario.</small>
                        </div>
                    </div>
                    <ProfessionalCalendar services={services} clients={clients} />
                </div>
            </div>
        </div>
    );
};