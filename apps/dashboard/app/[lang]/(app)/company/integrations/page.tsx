import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyIntegrationsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Integraciones"
      description="Superficie prevista para conexiones externas y servicios integrados."
      routePath="/company/integrations"
      domain="Company"
      purpose="Agrupar integraciones del tenant."
      nextStep="Definir proveedores y estados de conexion."
      bullets={['Servicios externos', 'Estado de conexion', 'Configuracion']}
    />
  );
}
