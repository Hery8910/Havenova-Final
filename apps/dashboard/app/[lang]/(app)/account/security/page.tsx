import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function AccountSecurityPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Account"
      title="Seguridad de cuenta"
      description="Dominio personal para password, sesiones y seguridad individual del admin."
      routePath="/account/security"
      domain="Account"
      purpose="Gestionar la seguridad personal de la cuenta."
      nextStep="Definir password, sesiones y acciones sensibles."
      bullets={['Password', 'Sesiones', 'Acciones sensibles']}
    />
  );
}
