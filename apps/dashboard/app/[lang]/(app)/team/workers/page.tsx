import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function TeamWorkersPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="People"
      title="Workers"
      description="Superficie para relacionar y administrar workers externos o subcontractados sin mezclar su dominio con la cuenta admin."
      routePath="/team/workers"
      domain="People"
      purpose="Gestionar workers como actor externo del tenant."
      nextStep="Definir onboarding, estado y permisos de lectura/escritura."
      bullets={['Workers vinculados', 'Estado', 'Invitaciones', 'Asignaciones']}
    />
  );
}
