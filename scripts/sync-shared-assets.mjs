import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const sharedAssetsRoot = path.join(repoRoot, 'packages', 'assets', 'shared');
const appPublicRoots = [
  path.join(repoRoot, 'apps', 'client', 'public', 'shared'),
  path.join(repoRoot, 'apps', 'dashboard', 'public', 'shared'),
  path.join(repoRoot, 'apps', 'worker', 'public', 'shared'),
];

if (!existsSync(sharedAssetsRoot)) {
  throw new Error(`Shared assets source not found: ${sharedAssetsRoot}`);
}

const assetEntries = readdirSync(sharedAssetsRoot, { withFileTypes: true });

for (const publicRoot of appPublicRoots) {
  mkdirSync(publicRoot, { recursive: true });

  for (const entry of assetEntries) {
    const sourcePath = path.join(sharedAssetsRoot, entry.name);
    const destinationPath = path.join(publicRoot, entry.name);
    cpSync(sourcePath, destinationPath, {
      recursive: true,
      force: true,
    });
  }
}

console.log('Shared assets synchronized into app public/shared directories.');
