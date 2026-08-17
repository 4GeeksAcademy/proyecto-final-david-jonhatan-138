// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.
import { SquarePen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import servicesServices from "../services/ServicesServices";

export const Services = ({ services }) => {
    // Access the global state and dispatch function using the useGlobalReducer hook.
    const { store, dispatch } = useGlobalReducer()
    const [numberDelete, setNumberDelete] = useState(null)
    const [form, setForm] = useState({
        title: "",
        duration: "",
        price: "",
        is_active: true,
        user_id: store.user.id   // si lo necesitas
    });

    const [editForm, setEditForm] = useState({
        id: null,
        title: "",
        duration: "",
        price: "",
        is_active: "",
        user_id: store.user.id
    })
    async function handleSubmit(e) {
        e.preventDefault();

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("addServiceModal")
        );

        if (!form.title) {
            return toast.error("El título es requerido");
        }

        if (!form.duration || form.duration <= 0) {
            return toast.error("La duración debe ser mayor a 0");
        }

        if (!form.price || form.price <= 0) {
            return toast.error("El precio debe ser mayor a 0");
        }

        try {
            const dataService = await servicesServices.postService(form);
            dispatch({ type: "addServiceList", payload: dataService });
            modal.hide();
            toast.success("Servicio añadido correctamente");

        } catch (error) {
            console.error(error);
            toast.error("Error al añadir el servicio");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "is_active" ? value === "true" : value
        });
    };

    async function handleDelete() {
        const modal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));

        try {
            await servicesServices.deleteServiceById(numberDelete);

            dispatch({
                type: "deleteServicesList",
                payload: numberDelete
            });

            modal.hide();
            toast.success("Servicio eliminado correctamente");

        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el servicio");
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm({
            ...editForm,
            [name]: name === "is_active" ? value === "true" : value
        });
    };

    async function handleEditSubmit(e) {
        e.preventDefault();

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("editServiceModal")
        );

        if (!editForm.title) {
            return toast.error("El título es requerido");
        }

        if (!editForm.duration || editForm.duration <= 0) {
            return toast.error("La duración debe ser mayor a 0");
        }

        if (!editForm.price || editForm.price <= 0) {
            return toast.error("El precio debe ser mayor a 0");
        }

        try {
            const updatedService = await servicesServices.updateService(
                editForm.id,
                editForm
            );

            dispatch({
                type: "updateServiceList",
                payload: updatedService
            });

            modal.hide();
            toast.success("Servicio actualizado correctamente");

        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el servicio");
        }
    }

    function openEditModal(service) {
        setEditForm({
            id: service.id,
            title: service.title ?? "",
            duration: service.duration ?? "",
            price: service.price ?? "",
            is_active: service.is_active ?? "",
            user_id: service.user_id
        });

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("editServiceModal")
        );
        modal.show();
    }



    return (
        <>
            <div className="col-12 col-xl-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Servicios</h5>
                            <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#addServiceModal">Agregar servicio</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map(service => (
                                        <tr key={service.id}>
                                            <td>{service.title}</td>
                                            <td>{service.duration} min</td>
                                            <td>€ {service.price}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => openEditModal(service)}>
                                                    <SquarePen />
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setNumberDelete(service.id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                    <Trash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal añadir Servicio */}
            <div
                className="modal fade"
                id="addServiceModal"
                tabIndex="-1"
                aria-labelledby="addServiceModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addServiceModalLabel">
                                Añadir servicio
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Duración (minutos)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        className="form-control"
                                        value={form.duration}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Precio (€)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={form.price}
                                        onChange={handleChange}
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

            {/* Modal Confirmacion Borrar */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" data-bs-backdrop="static" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteModalLabel">Are you sure?</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setNumberDelete(null) }}></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setNumberDelete(null) }}>No</button>
                            <button type="button" className="btn btn-primary" onClick={() => { handleDelete() }}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal editar Servicio */}
            <div
                className="modal fade"
                id="editServiceModal"
                tabIndex="-1"
                aria-labelledby="editServiceModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editServiceModalLabel">
                                Editar servicio
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Duración (minutos)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        className="form-control"
                                        value={editForm.duration}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Precio (€)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={editForm.price}
                                        onChange={handleEditChange}
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
                                    Guardar cambios
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>


        </>
    );
};
