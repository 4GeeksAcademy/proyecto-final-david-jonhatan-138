import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import calendario_example_img from "../assets/img/img-calendario.png";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	return (
		<div className="py-5">

			{/* HERO */}
			<Container className="text-center mb-5">
				<h1 className="display-4 fw-bold">
					Gestiona tus citas como profesional independiente
				</h1>
				<p className="lead mt-3">
					Psicólogos, abogados, terapeutas, coaches…
					Una plataforma creada para autónomos que necesitan una agenda clara, moderna y automatizada.
				</p>
				<Link to="/login">
					<Button variant="primary" size="lg" className="mt-4">Crear cuenta</Button>
				</Link>
			</Container>

			{/* BENEFICIOS */}
			<Container className="my-5">
				<Row className="text-center">
					<Col md={4}>
						<Card className="p-4 shadow-sm">
							<h4 className="fw-bold">Agenda Inteligente</h4>
							<p>Organiza tus citas con una interfaz clara y adaptable a tu profesión.</p>
						</Card>
					</Col>

					<Col md={4}>
						<Card className="p-4 shadow-sm">
							<h4 className="fw-bold">Recordatorios Automáticos</h4>
							<p>Reduce ausencias enviando avisos automáticos a tus clientes.</p>
						</Card>
					</Col>

					<Col md={4}>
						<Card className="p-4 shadow-sm">
							<h4 className="fw-bold">Gestión Multiperfil</h4>
							<p>Perfecto para psicólogos, abogados, terapeutas y cualquier autónomo.</p>
						</Card>
					</Col>
				</Row>
			</Container>

			{/* SECCIÓN DESTACADA */}
			<Container className="my-5">
				<Row className="align-items-center">
					<Col md={6}>
						<h2 className="fw-bold">Una plataforma pensada para ti</h2>
						<p className="mt-3">
							Crea, modifica y organiza tus citas en segundos.
							Tu agenda se sincroniza automáticamente con tus clientes y evita confusiones.
						</p>
						<Button variant="outline-primary" size="lg">
							Ver cómo funciona
						</Button>
					</Col>

					<Col md={6}>
						<img
							src={calendario_example_img}
							alt="Demo agenda"
							className="img-fluid rounded shadow-sm"
						/>
					</Col>
				</Row>
			</Container>

			{/* CTA FINAL */}
			<Container className="text-center my-5">
				<h2 className="fw-bold">Empieza a gestionar tus citas hoy</h2>
				<p className="mt-2">Sin complicaciones. Sin instalaciones. 100% online.</p>
				<Link to="/login">
					<Button variant="success" size="lg" className="mt-3"> Crear cuenta ahora </Button>
				</Link>

			</Container>

		</div>
	);
}; 