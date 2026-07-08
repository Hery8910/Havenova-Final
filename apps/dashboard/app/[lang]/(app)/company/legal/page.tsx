import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyLegalPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Legal"
      description="Superficie para datos fiscales, legales y de cumplimiento del tenant."
      routePath="/company/legal"
      domain="Company"
      purpose="Centralizar informacion legal y fiscal."
      nextStep="Definir campos legales y responsables."
      bullets={['Datos fiscales', 'Representacion legal', 'Cumplimiento']}
    />
  );
}
