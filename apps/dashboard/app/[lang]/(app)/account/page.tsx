import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function AccountPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Account"
      title="Cuenta"
      description="Entrada principal al dominio personal del admin autenticado."
      routePath="/account"
      domain="Account"
      purpose="Agrupar configuracion personal del admin."
      nextStep="Definir summary page y accesos a subrutas personales."
      bullets={['Perfil', 'Preferencias', 'Seguridad', 'Notificaciones']}
    />
  );
}
