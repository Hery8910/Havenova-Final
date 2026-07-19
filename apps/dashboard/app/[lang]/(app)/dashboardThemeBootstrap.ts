import type { DashboardShellLang } from './dashboardShell';

export function createDashboardThemeBootstrapScript(lang: DashboardShellLang) {
  const serializedLang = JSON.stringify(lang);

  return `(function () {
    var theme = 'light';
    try {
      var storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        theme = storedTheme;
      }
    } catch (error) {
      theme = 'light';
    }
    document.documentElement.setAttribute('lang', ${serializedLang});
    document.documentElement.setAttribute('data-theme', theme);
  })();`;
}
