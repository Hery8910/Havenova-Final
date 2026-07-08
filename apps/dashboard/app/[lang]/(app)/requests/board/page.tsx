import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function RequestsBoardPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Workspace"
      title="Tablero de solicitudes"
      description="Vista tipo board para organizar solicitudes por etapa, estado o prioridad sin salir del dominio operativo."
      routePath="/requests/board"
      domain="Workspace"
      purpose="Visualizar solicitudes en flujo de trabajo."
      nextStep="Definir columnas y reglas de movimiento."
      bullets={['Board por estado', 'Drag and drop futuro', 'Prioridades visibles']}
    />
  );
}
