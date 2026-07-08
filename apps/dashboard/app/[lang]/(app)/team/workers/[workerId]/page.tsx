import { DashboardRoutePlaceholder } from '../../../components/placeholders';

export default function TeamWorkerDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Detalle de worker"
      description="Vista individual para un worker vinculado al tenant y su relacion con solicitudes o propiedades."
      routePath="/team/workers/[workerId]"
      domain="People"
      purpose="Gestionar un worker concreto y sus relaciones."
      nextStep="Definir resumen, asignaciones y actividad."
      bullets={['Perfil worker', 'Asignaciones', 'Historial de actividad']}
    />
  );
}
