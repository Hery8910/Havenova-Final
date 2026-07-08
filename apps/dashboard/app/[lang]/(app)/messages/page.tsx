import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function MessagesPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Communication"
      title="Mensajes"
      description="Bandeja de conversaciones y mensajes vinculados a actividad operativa del tenant."
      routePath="/messages"
      domain="Communication"
      purpose="Centralizar hilos y mensajes de trabajo."
      nextStep="Definir listado, filtros y experiencia de detalle."
      bullets={['Inbox', 'Hilos', 'Filtros', 'Estados de lectura']}
    />
  );
}
