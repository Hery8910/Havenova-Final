import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const clientPackage = JSON.parse(fs.readFileSync('apps/client/package.json', 'utf8'));
const dashboardPackage = JSON.parse(fs.readFileSync('apps/dashboard/package.json', 'utf8'));
const workerPackage = JSON.parse(fs.readFileSync('apps/worker/package.json', 'utf8'));
const clientGlobalCss = fs.readFileSync('apps/client/app/global.css', 'utf8');
const dashboardGlobalCss = fs.readFileSync('apps/dashboard/app/global.css', 'utf8');
const workerGlobalCss = fs.readFileSync('apps/worker/app/global.css', 'utf8');
const legacyStyles = fs.readFileSync('packages/styles/legacy.css', 'utf8');
const operationalFoundationReadme = fs.readFileSync(
  'packages/styles/operational/README.md',
  'utf8'
);
const operationalShellStyles = fs.readFileSync('packages/styles/operational/shell.css', 'utf8');
const dashboardWorkspaceShell = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/shell/DashboardWorkspaceShell.tsx',
  'utf8'
);
const dashboardAuthLayout = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/layout.tsx',
  'utf8'
);
const authShellSource = fs.readFileSync(
  'packages/components/client/user/auth/authShell/AuthPageShell.tsx',
  'utf8'
);
const syncScriptSource = fs.readFileSync('scripts/sync-shared-assets.mjs', 'utf8');

test('root and app scripts sync shared assets before dev/build', () => {
  assert.equal(rootPackage.scripts['sync:assets'], 'node scripts/sync-shared-assets.mjs');
  assert.match(rootPackage.scripts.dev, /pnpm sync:assets/);
  assert.match(rootPackage.scripts.build, /pnpm sync:assets/);
  assert.match(clientPackage.scripts.dev, /sync-shared-assets/);
  assert.match(dashboardPackage.scripts.dev, /sync-shared-assets/);
  assert.match(workerPackage.scripts.dev, /sync-shared-assets/);
});

test('Client and Worker resolve only the frozen legacy baseline', () => {
  for (const cssSource of [clientGlobalCss, workerGlobalCss]) {
    assert.equal(cssSource.trim(), "@import '../../../packages/styles/legacy.css';");
  }
});

test('Dashboard loads legacy and scoped operational foundations without cross-importing them', () => {
  assert.match(dashboardGlobalCss, /@import '\.\.\/\.\.\/\.\.\/packages\/styles\/legacy\.css';/);
  assert.match(
    dashboardGlobalCss,
    /@import '\.\.\/\.\.\/\.\.\/packages\/styles\/operational\/shell\.css';/
  );
  assert.doesNotMatch(operationalShellStyles, /@import/);
  assert.match(operationalShellStyles, /\[data-ui-foundation='operational'\]/);
  assert.match(
    operationalShellStyles,
    /\[data-theme='dark'\] \[data-ui-foundation='operational'\]/
  );
  assert.doesNotMatch(operationalShellStyles, /(^|\n)(:root|html|body|\*)\s*[,{]/);
});

test('only the authenticated Dashboard workspace receives the operational boundary', () => {
  assert.match(dashboardWorkspaceShell, /data-ui-foundation="operational"/);
  assert.doesNotMatch(dashboardAuthLayout, /data-ui-foundation="operational"/);
  assert.doesNotMatch(dashboardWorkspaceShell, /card--|className=\{`button|app-anim-/);
});

test('legacy baseline retains each current stylesheet once and never imports operational styles', () => {
  for (const stylesheet of [
    'tokens',
    'base',
    'typography',
    'badges',
    'buttons',
    'forms',
    'cards',
    'motion',
    'helpers',
  ]) {
    assert.equal(
      legacyStyles.split(`@import './${stylesheet}.css';`).length - 1,
      1,
      `${stylesheet}.css must be loaded once by the legacy baseline`
    );
  }

  assert.match(operationalFoundationReadme, /Only the authenticated Dashboard workspace\nimports/i);
  assert.doesNotMatch(legacyStyles, /@import '\.\/operational\//);
});

test('shared auth shell and asset sync use the shared asset namespace', () => {
  assert.match(authShellSource, /src="\/shared\/logos\/logo-small-dark\.webp"/);
  assert.match(syncScriptSource, /public', 'shared'/);
});
