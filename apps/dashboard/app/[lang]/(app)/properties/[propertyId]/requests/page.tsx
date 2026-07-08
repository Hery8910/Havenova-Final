import { DashboardRoutePlaceholder } from '../../../components/placeholders';

export default function PropertyRequestsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Portfolio"
      title="Solicitudes de la propiedad"
      description="Subsuperficie para concentrar las solicitudes vinculadas a una propiedad sin perder el contexto del portfolio."
      routePath="/properties/[propertyId]/requests"
      domain="Portfolio"
      purpose="Cruzar propiedades con actividad operativa."
      nextStep="Definir filtros y forma de navegacion cruzada con requests."
      bullets={['Lista asociada', 'Contexto por propiedad', 'Cruce con workflow']}
    />
  );
}
