import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyOperationsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Operaciones"
      description="Configuracion operativa global del tenant y del negocio."
      routePath="/company/operations"
      domain="Company"
      purpose="Ajustar reglas y preferencias operativas del sistema."
      nextStep="Definir configuraciones y jerarquia de permisos."
      bullets={['Preferencias operativas', 'Reglas globales', 'Configuracion tenant']}
    />
  );
}
