import { DashboardRoutePlaceholder } from '../components/placeholders';

export default function ClientsPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Clientes"
      description="Superficie para la gestion de clientes finales y su relacion con el tenant y las operaciones activas."
      routePath="/clients"
      domain="People"
      purpose="Gestionar clientes finales como actor del negocio."
      nextStep="Definir lista, detalles y relaciones con propiedades y solicitudes."
      bullets={['Listado de clientes', 'Relacion con propiedades', 'Historial operativo']}
    />
  );
}
