export type DashboardShellLang = 'de' | 'en' | 'es';

export type DashboardShellIcon =
  | 'overview'
  | 'requests'
  | 'properties'
  | 'clients'
  | 'admins'
  | 'workers'
  | 'managers'
  | 'services'
  | 'tasks'
  | 'templates'
  | 'automations'
  | 'messages'
  | 'notifications'
  | 'activity'
  | 'company'
  | 'account'
  | 'general'
  | 'branding'
  | 'contact'
  | 'legal'
  | 'operations'
  | 'integrations'
  | 'billing'
  | 'security'
  | 'preferences';

export type DashboardShellSection = {
  key: string;
  label: string;
  icon: DashboardShellIcon;
  items: DashboardShellItem[];
};

export type DashboardShellItem = {
  key: string;
  label: string;
  href: string;
  icon: DashboardShellIcon;
  match?: 'exact' | 'prefix';
  level?: number;
};

type DashboardShellRouteMeta = {
  key: string;
  section: keyof DashboardShellCopy['sections'];
  title: string;
  matcher: RegExp;
};

type DashboardShellCopy = {
  navigationLabel: string;
  profileButton: string;
  sections: {
    workspace: string;
    people: string;
    catalog: string;
    communication: string;
    company: string;
    account: string;
  };
  items: {
    overview: string;
    requests: string;
    board: string;
    calendar: string;
    properties: string;
    users: string;
    clients: string;
    admins: string;
    workers: string;
    managers: string;
    services: string;
    tasks: string;
    templates: string;
    automations: string;
    messages: string;
    notifications: string;
    activity: string;
    companyOverview: string;
    general: string;
    branding: string;
    contact: string;
    legal: string;
    operations: string;
    integrations: string;
    billing: string;
    security: string;
    accountOverview: string;
    profile: string;
    preferences: string;
  };
  headers: {
    overview: string;
    requests: string;
    requestBoard: string;
    requestCalendar: string;
    requestDetail: string;
    properties: string;
    propertyDetail: string;
    propertyRequests: string;
    propertyDocuments: string;
    users: string;
    userDetail: string;
    clients: string;
    clientDetail: string;
    admins: string;
    adminDetail: string;
    workers: string;
    workerDetail: string;
    managers: string;
    managerDetail: string;
    services: string;
    tasks: string;
    templates: string;
    automations: string;
    messages: string;
    threadDetail: string;
    notifications: string;
    activity: string;
    companyOverview: string;
    companyGeneral: string;
    companyBranding: string;
    companyContact: string;
    companyLegal: string;
    companyOperations: string;
    companyIntegrations: string;
    companyBilling: string;
    companySecurity: string;
    accountOverview: string;
    accountProfile: string;
    accountPreferences: string;
    accountSecurity: string;
    accountNotifications: string;
  };
};

