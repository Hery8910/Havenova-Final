import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function RequestsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Workspace"
      title="Solicitudes"
      description="Superficie principal para la gestion de solicitudes, su estado, prioridad, responsables y seguimiento operativo."
      routePath="/requests"
      domain="Workspace"
      purpose="Centralizar la lista principal de solicitudes."
      nextStep="Definir filtros, columnas, estados y acciones disponibles."
      bullets={['Lista principal', 'Filtros', 'Estados', 'Acciones de seguimiento']}
    />
  );
}
