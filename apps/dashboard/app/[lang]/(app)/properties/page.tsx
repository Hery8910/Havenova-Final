import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function PropertiesPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Portfolio"
      title="Propiedades"
      description="Dominio principal para la gestion del portfolio fisico o administrado por el cliente dentro del tenant."
      routePath="/properties"
      domain="Portfolio"
      purpose="Centralizar propiedades, relaciones y estado operativo."
      nextStep="Definir tabla principal, filtros y capas de detalle."
      bullets={['Portfolio', 'Asignaciones', 'Estado de cada propiedad']}
    />
  );
}
