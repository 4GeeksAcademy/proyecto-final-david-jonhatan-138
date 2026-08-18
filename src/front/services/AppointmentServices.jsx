const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

async function getAllAppointments() {
    const res = await fetch(`${backendUrl}/api/appointments`);
    if (!res.ok) return { appointments: [] };
    return await res.json();
}

async function getAppointmentsByUser(user_id) {
    const res = await fetch(`${backendUrl}/api/appointments/user/${user_id}`);
    if (!res.ok) return { appointments: [] };
    return await res.json();
}

async function createAppointment(appointment) {
    const res = await fetch(`${backendUrl}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
    });

    return await res.json();
}

async function updateAppointment(appointment_id, appointment) {
    const res = await fetch(`${backendUrl}/api/appointments/${appointment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
    });

    return await res.json();
}

async function deleteAppointment(appointment_id) {
    const res = await fetch(`${backendUrl}/api/appointments/${appointment_id}`, {
        method: "DELETE",
    });
    return res.ok;
}

const appointmentsServices = {
    getAllAppointments,
    getAppointmentsByUser,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};

export default appointmentsServices;
