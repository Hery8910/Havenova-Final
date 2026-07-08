import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CatalogServicesPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Catalog"
      title="Catalogo de servicios"
      description="Superficie para definir los servicios o tipos de trabajo reutilizables del negocio."
      routePath="/catalog/services"
      domain="Catalog"
      purpose="Mantener un catalogo operativo reusable."
      nextStep="Definir items, categorias y estados de publicacion."
      bullets={['Servicios', 'Categorias', 'Configuracion operativa']}
    />
  );
}
