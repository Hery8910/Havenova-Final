import { DashboardRoutePlaceholder } from './components/placeholders';

export default function DashboardHomePage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Workspace"
      title="Resumen operativo del tenant"
      description="Esta pagina sera la entrada principal del dashboard y concentrara el estado general del negocio, actividad reciente y accesos rapidos para el equipo interno."
      routePath="/"
      domain="Workspace"
      purpose="Ofrecer una vision ejecutiva y operativa del tenant."
      nextStep="Definir los bloques reales del overview y sus KPIs."
      bullets={[
        'Resumen del tenant',
        'Estado operativo',
        'Actividad reciente',
        'Accesos rapidos',
      ]}
    />
  );
}
