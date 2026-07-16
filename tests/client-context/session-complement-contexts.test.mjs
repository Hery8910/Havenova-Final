import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const adminContextSource = fs.readFileSync('packages/contexts/admin/AdminContext.tsx', 'utf8');
const workerContextSource = fs.readFileSync('packages/contexts/worker/WorkerContext.tsx', 'utf8');
const sessionComplementSource = fs.readFileSync(
  'packages/contexts/sessionComplement/useSessionComplement.ts',
  'utf8'
);

test('admin context memoizes session-complement callbacks before passing them to the hook', () => {
  assert.match(adminContextSource, /const alertApi = useMemo/);
  assert.match(adminContextSource, /const createLoggedOutLocal = useCallback/);
  assert.match(adminContextSource, /const updateRemote = useCallback/);
  assert.match(adminContextSource, /const isNotFoundError = useCallback/);
  assert.match(adminContextSource, /missingEntityFallback: globalInternalErrorFallback,\s+popups,\s+alert: alertApi,/s);
  assert.match(
    adminContextSource,
    /email: resolvePreferredContactEmail\(previous\?\.email, auth\.email\)/
  );
  assert.match(
    adminContextSource,
    /email: resolvePreferredContactEmail\(record\.email, fallback\?\.email\)/
  );
});

test('worker context memoizes session-complement callbacks before passing them to the hook', () => {
  assert.match(workerContextSource, /const alertApi = useMemo/);
  assert.match(workerContextSource, /const createLoggedOutLocal = useCallback/);
  assert.match(workerContextSource, /const updateRemote = useCallback/);
  assert.match(workerContextSource, /const isNotFoundError = useCallback/);
  assert.match(workerContextSource, /missingEntityFallback: workerLoadFailedFallback,\s+popups,\s+alert: alertApi,/s);
  assert.match(
    workerContextSource,
    /email: resolvePreferredContactEmail\(previous\?\.email, auth\.email\)/
  );
  assert.doesNotMatch(workerContextSource, /email: auth\.email/);
});

test('session complement auto-reloads only once per effective session key', () => {
  assert.match(sessionComplementSource, /const autoReloadKeyRef = useRef<string \| null>\(null\)/);
  assert.match(sessionComplementSource, /const autoReloadKey = `\$\{storageKey\}:\$\{auth\.userClientId \?\? ''\}:\$\{auth\.role\}`/);
  assert.match(sessionComplementSource, /if \(autoReloadKeyRef\.current === autoReloadKey\) \{\s+return;\s+\}/s);
  assert.match(sessionComplementSource, /autoReloadKeyRef\.current = null;/);
});
