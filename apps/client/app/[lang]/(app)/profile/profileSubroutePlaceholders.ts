export type ProfileSubroutePlaceholderKey = 'orders' | 'requests' | 'notifications';

type ProfileSubroutePlaceholderCopy = {
  title: string;
  eyebrow: string;
  description: string;
  nextStep: string;
  bullets: string[];
};

type ProfileSubroutePlaceholderCopyByLang = Record<'de' | 'en' | 'es', ProfileSubroutePlaceholderCopy>;

const PROFILE_SUBROUTE_PLACEHOLDERS: Record<
  ProfileSubroutePlaceholderKey,
  ProfileSubroutePlaceholderCopyByLang
> = {
  orders: {
    en: {
      title: 'Work orders',
      eyebrow: 'Profile workspace',
      description:
        'This route is intentionally kept as a placeholder while the client order domain is defined more explicitly.',
      nextStep: 'Document the order data contract before introducing filters, tables, or lifecycle states.',
      bullets: [
        'Navigation target is active and stable.',
        'Metadata exists for the route.',
        'No fake list or mock service history should be reintroduced here.',
      ],
    },
    de: {
      title: 'Arbeitsaufträge',
      eyebrow: 'Profilbereich',
      description:
        'Diese Route bleibt bewusst ein Placeholder, bis der Auftragsbereich im Client klarer definiert ist.',
      nextStep:
        'Zuerst den Datenvertrag für Aufträge dokumentieren, erst danach Filter, Tabellen oder Statuslogik einführen.',
      bullets: [
        'Das Navigationsziel ist aktiv und stabil.',
        'Die Route besitzt bereits Metadata.',
        'Hier sollen keine künstlichen Listen oder Mock-Verläufe zurückkehren.',
      ],
    },
    es: {
      title: 'Órdenes de trabajo',
      eyebrow: 'Espacio de perfil',
      description:
        'Esta ruta se mantiene como placeholder de forma deliberada mientras el dominio de órdenes del cliente se define con más claridad.',
      nextStep:
        'Primero hay que documentar el contrato de datos de órdenes antes de introducir filtros, tablas o estados de ciclo de vida.',
      bullets: [
        'El destino de navegación ya está activo y estable.',
        'La ruta ya tiene metadata.',
        'Aquí no deben volver listas falsas ni historiales mock.',
      ],
    },
  },
  requests: {
    en: {
      title: 'Work requests',
      eyebrow: 'Profile workspace',
      description:
        'This route keeps the navigation contract alive, but it is not yet a real request-management page.',
      nextStep:
        'Replace the old mock-table idea with a documented page baseline once the request domain and UX are defined.',
      bullets: [
        'The previous mock scaffold was removed.',
        'The route stays visible as an explicit placeholder, not hidden debt.',
        'Future work should start from documentation, not from commented sample data.',
      ],
    },
    de: {
      title: 'Anfragen',
      eyebrow: 'Profilbereich',
      description:
        'Diese Route hält den Navigationsvertrag aktiv, ist aber noch keine echte Verwaltungsseite für Anfragen.',
      nextStep:
        'Die alte Mock-Tabellen-Idee soll erst dann ersetzt werden, wenn Domain und UX der Anfragen sauber dokumentiert sind.',
      bullets: [
        'Das frühere Mock-Scaffold wurde entfernt.',
        'Die Route bleibt als expliziter Placeholder sichtbar und nicht als versteckte Schuld.',
        'Spätere Arbeit soll mit Dokumentation beginnen, nicht mit auskommentierten Beispieldaten.',
      ],
    },
    es: {
      title: 'Solicitudes de trabajo',
      eyebrow: 'Espacio de perfil',
      description:
        'Esta ruta mantiene vivo el contrato de navegación, pero todavía no es una página real de gestión de solicitudes.',
      nextStep:
        'La antigua idea de tabla mock debe sustituirse solo cuando el dominio y la UX de solicitudes estén documentados.',
      bullets: [
        'Se eliminó el scaffold mock anterior.',
        'La ruta queda visible como placeholder explícito y no como deuda oculta.',
        'El trabajo futuro debe arrancar desde documentación, no desde datos comentados.',
      ],
    },
  },
  notifications: {
    en: {
      title: 'Notifications',
      eyebrow: 'Profile workspace',
      description:
        'The route is reserved for the future client notification center and intentionally remains lightweight for now.',
      nextStep:
        'Continue from the notification domain plan before building UI states, filters, or feed interactions.',
      bullets: [
        'The route already has dedicated metadata.',
        'The implementation target is tracked in docs/notification-client-plan.md.',
        'This placeholder should stay small until the shared notification domain exists.',
      ],
    },
    de: {
      title: 'Benachrichtigungen',
      eyebrow: 'Profilbereich',
      description:
        'Die Route ist für das künftige Notification Center des Clients reserviert und bleibt vorerst bewusst leichtgewichtig.',
      nextStep:
        'Vor UI-Zuständen, Filtern oder Feed-Interaktionen soll zuerst der Plan für das Notification-Domain weitergeführt werden.',
      bullets: [
        'Die Route besitzt bereits eigene Metadata.',
        'Das Implementierungsziel ist in docs/notification-client-plan.md dokumentiert.',
        'Dieser Placeholder soll klein bleiben, bis das gemeinsame Notification-Domain existiert.',
      ],
    },
    es: {
      title: 'Notificaciones',
      eyebrow: 'Espacio de perfil',
      description:
        'La ruta queda reservada para el futuro centro de notificaciones del cliente y por ahora se mantiene ligera de forma deliberada.',
      nextStep:
        'Hay que continuar desde el plan del dominio de notificaciones antes de construir estados de UI, filtros o interacciones del feed.',
      bullets: [
        'La ruta ya tiene metadata propia.',
        'El objetivo de implementación está trazado en docs/notification-client-plan.md.',
        'Este placeholder debe seguir pequeño hasta que exista el dominio compartido de notificaciones.',
      ],
    },
  },
};

export function getProfileSubroutePlaceholder(
  key: ProfileSubroutePlaceholderKey,
  lang: 'de' | 'en' | 'es'
) {
  return PROFILE_SUBROUTE_PLACEHOLDERS[key][lang];
}
