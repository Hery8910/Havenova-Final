import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CatalogAutomationsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Catalog"
      title="Automatizaciones"
      description="Superficie prevista para reglas y automatizaciones futuras del negocio."
      routePath="/catalog/automations"
      domain="Catalog"
      purpose="Reservar la capa de automatizacion del producto."
      nextStep="Definir disparadores, reglas y acciones."
      bullets={['Reglas', 'Disparadores', 'Acciones automáticas']}
    />
  );
}
