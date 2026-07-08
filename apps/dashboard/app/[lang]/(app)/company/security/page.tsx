import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanySecurityPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Seguridad"
      description="Configuraciones de seguridad a nivel organizacion o tenant."
      routePath="/company/security"
      domain="Company"
      purpose="Agrupar seguridad y politicas de acceso de empresa."
      nextStep="Definir sesiones, permisos y politicas globales."
      bullets={['Politicas', 'Permisos', 'Seguridad tenant']}
    />
  );
}