const copyByLang: Record<DashboardShellLang, DashboardShellCopy> = {
  es: {
    navigationLabel: 'Navegación del dashboard',
    profileButton: 'Abrir cuenta',
    sections: {
      workspace: 'Workspace',
      people: 'Personas',
      catalog: 'Catálogo',
      communication: 'Seguimiento',
      company: 'Empresa',
      account: 'Cuenta',
    },
    items: {
      overview: 'Resumen',
      requests: 'Solicitudes',
      board: 'Tablero',
      calendar: 'Calendario',
      properties: 'Propiedades',
      users: 'Usuarios',
      clients: 'Clientes',
      admins: 'Admins',
      workers: 'Workers',
      managers: 'Managers',
      services: 'Servicios',
      tasks: 'Tareas',
      templates: 'Plantillas',
      automations: 'Automatizaciones',
      messages: 'Mensajes',
      notifications: 'Notificaciones',
      activity: 'Actividad',
      companyOverview: 'Overview',
      general: 'General',
      branding: 'Branding',
      contact: 'Contacto',
      legal: 'Legal',
      operations: 'Operación',
      integrations: 'Integraciones',
      billing: 'Facturación',
      security: 'Seguridad',
      accountOverview: 'Overview',
      profile: 'Perfil',
      preferences: 'Preferencias',
    },
    headers: {
      overview: 'Resumen operativo',
      requests: 'Solicitudes',
      requestBoard: 'Tablero de solicitudes',
      requestCalendar: 'Calendario de solicitudes',
      requestDetail: 'Detalle de solicitud',
      properties: 'Propiedades',
      propertyDetail: 'Detalle de propiedad',
      propertyRequests: 'Solicitudes de la propiedad',
      propertyDocuments: 'Documentos de la propiedad',
      users: 'Usuarios de la plataforma',
      userDetail: 'Detalle de usuario',
      clients: 'Clientes',
      clientDetail: 'Detalle de cliente',
      admins: 'Admins',
      adminDetail: 'Detalle de admin',
      workers: 'Workers',
      workerDetail: 'Detalle de worker',
      managers: 'Managers',
      managerDetail: 'Detalle de manager',
      services: 'Servicios',
      tasks: 'Tareas',
      templates: 'Plantillas',
      automations: 'Automatizaciones',
      messages: 'Mensajes',
      threadDetail: 'Detalle de conversación',
      notifications: 'Notificaciones',
      activity: 'Actividad',
      companyOverview: 'Overview de empresa',
      companyGeneral: 'Datos generales',
      companyBranding: 'Branding',
      companyContact: 'Contacto',
      companyLegal: 'Información legal',
      companyOperations: 'Operación',
      companyIntegrations: 'Integraciones',
      companyBilling: 'Facturación',
      companySecurity: 'Seguridad empresarial',
      accountOverview: 'Overview de cuenta',
      accountProfile: 'Perfil personal',
      accountPreferences: 'Preferencias',
      accountSecurity: 'Seguridad de cuenta',
      accountNotifications: 'Notificaciones de cuenta',
    },
  },
  en: {
    navigationLabel: 'Dashboard navigation',
    profileButton: 'Open account',
    sections: {
      workspace: 'Workspace',
      people: 'People',
      catalog: 'Catalog',
      communication: 'Tracking',
      company: 'Company',
      account: 'Account',
    },
    items: {
      overview: 'Overview',
      requests: 'Requests',
      board: 'Board',
      calendar: 'Calendar',
      properties: 'Properties',
      users: 'Users',
      clients: 'Clients',
      admins: 'Admins',
      workers: 'Workers',
      managers: 'Managers',
      services: 'Services',
      tasks: 'Tasks',
      templates: 'Templates',
      automations: 'Automations',
      messages: 'Messages',
      notifications: 'Notifications',
      activity: 'Activity',
      companyOverview: 'Overview',
      general: 'General',
      branding: 'Branding',
      contact: 'Contact',
      legal: 'Legal',
      operations: 'Operations',
      integrations: 'Integrations',
      billing: 'Billing',
      security: 'Security',
      accountOverview: 'Overview',
      profile: 'Profile',
      preferences: 'Preferences',
    },
    headers: {
      overview: 'Operational overview',
      requests: 'Requests',
      requestBoard: 'Request board',
      requestCalendar: 'Request calendar',
      requestDetail: 'Request detail',
      properties: 'Properties',
      propertyDetail: 'Property detail',
      propertyRequests: 'Property requests',
      propertyDocuments: 'Property documents',
      users: 'Platform users',
      userDetail: 'User detail',
      clients: 'Clients',
      clientDetail: 'Client detail',
      admins: 'Admins',
      adminDetail: 'Admin detail',
      workers: 'Workers',
      workerDetail: 'Worker detail',
      managers: 'Managers',
      managerDetail: 'Manager detail',
      services: 'Services',
      tasks: 'Tasks',
      templates: 'Templates',
      automations: 'Automations',
      messages: 'Messages',
      threadDetail: 'Conversation detail',
      notifications: 'Notifications',
      activity: 'Activity',
      companyOverview: 'Company overview',
      companyGeneral: 'General settings',
      companyBranding: 'Brand settings',
      companyContact: 'Contact settings',
      companyLegal: 'Legal settings',
      companyOperations: 'Operational settings',
      companyIntegrations: 'Integrations',
      companyBilling: 'Billing',
      companySecurity: 'Company security',
      accountOverview: 'Account overview',
      accountProfile: 'Personal profile',
      accountPreferences: 'Preferences',
      accountSecurity: 'Account security',
      accountNotifications: 'Account notifications',
    },
  },
  de: {
    navigationLabel: 'Dashboard-Navigation',
    profileButton: 'Konto öffnen',
    sections: {
      workspace: 'Workspace',
      people: 'Personen',
      catalog: 'Katalog',
      communication: 'Verlauf',
      company: 'Unternehmen',
      account: 'Konto',
    },
    items: {
      overview: 'Überblick',
      requests: 'Anfragen',
      board: 'Board',
      calendar: 'Kalender',
      properties: 'Immobilien',
      users: 'Nutzer',
      clients: 'Kunden',
      admins: 'Admins',
      workers: 'Workers',
      managers: 'Manager',
      services: 'Services',
      tasks: 'Aufgaben',
      templates: 'Vorlagen',
      automations: 'Automationen',
      messages: 'Nachrichten',
      notifications: 'Benachrichtigungen',
      activity: 'Aktivität',
      companyOverview: 'Überblick',
      general: 'Allgemein',
      branding: 'Branding',
      contact: 'Kontakt',
      legal: 'Rechtliches',
      operations: 'Betrieb',
      integrations: 'Integrationen',
      billing: 'Abrechnung',
      security: 'Sicherheit',
      accountOverview: 'Überblick',
      profile: 'Profil',
      preferences: 'Präferenzen',
    },
    headers: {
      overview: 'Operativer Überblick',
      requests: 'Anfragen',
      requestBoard: 'Anfragen-Board',
      requestCalendar: 'Anfragen-Kalender',
      requestDetail: 'Anfragedetail',
      properties: 'Immobilien',
      propertyDetail: 'Immobiliendetail',
      propertyRequests: 'Anfragen der Immobilie',
      propertyDocuments: 'Dokumente der Immobilie',
      users: 'Plattformnutzer',
      userDetail: 'Nutzerdetail',
      clients: 'Kunden',
      clientDetail: 'Kundendetail',
      admins: 'Admins',
      adminDetail: 'Admin-Detail',
      workers: 'Workers',
      workerDetail: 'Worker-Detail',
      managers: 'Manager',
      managerDetail: 'Manager-Detail',
      services: 'Services',
      tasks: 'Aufgaben',
      templates: 'Vorlagen',
      automations: 'Automationen',
      messages: 'Nachrichten',
      threadDetail: 'Konversationsdetail',
      notifications: 'Benachrichtigungen',
      activity: 'Aktivität',
      companyOverview: 'Unternehmensüberblick',
      companyGeneral: 'Allgemeine Daten',
      companyBranding: 'Branding',
      companyContact: 'Kontaktdaten',
      companyLegal: 'Rechtliche Angaben',
      companyOperations: 'Betrieb',
      companyIntegrations: 'Integrationen',
      companyBilling: 'Abrechnung',
      companySecurity: 'Unternehmenssicherheit',
      accountOverview: 'Kontoüberblick',
      accountProfile: 'Persönliches Profil',
      accountPreferences: 'Präferenzen',
      accountSecurity: 'Kontosicherheit',
      accountNotifications: 'Kontobenachrichtigungen',
    },
  },
};

