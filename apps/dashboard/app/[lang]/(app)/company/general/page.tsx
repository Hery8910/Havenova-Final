import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CompanyGeneralPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Company"
      title="Datos generales"
      description="Configuracion general de la empresa y del tenant."
      routePath="/company/general"
      domain="Company"
      purpose="Editar la informacion base del tenant."
      nextStep="Definir campos, validaciones y permisos."
      bullets={['Nombre', 'Datos base', 'Configuracion general']}
    />
  );
}
