import { Branding, Typography } from '../../types/client/clientTypes';

export function applyBrandingToDOM(themeBranding: Branding, typography: Typography) {
  const root = document.documentElement;

  const cssVars = {
    '--brand-primary': themeBranding.primaryColor,
    '--brand-secondary': themeBranding.secondaryColor,
    '--brand-accent': themeBranding.accentColor,
  };

  Object.entries(cssVars).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });

  // Tipografía Google Fonts
  if (typography.isGoogleFont && typography.googleFontUrl) {
    let existingLink = document.querySelector('link[data-brand-font]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = typography.googleFontUrl;
      link.setAttribute('data-brand-font', 'true');
      document.head.appendChild(link);
    } else {
      existingLink.setAttribute('href', typography.googleFontUrl);
    }
  }
}
