import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function AccountProfilePage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Account"
      title="Perfil personal"
      description="Superficie para editar los datos personales y la identidad visible del admin."
      routePath="/account/profile"
      domain="Account"
      purpose="Gestionar la cuenta personal del admin."
      nextStep="Definir campos, avatar y preferencias visibles."
      bullets={['Nombre', 'Avatar', 'Datos personales']}
    />
  );
}
