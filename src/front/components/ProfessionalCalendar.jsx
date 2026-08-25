import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import appointmentsServices from "../services/AppointmentServices.jsx";

const statusClass = {
    pending: "bg-warning text-dark",
    confirmed: "bg-success",
    canceled: "bg-danger",
};

// --- Función para enviar la hora local exacta sin desfases de zona horaria ---
const toLocalISOString = (date) => {
    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const ProfessionalCalendar = ({ services, clients, userId, onAppointmentChange }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultClient = clients && clients.length > 0 ? clients[0] : { id: 1, full_name: "Cliente de prueba" };
    const defaultService = services && services.length > 0 ? services[0] : { id: 1, title: "Servicio base" };

    const fetchAppointments = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await appointmentsServices.getAppointmentsByUser(userId);
            const appointments = response?.appointments || [];

            setEvents(
                appointments.map((appointment) => {
                    const client = clients.find((c) => c.id === appointment.client_id) || defaultClient;
                    const service = services.find((s) => s.id === appointment.service_id) || defaultService;
                    return {
                        id: String(appointment.id),
                        title: `${client.full_name} - ${service.title}`,
                        start: appointment.start_time,
                        end: appointment.end_time,
                        extendedProps: {
                            status: appointment.status,
                            client_id: appointment.client_id,
                            service_id: appointment.service_id,
                        },
                        className: statusClass[appointment.status] || "bg-secondary",
                    };
                })
            );
        } catch (error) {
            console.error("Error al cargar las citas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [userId, clients, services]);

    const calendarOptions = useMemo(
        () => ({
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: "timeGridWeek",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventResizableFromStart: true,

            // --- CREAR CITA ---
            select: async (selectionInfo) => {
                const start = selectionInfo.start;
                const end = selectionInfo.end;

                const appointmentPayload = {
                    start_time: toLocalISOString(start),
                    end_time: toLocalISOString(end),
                    service_id: defaultService?.id || 1,
                    user_id: userId || 1,
                    client_id: defaultClient?.id || 1,
                    status: "pending",
                    source: "manual",
                };

                console.log("1. Intentando crear cita con estos datos:", appointmentPayload);

                try {
                    const result = await appointmentsServices.createAppointment(appointmentPayload);
                    console.log("2. Respuesta de Flask:", result);

                    if (result && result.appointment) {
                        setEvents((current) => [
                            ...current,
                            {
                                id: String(result.appointment.id),
                                title: `${defaultClient.full_name} - ${defaultService.title}`,
                                start: result.appointment.start_time,
                                end: result.appointment.end_time,
                                extendedProps: {
                                    status: result.appointment.status,
                                    client_id: defaultClient.id,
                                    service_id: defaultService.id,
                                },
                                className: statusClass[result.appointment.status] || "bg-secondary",
                            },
                        ]);
                        selectionInfo.view.calendar.unselect();

                        if (onAppointmentChange) onAppointmentChange();
                    } else {
                        alert("❌ Flask rechazó la cita. Revisa la consola (F12) para ver el error exacto.");
                        selectionInfo.view.calendar.unselect();
                    }
                } catch (error) {
                    console.error("Error crítico al crear la cita:", error);
                    alert("❌ Error de red. No se pudo contactar al servidor.");
                    selectionInfo.view.calendar.unselect();
                }
            },

            // --- MOVER CITA ---
            eventDrop: async (eventDropInfo) => {
                const event = eventDropInfo.event;
                const endDate = event.end ? event.end : new Date(event.start.getTime() + 60 * 60 * 1000);

                const appointmentPayload = {
                    start_time: toLocalISOString(event.start),
                    end_time: toLocalISOString(endDate),
                    status: event.extendedProps.status || "pending",
                    service_id: event.extendedProps.service_id || defaultService.id || 1,
                    user_id: userId || 1,
                    client_id: event.extendedProps.client_id || defaultClient.id || 1,
                    source: "manual",
                };
                try {
                    await appointmentsServices.updateAppointment(event.id, appointmentPayload);
                    if (onAppointmentChange) onAppointmentChange();
                } catch (error) {
                    console.error("Error al mover la cita:", error);
                    eventDropInfo.revert();
                }
            },

            // --- CAMBIAR DURACIÓN ---
            eventResize: async (eventResizeInfo) => {
                const event = eventResizeInfo.event;
                const endDate = event.end ? event.end : new Date(event.start.getTime() + 60 * 60 * 1000);

                const appointmentPayload = {
                    start_time: toLocalISOString(event.start),
                    end_time: toLocalISOString(endDate),
                    status: event.extendedProps.status || "pending",
                    service_id: event.extendedProps.service_id || defaultService.id || 1,
                    user_id: userId || 1,
                    client_id: event.extendedProps.client_id || defaultClient.id || 1,
                    source: "manual",
                };
                try {
                    await appointmentsServices.updateAppointment(event.id, appointmentPayload);
                    if (onAppointmentChange) onAppointmentChange();
                } catch (error) {
                    console.error("Error al redimensionar la cita:", error);
                    eventResizeInfo.revert();
                }
            },

            // --- BORRAR CITA ---
            eventClick: async (clickInfo) => {
                const appointmentId = clickInfo.event.id;
                const confirmed = window.confirm("¿Eliminar esta cita?");
                if (confirmed) {
                    try {
                        const success = await appointmentsServices.deleteAppointment(appointmentId);
                        if (success) {
                            clickInfo.event.remove();
                            if (onAppointmentChange) onAppointmentChange();
                        }
                    } catch (error) {
                        console.error("Error al borrar cita:", error);
                    }
                }
            },

            eventContent: function (arg) {
                return (
                    <div className="p-1">
                        <b className="d-block text-truncate">{arg.event.title}</b>
                        <div className="small text-white opacity-75">{arg.event.extendedProps.status}</div>
                    </div>
                );
            },
        }),
        [clients, services, userId, defaultClient, defaultService, onAppointmentChange],
    );

    return (
        <div>
            {loading && <div className="text-center py-3 text-primary">Cargando agenda...</div>}
            <FullCalendar {...calendarOptions} events={events} height={600} />
            <p className="mt-3 small text-muted">Seleccione un rango para crear una cita. Arrastre o cambie tamaño sobre el evento para actualizarlo. Haga clic en un evento para borrarlo.</p>
        </div>
    );
};

export default ProfessionalCalendar;