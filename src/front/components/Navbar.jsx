import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();


	const handleLogout = () => {
		dispatch({ type: "logout" });
		navigate("/");
	};
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<div className="d-flex gap-2">

					<Link to="/">
						<span className="navbar-brand mb-0 h1">React Boilerplate</span>
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
								<button className="btn btn-secondary">{store.user.name}</button>
							</>
					}

				</div>
			</div>
		</nav>
	);
};