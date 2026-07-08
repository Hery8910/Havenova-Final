import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function CompanyPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Empresa"
      description="Entrada principal al dominio de configuracion del tenant y la empresa."
      routePath="/company"
      domain="Company"
      purpose="Agrupar la configuracion general del tenant."
      nextStep="Definir summary page y accesos a subdominios."
      bullets={['General', 'Branding', 'Legal', 'Operations']}
    />
  );
}
