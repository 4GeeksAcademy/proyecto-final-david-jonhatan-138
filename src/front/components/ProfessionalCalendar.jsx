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

const ProfessionalCalendar = ({ services, clients, userId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultClient = clients[0] || { id: 1, full_name: "Cliente sin nombre" };
    const defaultService = services[0] || { id: 1, title: "Sin servicio" };

    const fetchAppointments = async () => {
        setLoading(true);
        const response = await appointmentsServices.getAppointmentsByUser(userId);
        const appointments = response.appointments || [];

        setEvents(
            appointments.map((appointment) => ({
                id: String(appointment.id),
                title: `${clients.find((c) => c.id === appointment.client_id)?.full_name || defaultClient.full_name} - ${services.find((s) => s.id === appointment.service_id)?.title || defaultService.title}`,
                start: appointment.start_time,
                end: appointment.end_time,
                extendedProps: {
                    status: appointment.status,
                    client_id: appointment.client_id,
                    service_id: appointment.service_id,
                },
                className: statusClass[appointment.status] || "bg-secondary",
            })),
        );
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [userId]);

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
            select: async (selectionInfo) => {
                const start = selectionInfo.start;
                const end = selectionInfo.end;
                const client = defaultClient;
                const service = defaultService;
                const appointmentPayload = {
                    start_time: start.toISOString(),
                    end_time: end.toISOString(),
                    service_id: service.id,
                    user_id: userId,
                    client_id: client.id,
                    status: "pending",
                    source: "manual",
                };

                const result = await appointmentsServices.createAppointment(appointmentPayload);
                if (result.appointment) {
                    setEvents((current) => [
                        ...current,
                        {
                            id: String(result.appointment.id),
                            title: `${client.full_name} - ${service.title}`,
                            start: result.appointment.start_time,
                            end: result.appointment.end_time,
                            extendedProps: {
                                status: result.appointment.status,
                                client_id: client.id,
                                service_id: service.id,
                            },
                            className: statusClass[result.appointment.status] || "bg-secondary",
                        },
                    ]);
                }
            },
            eventDrop: async (eventDropInfo) => {
                const event = eventDropInfo.event;
                const appointmentPayload = {
                    start_time: event.start.toISOString(),
                    end_time: event.end.toISOString(),
                    status: event.extendedProps.status || "pending",
                    service_id: event.extendedProps.service_id || defaultService.id,
                    user_id: userId,
                    client_id: event.extendedProps.client_id || defaultClient.id,
                    source: "manual",
                };
                await appointmentsServices.updateAppointment(event.id, appointmentPayload);
            },
            eventResize: async (eventResizeInfo) => {
                const event = eventResizeInfo.event;
                const appointmentPayload = {
                    start_time: event.start.toISOString(),
                    end_time: event.end.toISOString(),
                    status: event.extendedProps.status || "pending",
                    service_id: event.extendedProps.service_id || defaultService.id,
                    user_id: userId,
                    client_id: event.extendedProps.client_id || defaultClient.id,
                    source: "manual",
                };
                await appointmentsServices.updateAppointment(event.id, appointmentPayload);
            },
            eventClick: async (clickInfo) => {
                const appointmentId = clickInfo.event.id;
                const confirmed = window.confirm("¿Eliminar esta cita?");
                if (confirmed) {
                    const success = await appointmentsServices.deleteAppointment(appointmentId);
                    if (success) {
                        clickInfo.event.remove();
                    }
                }
            },
            eventContent: function (arg) {
                return (
                    <div>
                        <b>{arg.event.title}</b>
                        <div className="small text-muted">{arg.event.extendedProps.status}</div>
                    </div>
                );
            },
        }),
        [clients, services, userId],
    );

    return (
        <div>
            {loading && <div className="text-center py-3">Cargando agenda...</div>}
            <FullCalendar {...calendarOptions} events={events} height={600} />
            <p className="mt-3 small text-muted">Seleccione un rango para crear una cita. Arrastre o cambie tamaño sobre el evento para actualizarlo. Haga clic en un evento para borrarlo.</p>
        </div>
    );
};

export default ProfessionalCalendar;
