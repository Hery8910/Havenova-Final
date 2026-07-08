import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function TeamAdminsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Equipo interno"
      description="Superficie para gestionar admins internos del cliente que operan el dashboard dentro del tenant."
      routePath="/team/admins"
      domain="People"
      purpose="Administrar al equipo interno del cliente."
      nextStep="Definir listado, alta, permisos y estados."
      bullets={['Admins del tenant', 'Permisos', 'Estados de acceso']}
    />
  );
}
