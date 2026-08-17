import { Link } from "react-router-dom"

export const Clients = ({ clients }) => {
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Clientes recientes</h5>
                    <Link to={"/show-clients"}>
                        <button className="btn btn-sm btn-outline-secondary">Ver todos</button>
                    </Link>
                </div>
                <div className="list-group">
                    {clients.slice(-3).reverse().map((client, index) => (
                        <div key={client.id ?? `client-${index}`} className="list-group-item">
                            <h6 className="mb-1">{client.full_name}</h6>
                            <p className="mb-1 text-muted">{client.email}</p>
                            <small>{client.phone}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}