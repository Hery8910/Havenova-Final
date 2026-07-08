import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyBillingPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Billing"
      description="Espacio reservado para la capa economica o de suscripcion del tenant."
      routePath="/company/billing"
      domain="Company"
      purpose="Preparar la futura superficie de billing."
      nextStep="Definir si aplica a este producto y su alcance real."
      bullets={['Facturacion', 'Suscripcion', 'Historial de cargos']}
    />
  );
}
