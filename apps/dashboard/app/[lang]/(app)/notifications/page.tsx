import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function NotificationsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Communication"
      title="Notificaciones"
      description="Centro de notificaciones del dashboard para eventos relevantes del tenant."
      routePath="/notifications"
      domain="Communication"
      purpose="Agrupar avisos y eventos para el admin."
      nextStep="Definir tipos, filtros y acciones de marcado."
      bullets={['Centro de avisos', 'Tipos de evento', 'Estados de lectura']}
    />
  );
}
