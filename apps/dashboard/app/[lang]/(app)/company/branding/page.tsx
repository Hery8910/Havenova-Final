import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyBrandingPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Branding"
      description="Configuracion visual y de marca del tenant."
      routePath="/company/branding"
      domain="Company"
      purpose="Gestionar identidad visual de la empresa."
      nextStep="Definir logo, colores y recursos de marca."
      bullets={['Logo', 'Colores', 'Assets de marca']}
    />
  );
}