function buildRouteMeta(copy: DashboardShellCopy): DashboardShellRouteMeta[] {
  return [
    { key: 'property-documents', section: 'workspace', title: copy.headers.propertyDocuments, matcher: /^\/properties\/[^/]+\/documents$/ },
    { key: 'property-requests', section: 'workspace', title: copy.headers.propertyRequests, matcher: /^\/properties\/[^/]+\/requests$/ },
    { key: 'request-board', section: 'workspace', title: copy.headers.requestBoard, matcher: /^\/requests\/board$/ },
    { key: 'request-calendar', section: 'workspace', title: copy.headers.requestCalendar, matcher: /^\/requests\/calendar$/ },
    { key: 'request-detail', section: 'workspace', title: copy.headers.requestDetail, matcher: /^\/requests\/[^/]+$/ },
    { key: 'property-detail', section: 'workspace', title: copy.headers.propertyDetail, matcher: /^\/properties\/[^/]+$/ },
    { key: 'user-detail', section: 'people', title: copy.headers.userDetail, matcher: /^\/people\/users\/[^/]+$/ },
    { key: 'client-detail', section: 'workspace', title: copy.headers.clientDetail, matcher: /^\/clients\/[^/]+$/ },
    { key: 'admin-detail', section: 'people', title: copy.headers.adminDetail, matcher: /^\/team\/admins\/[^/]+$/ },
    { key: 'worker-detail', section: 'people', title: copy.headers.workerDetail, matcher: /^\/team\/workers\/[^/]+$/ },
    { key: 'manager-detail', section: 'people', title: copy.headers.managerDetail, matcher: /^\/network\/managers\/[^/]+$/ },
    { key: 'thread-detail', section: 'communication', title: copy.headers.threadDetail, matcher: /^\/messages\/[^/]+$/ },
    { key: 'company-general', section: 'company', title: copy.headers.companyGeneral, matcher: /^\/company\/general$/ },
    { key: 'company-branding', section: 'company', title: copy.headers.companyBranding, matcher: /^\/company\/branding$/ },
    { key: 'company-contact', section: 'company', title: copy.headers.companyContact, matcher: /^\/company\/contact$/ },
    { key: 'company-legal', section: 'company', title: copy.headers.companyLegal, matcher: /^\/company\/legal$/ },
    { key: 'company-operations', section: 'company', title: copy.headers.companyOperations, matcher: /^\/company\/operations$/ },
    { key: 'company-integrations', section: 'company', title: copy.headers.companyIntegrations, matcher: /^\/company\/integrations$/ },
    { key: 'company-billing', section: 'company', title: copy.headers.companyBilling, matcher: /^\/company\/billing$/ },
    { key: 'company-security', section: 'company', title: copy.headers.companySecurity, matcher: /^\/company\/security$/ },
    { key: 'account-profile', section: 'account', title: copy.headers.accountProfile, matcher: /^\/account\/profile$/ },
    { key: 'account-preferences', section: 'account', title: copy.headers.accountPreferences, matcher: /^\/account\/preferences$/ },
    { key: 'account-security', section: 'account', title: copy.headers.accountSecurity, matcher: /^\/account\/security$/ },
    { key: 'account-notifications', section: 'account', title: copy.headers.accountNotifications, matcher: /^\/account\/notifications$/ },
    { key: 'overview', section: 'workspace', title: copy.headers.overview, matcher: /^\/$/ },
    { key: 'requests', section: 'workspace', title: copy.headers.requests, matcher: /^\/requests$/ },
    { key: 'properties', section: 'workspace', title: copy.headers.properties, matcher: /^\/properties$/ },
    { key: 'users', section: 'people', title: copy.headers.users, matcher: /^\/people\/users$/ },
    { key: 'clients', section: 'workspace', title: copy.headers.clients, matcher: /^\/clients$/ },
    { key: 'admins', section: 'people', title: copy.headers.admins, matcher: /^\/team\/admins$/ },
    { key: 'workers', section: 'people', title: copy.headers.workers, matcher: /^\/team\/workers$/ },
    { key: 'managers', section: 'people', title: copy.headers.managers, matcher: /^\/network\/managers$/ },
    { key: 'services', section: 'catalog', title: copy.headers.services, matcher: /^\/catalog\/services$/ },
    { key: 'tasks', section: 'catalog', title: copy.headers.tasks, matcher: /^\/catalog\/tasks$/ },
    { key: 'templates', section: 'catalog', title: copy.headers.templates, matcher: /^\/catalog\/templates$/ },
    { key: 'automations', section: 'catalog', title: copy.headers.automations, matcher: /^\/catalog\/automations$/ },
    { key: 'messages', section: 'communication', title: copy.headers.messages, matcher: /^\/messages$/ },
    { key: 'notifications', section: 'communication', title: copy.headers.notifications, matcher: /^\/notifications$/ },
    { key: 'activity', section: 'communication', title: copy.headers.activity, matcher: /^\/activity$/ },
    { key: 'company-overview', section: 'company', title: copy.headers.companyOverview, matcher: /^\/company$/ },
    { key: 'account-overview', section: 'account', title: copy.headers.accountOverview, matcher: /^\/account$/ },
  ];
}

