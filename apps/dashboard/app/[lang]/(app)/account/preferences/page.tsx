import { DashboardRoutePlaceholder } from '../../components/placeholders';

export default function AccountPreferencesPage() {
  return (
    <DashboardRoutePlaceholder
      eyebrow="Account"
      title="Preferencias"
      description="Preferencias personales del admin, como idioma, tema y ajustes individuales."
      routePath="/account/preferences"
      domain="Account"
      purpose="Configurar preferencias personales."
      nextStep="Definir tema, idioma y opciones adicionales."
      bullets={['Tema', 'Idioma', 'Preferencias personales']}
    />
  );
}
