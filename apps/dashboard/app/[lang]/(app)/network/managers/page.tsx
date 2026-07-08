import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function ManagersPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Network"
      title="Managers"
      description="Dominio para responsables o managers asociados a propiedades o relaciones operativas del tenant."
      routePath="/network/managers"
      domain="Network"
      purpose="Gestionar responsables externos o funcionales del portfolio."
      nextStep="Definir si pertenecen a red externa o equipo extendido."
      bullets={['Directorio de managers', 'Relacion con propiedades', 'Datos de contacto']}
    />
  );
}
