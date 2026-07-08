import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function RequestsCalendarPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Workspace"
      title="Calendario de solicitudes"
      description="Vista temporal para planificar visitas, tareas, seguimiento y cargas operativas vinculadas a solicitudes."
      routePath="/requests/calendar"
      domain="Workspace"
      purpose="Ordenar el trabajo por fecha y agenda."
      nextStep="Definir eventos, slots y acciones desde calendario."
      bullets={['Agenda operativa', 'Eventos de solicitud', 'Planificacion por fecha']}
    />
  );
}
