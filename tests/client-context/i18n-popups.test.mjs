import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const enPopups = JSON.parse(fs.readFileSync('packages/i18n/en/popups.json', 'utf8'));
const dePopups = JSON.parse(fs.readFileSync('packages/i18n/de/popups.json', 'utf8'));

const requiredDualCtaCodes = [
  'GLOBAL_INTERNAL_ERROR',
  'CLIENT_NOT_FOUND',
  'AUTH_FORBIDDEN',
  'USER_NEED_TO_LOGIN',
  'USER_SESSION_EXPIRED',
  'LOGOUT_CONFIRM',
  'PROFILE_ADDRESS_DELETE_CONFIRM',
];

test('popup key sets stay aligned between EN and DE', () => {
  const enKeys = Object.keys(enPopups).sort();
  const deKeys = Object.keys(dePopups).sort();
  assert.deepEqual(enKeys, deKeys);
});

test('codes requiring dual CTA define confirm and close in both locales', () => {
  for (const code of requiredDualCtaCodes) {
    assert.ok(enPopups[code], `Missing EN popup for ${code}`);
    assert.ok(dePopups[code], `Missing DE popup for ${code}`);
    assert.equal(typeof enPopups[code].confirm, 'string', `EN confirm missing for ${code}`);
    assert.equal(typeof enPopups[code].close, 'string', `EN close missing for ${code}`);
    assert.equal(typeof dePopups[code].confirm, 'string', `DE confirm missing for ${code}`);
    assert.equal(typeof dePopups[code].close, 'string', `DE close missing for ${code}`);
  }
});

test('legacy popup aliases retained for gradual migration still exist in both locales', () => {
  const legacyCodes = [
    'ACCESS_TOKEN_EXPIRED',
    'NO_ACCESS_TOKEN',
    'CLIENT_CREATE_SUCCESS',
    'CLIENT_FETCH_FAILED',
    'CLIENT_UPDATE_SUCCESS',
    'USER_EMAIL_ALREADY_REGISTERED',
    'USER_FORGOT_PASSWORD_EMAIL_SENDED',
    'USER_LOGIN_INVALID_CREDENTIALS',
    'USER_VERIFY_EMAIL_RESENDED',
  ];

  for (const code of legacyCodes) {
    assert.ok(enPopups[code], `Missing legacy EN popup for ${code}`);
    assert.ok(dePopups[code], `Missing legacy DE popup for ${code}`);
  }
});
