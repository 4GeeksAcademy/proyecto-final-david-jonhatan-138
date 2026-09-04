import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserService } from "../services/AuthServices";
import { sendMessage } from "../services/SendMessageServices"

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();
	const [editForm, setEditForm] = useState({
		id: null,
		email: "",
		name: "",
		last_name: "",
		category: "",
		biografi: "",
	});

	const handleLogout = () => {
		dispatch({ type: "logout" });
		navigate("/");
	};

	function openEditUserModal(user) {
		setEditForm({
			id: store.user.id,
			email: store.user.email,
			name: store.user.name ?? "",
			last_name: store.user.last_name ?? "",
			category: store.user.category ?? "",
			biografi: store.user.biografi ?? "",
		});

		const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editUserModal"));
		modal.show();
	}


	async function handleEditSubmit(e) {
		e.preventDefault();

		const modal = bootstrap.Modal.getOrCreateInstance(
			document.getElementById("editUserModal")
		);

		if (!editForm.name) {
			return toast.error("El nombre es requerido");
		}

		if (!editForm.last_name) {
			return toast.error("El apellido es requerido");
		}

		try {
			const [updatedUser, error] = await updateUserService(editForm.id, editForm);

			if (error) {
				return toast.error(error);
			}

			// Actualizar el store
			dispatch({ type: "updateUser", payload: updatedUser });

			// Actualizar localStorage
			localStorage.setItem("user", JSON.stringify(updatedUser));

			modal.hide();
			toast.success("Usuario actualizado correctamente");

		} catch (err) {
			console.error(err);
			toast.error("Error al actualizar el usuario");
		}
	}


	function handleEditChange(e) {
		setEditForm({
			...editForm,
			[e.target.name]: e.target.value
		});
	}

	function handleSendMessage() {
		const tokenReset = crypto.randomUUID()
		sendMessage({ email: store.user.email, tokenReset: tokenReset })
		localStorage.setItem("tokenReset", tokenReset)
		toast.success("Correo de recuperacion envido correctamente")
	}
	return (
		<>
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<div className="d-flex gap-2">

						<Link to="/">
							<span className="navbar-brand mb-0 h1">IndieMeet</span>
						</Link>
					</div>
					<div className="ml-auto d-flex gap-2">
						{
							!store.isAuthenticated ?
								<>
									<Link to="/login">
										<button className="btn btn-primary">Login</button>
									</Link>
									<Link to="/signin">
										<button className="btn btn-primary">Signin</button>
									</Link>
								</>
								:
								<>
									<button className="btn btn-danger" onClick={handleLogout}>Logout</button>
									<button className="btn btn-secondary" onClick={openEditUserModal}>{store.user.name}</button>
								</>
						}

					</div>
				</div>
			</nav>

			{/* Modal Editar Usuario */}
			<div
				className="modal fade"
				id="editUserModal"
				tabIndex="-1"
				aria-labelledby="editUserModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header">
							<h1 className="modal-title fs-5" id="editUserModalLabel">
								Editar usuario
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
									<label className="form-label">Email (no editable)</label>
									<input
										type="email"
										name="email"
										className="form-control"
										value={editForm.email}
										disabled
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Nombre</label>
									<input
										type="text"
										name="name"
										className="form-control"
										value={editForm.name}
										onChange={handleEditChange}
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Apellido</label>
									<input
										type="text"
										name="last_name"
										className="form-control"
										value={editForm.last_name}
										onChange={handleEditChange}
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Categoría</label>
									<input
										type="text"
										name="category"
										className="form-control"
										value={editForm.category}
										onChange={handleEditChange}
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Biografía</label>
									<textarea
										name="biografi"
										className="form-control"
										rows="3"
										value={editForm.biografi}
										onChange={handleEditChange}
									></textarea>
								</div>

							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >
									Cancelar
								</button>

								<button type="button" className="btn btn-warning" onClick={() => handleSendMessage()}>
									Restablecer Contraseña
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