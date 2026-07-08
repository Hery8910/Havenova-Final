import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function ActivityPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Communication"
      title="Actividad"
      description="Vista global de actividad y trazabilidad operativa dentro del tenant."
      routePath="/activity"
      domain="Communication"
      purpose="Ofrecer una timeline transversal del dashboard."
      nextStep="Definir eventos, filtros y nivel de detalle."
      bullets={['Timeline global', 'Eventos', 'Auditoria funcional']}
    />
  );
}
