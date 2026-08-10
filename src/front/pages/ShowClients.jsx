import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect, useState } from "react"
import { SquarePen, Trash2 } from "lucide-react"
import { number } from "prop-types"
import clientsServices from "../services/ClientsServices"
import toast from "react-hot-toast"

export const ShowClients = props => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [numberDelete, setNumberDelete] = useState(null)
    const clients = Array.isArray(store.clientsList) && store.clientsList.length > 0
        ? store.clientsList[0]
        : []
    const [form, setForm] = useState({
        email: "",
        full_name: "",
        notes: "",
        phone: "",
        user_id: store.user.id
    })
    const [editForm, setEditForm] = useState({
        id: null,
        email: "",
        full_name: "",
        notes: "",
        phone: "",
        user_id: store.user.id
    })

    function openEditModal(client) {
        setEditForm({
            id: client.id,
            email: client.email,
            full_name: client.full_name,
            notes: client.notes,
            phone: client.phone,
            user_id: client.user_id
        })

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editClientModal"))
        modal.show()
    }
    function handleEditChange(e) {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        })
    }

    async function handleEditSubmit(e) {
        e.preventDefault()

        const phoneRegex = /^[0-9]{9}$/
        const emailRegex = /^.+@.+$/

        if (!emailRegex.test(editForm.email)) {
            return toast.error("El email no es válido")
        }

        if (!editForm.full_name) {
            return toast.error("Nombre Completo es requerido")
        }

        if (!phoneRegex.test(editForm.phone)) {
            return toast.error("El teléfono debe tener 9 números")
        }

        try {
            const updatedClient = await clientsServices.updateClient(editForm.id, editForm)

            dispatch({ type: "updateClientList", payload: updatedClient })

            const modal = bootstrap.Modal.getInstance(document.getElementById("editClientModal"))
            modal.hide()

            toast.success("Cliente actualizado correctamente")

        } catch (error) {
            toast.error("Error al actualizar el cliente")
            console.error(error)
        }
    }


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleDelete() {
        await clientsServices.deleteClientById(numberDelete)
        dispatch({ type: 'deleteClientsList', payload: numberDelete })
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
        modal.hide()
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const phoneRegex = /^[0-9]{9}$/
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("addClientModal")
        )
        const emailRegex = /^.+@.+$/

        if (!emailRegex.test(form.email)) {
            return toast.error("El email no es válido")
        }

        if (!form.full_name) {
            return toast.error("Nombre Completo es requerido")
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error("El teléfono debe tener 9 números")
        }

        try {
            const dataClient = await clientsServices.postClient(form)

            dispatch({ type: "addClientList", payload: dataClient })

            modal.hide()
            toast.success("Cliente añadido correctamente")

        } catch (error) {
            console.error(error)
            toast.error("Error al añadir el cliente")
        }
    }

    return (
        <>
            <div>
                {/* Botón fuera de la tabla */}
                <div className="d-flex justify-content-between">

                    <Link to={"/professional"} className="my-3 mx-5 text-start">
                        <button className="btn btn-primary">Volver</button>
                    </Link>
                    <div className="my-3 mx-5 text-end">
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addClientModal">Añadir</button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Email</th>
                                <th>Nombre completo</th>
                                <th>Notas</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {[...clients].reverse().map(client => (
                                <tr key={client.id}>
                                    <td>{client.email}</td>
                                    <td>{client.full_name}</td>
                                    <td>{client.notes}</td>
                                    <td>{client.phone}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => openEditModal(client)}>
                                            <SquarePen />
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setNumberDelete(client.id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                            <Trash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            {/* Modal añadir Cliente */}
            <div
                className="modal fade"
                id="addClientModal"
                tabIndex="-1"
                aria-labelledby="addClientModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addClientModalLabel">
                                Añadir cliente
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text" name="email" className="form-control" value={form.email} onChange={handleChange} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre completo</label>
                                    <input type="text" name="full_name" className="form-control" value={form.full_name} onChange={handleChange} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notas</label>
                                    <textarea name="notes" className="form-control" value={form.notes} onChange={handleChange}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
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

            {/* Modal editar Cliente */}
            <div
                className="modal fade"
                id="editClientModal"
                tabIndex="-1"
                aria-labelledby="editClientModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editClientModalLabel">
                                Editar cliente
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        value={editForm.email}
                                        onChange={handleEditChange}

                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre completo</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        className="form-control"
                                        value={editForm.full_name}
                                        onChange={handleEditChange}

                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notas</label>
                                    <textarea
                                        name="notes"
                                        className="form-control"
                                        value={editForm.notes}
                                        onChange={handleEditChange}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        value={editForm.phone}
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
    )

}