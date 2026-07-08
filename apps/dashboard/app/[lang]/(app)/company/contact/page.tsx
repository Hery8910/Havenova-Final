import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyContactPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Contacto"
      description="Datos de contacto y canales institucionales del tenant."
      routePath="/company/contact"
      domain="Company"
      purpose="Gestionar canales oficiales de la empresa."
      nextStep="Definir email, telefono, direccion y canales secundarios."
      bullets={['Email', 'Telefono', 'Direccion', 'Canales']}
    />
  );
}
