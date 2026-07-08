import { DashboardRoutePlaceholder } from '../../../components/placeholders';

export default function ManagerDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Network"
      title="Detalle de manager"
      description="Vista para trabajar un manager o responsable concreto dentro de la red operativa del tenant."
      routePath="/network/managers/[managerId]"
      domain="Network"
      purpose="Gestionar una relacion especifica de manager."
      nextStep="Definir datos, relaciones y documentos asociados."
      bullets={['Perfil del manager', 'Propiedades asociadas', 'Relacion operativa']}
    />
  );
}
