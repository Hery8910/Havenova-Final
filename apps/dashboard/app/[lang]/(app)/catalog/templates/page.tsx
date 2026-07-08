import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CatalogTemplatesPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Catalog"
      title="Plantillas"
      description="Espacio reservado para plantillas operativas reutilizables del dashboard."
      routePath="/catalog/templates"
      domain="Catalog"
      purpose="Guardar estructuras reutilizables para el negocio."
      nextStep="Definir tipos de plantilla y puntos de reutilizacion."
      bullets={['Plantillas operativas', 'Reutilizacion futura']}
    />
  );
}
