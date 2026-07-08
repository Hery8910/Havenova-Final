import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function RequestDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Workspace"
      title="Detalle de solicitud"
      description="Vista de detalle para una solicitud individual con trazabilidad, actividad, responsables y documentos relacionados."
      routePath="/requests/[requestId]"
      domain="Workspace"
      purpose="Resolver el trabajo sobre una solicitud concreta."
      nextStep="Definir timeline, metadatos, acciones y paneles secundarios."
      bullets={['Timeline', 'Responsables', 'Notas', 'Documentos']}
    />
  );
}
