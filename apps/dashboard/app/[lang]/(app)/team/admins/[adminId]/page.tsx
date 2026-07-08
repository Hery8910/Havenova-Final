import { DashboardRoutePlaceholder } from '../../../components/placeholders';

export default function TeamAdminDetailPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Detalle de admin"
      description="Vista para la gestion individual de un admin del tenant, su rol operativo y su estado dentro del equipo."
      routePath="/team/admins/[adminId]"
      domain="People"
      purpose="Gestionar una cuenta operativa interna concreta."
      nextStep="Definir tabs de perfil, permisos y actividad."
      bullets={['Perfil interno', 'Permisos', 'Actividad', 'Estado']}
    />
  );
}
