import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function PropertyDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Portfolio"
      title="Detalle de propiedad"
      description="Vista dedicada para una propiedad concreta con informacion contextual, actividad y conexiones con solicitudes."
      routePath="/properties/[propertyId]"
      domain="Portfolio"
      purpose="Trabajar una propiedad como entidad operativa."
      nextStep="Definir resumen, metadatos, responsables y actividad."
      bullets={['Resumen de propiedad', 'Relaciones', 'Actividad', 'Solicitudes asociadas']}
    />
  );
}
