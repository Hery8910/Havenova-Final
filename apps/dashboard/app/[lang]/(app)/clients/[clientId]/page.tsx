import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function ClientDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Detalle de cliente"
      description="Vista dedicada a un cliente final con su informacion, actividad y relaciones dentro del tenant."
      routePath="/clients/[clientId]"
      domain="People"
      purpose="Profundizar en una relacion concreta con cliente."
      nextStep="Definir tabs de resumen, propiedades, solicitudes y actividad."
      bullets={['Perfil del cliente', 'Solicitudes', 'Propiedades', 'Actividad']}
    />
  );
}
