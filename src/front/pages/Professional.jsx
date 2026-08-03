import { Link } from "react-router-dom";

export const Professional = () => {
    const profile = {
        name: "Ana Pérez",
        category: "Fisioterapia",
        email: "ana.perez@clinic.com",
        phone: "+34 600 123 456",
        role: "Profesional",
        clientsCount: 24,
        servicesCount: 5,
        upcomingAppointments: 6,
    };

    const services = [
        { id: 1, title: "Terapia de espalda", duration: 45, price: 35 },
        { id: 2, title: "Masaje deportivo", duration: 60, price: 45 },
        { id: 3, title: "Rehabilitación muscular", duration: 50, price: 40 },
    ];

    const appointments = [
        { id: 1, client: "María López", time: "2026-08-05 10:00", status: "Confirmado", service: "Terapia de espalda" },
        { id: 2, client: "Pablo Ruiz", time: "2026-08-05 12:00", status: "Pendiente", service: "Masaje deportivo" },
        { id: 3, client: "Carla Moreno", time: "2026-08-06 09:00", status: "Cancelado", service: "Rehabilitación muscular" },
    ];

    const clients = [
        { id: 1, name: "María López", email: "maria.lopez@example.com", phone: "+34 611 223 334" },
        { id: 2, name: "Pablo Ruiz", email: "pablo.ruiz@example.com", phone: "+34 622 334 445" },
        { id: 3, name: "Carla Moreno", email: "carla.moreno@example.com", phone: "+34 633 445 556" },
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
                            <p className="mb-1"><strong>Nombre:</strong> {profile.name}</p>
                            <p className="mb-1"><strong>Categoría:</strong> {profile.category}</p>
                            <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                            <p className="mb-1"><strong>Teléfono:</strong> {profile.phone}</p>
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
                                    <p className="display-6 mb-0">{profile.clientsCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-success h-100 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Servicios</h6>
                                    <p className="display-6 mb-0">{profile.servicesCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-info h-100 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Próximas citas</h6>
                                    <p className="display-6 mb-0">{profile.upcomingAppointments}</p>
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
                                <button className="btn btn-sm btn-outline-secondary">Ver todos</button>
                            </div>
                            <div className="list-group">
                                {clients.map(client => (
                                    <div key={client.id} className="list-group-item">
                                        <h6 className="mb-1">{client.name}</h6>
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
                        <h5 className="card-title mb-0">Próximas citas</h5>
                        <button className="btn btn-sm btn-outline-secondary">Gestionar agenda</button>
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
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.id}</td>
                                        <td>{appointment.client}</td>
                                        <td>{appointment.service}</td>
                                        <td>{appointment.time}</td>
                                        <td>
                                            <span className={`badge ${appointment.status === "Confirmado" ? "bg-success" : appointment.status === "Pendiente" ? "bg-warning text-dark" : "bg-danger"}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};