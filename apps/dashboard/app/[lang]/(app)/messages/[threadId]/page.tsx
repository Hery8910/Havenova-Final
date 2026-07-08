import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function MessageThreadPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Communication"
      title="Detalle de hilo"
      description="Vista dedicada a un hilo individual de mensajes dentro del dashboard."
      routePath="/messages/[threadId]"
      domain="Communication"
      purpose="Trabajar un hilo concreto y su contexto."
      nextStep="Definir timeline del hilo y acciones de respuesta."
      bullets={['Timeline', 'Participantes', 'Respuesta', 'Estado']}
    />
  );
}
