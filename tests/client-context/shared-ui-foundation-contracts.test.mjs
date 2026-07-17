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

test('all apps resolve the frozen legacy baseline through one explicit entrypoint', () => {
  for (const cssSource of [clientGlobalCss, dashboardGlobalCss, workerGlobalCss]) {
    assert.equal(cssSource.trim(), "@import '../../../packages/styles/legacy.css';");
  }
});

test('legacy baseline retains each current stylesheet once and operational styles stay inactive', () => {
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

  assert.match(
    operationalFoundationReadme,
    /intentionally not\nimported by any production application yet/i
  );
  assert.doesNotMatch(legacyStyles, /@import '\.\/operational\//);
});

test('shared auth shell and asset sync use the shared asset namespace', () => {
  assert.match(authShellSource, /src="\/shared\/logos\/logo-small-dark\.webp"/);
  assert.match(syncScriptSource, /public', 'shared'/);
});
