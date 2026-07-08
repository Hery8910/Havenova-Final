import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function AccountNotificationsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Account"
      title="Preferencias de notificaciones"
      description="Configuracion personal de notificaciones del admin autenticado."
      routePath="/account/notifications"
      domain="Account"
      purpose="Gestionar como recibe avisos el admin."
      nextStep="Definir canales, frecuencia y opt-ins."
      bullets={['Canales', 'Frecuencia', 'Preferencias personales']}
    />
  );
}
