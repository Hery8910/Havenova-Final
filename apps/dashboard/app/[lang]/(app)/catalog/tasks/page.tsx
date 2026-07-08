import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function CatalogTasksPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Catalog"
      title="Catalogo de tareas"
      description="Ruta estructural para el catalogo de tareas reutilizables que hoy reemplaza a la antigua superficie global-task-catalog."
      routePath="/catalog/tasks"
      domain="Catalog"
      purpose="Agrupar tareas y bundles reutilizables."
      nextStep="Definir taxonomia, filtros y formas de edicion."
      bullets={['Tareas', 'Bundles', 'Filtros', 'Plantillas']}
    />
  );
}
