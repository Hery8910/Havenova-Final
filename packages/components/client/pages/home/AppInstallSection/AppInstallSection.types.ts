export type AppInstallCta = {
  label: string;
  href: string;
};

export type AppInstallVariantTexts = {
  title: string;
  description: string;
};

export type AppInstallTexts = {
  installable: AppInstallVariantTexts & {
    info: string;
    cta: { label: string };
  };
  iosManual: AppInstallVariantTexts & {
    info: string;
  };
  unavailable: AppInstallVariantTexts & {
    cta: AppInstallCta;
  };
};

export type AppInstalledTexts = {
  loggedIn: AppInstallVariantTexts & {
    ctas: AppInstallCta[];
  };
  guest: AppInstallVariantTexts & {
    ctas: AppInstallCta[];
  };
};

export type AppInstallSectionTexts = {
  appInstall: AppInstallTexts;
  appInstalled: AppInstalledTexts;
};

export type AppInstallState = 'installed' | 'installable' | 'ios-manual' | 'unavailable';
export type AppInstalledVariant = 'logged-in' | 'guest';
export type AppNotInstalledState = Exclude<AppInstallState, 'installed'>;
export type AppNotInstalledContent =
  | AppInstallTexts['installable']
  | AppInstallTexts['iosManual']
  | AppInstallTexts['unavailable'];
