import { DashboardRoutePlaceholder } from '../../../components/placeholders';

export default function PropertyDocumentsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Portfolio"
      title="Documentos de la propiedad"
      description="Espacio reservado para contratos, archivos y material asociado a una propiedad concreta."
      routePath="/properties/[propertyId]/documents"
      domain="Portfolio"
      purpose="Agrupar documentacion ligada a la propiedad."
      nextStep="Definir tipos de documentos, acciones y permisos."
      bullets={['Archivos', 'Versiones', 'Categorias documentales']}
    />
  );
}