export function getDashboardShellCopy(lang: DashboardShellLang) {
  return copyByLang[lang];
}

export function getDashboardNavSections(lang: DashboardShellLang) {
  const copy = getDashboardShellCopy(lang);

  const mainSections: DashboardShellSection[] = [
    {
      key: 'workspace',
      label: copy.sections.workspace,
      icon: 'overview',
      items: [
        { key: 'overview', label: copy.items.overview, href: '/', icon: 'overview', match: 'exact' },
        { key: 'requests', label: copy.items.requests, href: '/requests', icon: 'requests', match: 'prefix' },
        { key: 'request-board', label: copy.items.board, href: '/requests/board', icon: 'requests', match: 'exact', level: 1 },
        { key: 'request-calendar', label: copy.items.calendar, href: '/requests/calendar', icon: 'requests', match: 'exact', level: 1 },
        { key: 'properties', label: copy.items.properties, href: '/properties', icon: 'properties', match: 'prefix' },
      ],
    },
    {
      key: 'people',
      label: copy.sections.people,
      icon: 'clients',
      items: [
        { key: 'users', label: copy.items.users, href: '/people/users', icon: 'clients', match: 'prefix' },
        { key: 'admins', label: copy.items.admins, href: '/team/admins', icon: 'admins', match: 'prefix' },
        { key: 'workers', label: copy.items.workers, href: '/team/workers', icon: 'workers', match: 'prefix' },
        { key: 'managers', label: copy.items.managers, href: '/network/managers', icon: 'managers', match: 'prefix' },
      ],
    },
    {
      key: 'catalog',
      label: copy.sections.catalog,
      icon: 'tasks',
      items: [
        { key: 'services', label: copy.items.services, href: '/catalog/services', icon: 'services', match: 'exact' },
        { key: 'tasks', label: copy.items.tasks, href: '/catalog/tasks', icon: 'tasks', match: 'exact' },
        { key: 'templates', label: copy.items.templates, href: '/catalog/templates', icon: 'templates', match: 'exact' },
        { key: 'automations', label: copy.items.automations, href: '/catalog/automations', icon: 'automations', match: 'exact' },
      ],
    },
    {
      key: 'communication',
      label: copy.sections.communication,
      icon: 'messages',
      items: [
        { key: 'messages', label: copy.items.messages, href: '/messages', icon: 'messages', match: 'prefix' },
        { key: 'notifications', label: copy.items.notifications, href: '/notifications', icon: 'notifications', match: 'exact' },
        { key: 'activity', label: copy.items.activity, href: '/activity', icon: 'activity', match: 'exact' },
      ],
    },
  ];

  const footerSections: DashboardShellSection[] = [
    {
      key: 'company',
      label: copy.sections.company,
      icon: 'company',
      items: [
        { key: 'company-overview', label: copy.items.companyOverview, href: '/company', icon: 'company', match: 'exact' },
        { key: 'company-general', label: copy.items.general, href: '/company/general', icon: 'general', match: 'exact', level: 1 },
        { key: 'company-branding', label: copy.items.branding, href: '/company/branding', icon: 'branding', match: 'exact', level: 1 },
        { key: 'company-contact', label: copy.items.contact, href: '/company/contact', icon: 'contact', match: 'exact', level: 1 },
        { key: 'company-legal', label: copy.items.legal, href: '/company/legal', icon: 'legal', match: 'exact', level: 1 },
        { key: 'company-operations', label: copy.items.operations, href: '/company/operations', icon: 'operations', match: 'exact', level: 1 },
        { key: 'company-integrations', label: copy.items.integrations, href: '/company/integrations', icon: 'integrations', match: 'exact', level: 1 },
        { key: 'company-billing', label: copy.items.billing, href: '/company/billing', icon: 'billing', match: 'exact', level: 1 },
        { key: 'company-security', label: copy.items.security, href: '/company/security', icon: 'security', match: 'exact', level: 1 },
      ],
    },
    {
      key: 'account',
      label: copy.sections.account,
      icon: 'account',
      items: [
        { key: 'account-overview', label: copy.items.accountOverview, href: '/account', icon: 'account', match: 'exact' },
        { key: 'account-profile', label: copy.items.profile, href: '/account/profile', icon: 'account', match: 'exact', level: 1 },
        { key: 'account-preferences', label: copy.items.preferences, href: '/account/preferences', icon: 'preferences', match: 'exact', level: 1 },
        { key: 'account-security', label: copy.items.security, href: '/account/security', icon: 'security', match: 'exact', level: 1 },
        { key: 'account-notifications', label: copy.items.notifications, href: '/account/notifications', icon: 'notifications', match: 'exact', level: 1 },
      ],
    },
  ];

  return {
    navigationLabel: copy.navigationLabel,
    profileButton: copy.profileButton,
    mainSections,
    footerSections,
  };
}

export function normalizeDashboardPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const strippedPath = segments.length <= 1 ? '/' : `/${segments.slice(1).join('/')}`;
  return strippedPath === '' ? '/' : strippedPath;
}

export function resolveDashboardHeaderMeta(pathname: string, lang: DashboardShellLang) {
  const copy = getDashboardShellCopy(lang);
  const normalizedPath = normalizeDashboardPathname(pathname);
  const matchedRoute = buildRouteMeta(copy).find((route) => route.matcher.test(normalizedPath));
  const rawRouteLabel =
    normalizedPath === '/'
      ? lang === 'es'
        ? 'workspace/overview'
        : lang === 'de'
          ? 'workspace/uberblick'
          : 'workspace/overview'
      : normalizedPath.replace(/^\//, '');
  const routeLabel = rawRouteLabel.split('/').filter(Boolean).join(' / ');

  if (!matchedRoute) {
    return {
      eyebrow: copy.sections.workspace,
      routeLabel,
      title: copy.headers.overview,
      profileButton: copy.profileButton,
    };
  }

  return {
    eyebrow: copy.sections[matchedRoute.section],
    routeLabel,
    title: matchedRoute.title,
    profileButton: copy.profileButton,
  };
}
