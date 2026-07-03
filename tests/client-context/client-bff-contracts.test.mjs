import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const clientServicesSource = fs.readFileSync('packages/services/client/clientServices.ts', 'utf8');
const serviceRequestServiceSource = fs.readFileSync(
  'packages/services/serviceRequest/serviceRequestService.ts',
  'utf8'
);
const cleaningRequestServiceSource = fs.readFileSync(
  'packages/services/cleaning/cleaningRequestService.ts',
  'utf8'
);
const contactServiceSource = fs.readFileSync('packages/services/contact/contactService.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const clientTenantRouteSource = fs.readFileSync(
  'apps/client/app/api/clients/tenant/[tenantKey]/route.ts',
  'utf8'
);
const dashboardTenantRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/clients/tenant/[tenantKey]/route.ts',
  'utf8'
);
const clientServiceRequestRouteSource = fs.readFileSync(
  'apps/client/app/api/home-services/service-request/route.ts',
  'utf8'
);
const clientContactRouteSource = fs.readFileSync('apps/client/app/api/contact/route.ts', 'utf8');
const clientContactItemRouteSource = fs.readFileSync(
  'apps/client/app/api/contact/[id]/route.ts',
  'utf8'
);
const clientContactRespondRouteSource = fs.readFileSync(
  'apps/client/app/api/contact/[id]/respond/route.ts',
  'utf8'
);
const dashboardContactRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/contact/route.ts',
  'utf8'
);

test('client bootstrap uses same-origin BFF in the browser and preserves SSR compatibility', () => {
  assert.match(clientServicesSource, /import api from '\.\.\/api\/api';/);
  assert.match(clientServicesSource, /import sameOriginApi from '\.\.\/api\/sameOriginApi';/);
  assert.match(clientServicesSource, /const getBootstrapApiClient = \(\) => \(typeof window === 'undefined' \? api : sameOriginApi\);/);
  assert.match(clientServicesSource, /getBootstrapApiClient\(\)\.get<ClientBootstrapResponse>/);
  assert.match(sameOriginApiSource, /withCredentials: true/);
});

test('tenant bootstrap BFF route is mounted in both apps', () => {
  assert.match(clientTenantRouteSource, /proxyBackendRoute/);
  assert.match(clientTenantRouteSource, /upstreamPath: `\/api\/clients\/tenant\/\$\{encodeURIComponent\(tenantKey\)\}`/);
  assert.match(dashboardTenantRouteSource, /proxyBackendRoute/);
  assert.match(dashboardTenantRouteSource, /upstreamPath: `\/api\/clients\/tenant\/\$\{encodeURIComponent\(tenantKey\)\}`/);
});

test('service request flows now use same-origin BFF and client mounts the proxy route', () => {
  assert.match(serviceRequestServiceSource, /import sameOriginApi from '\.\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(serviceRequestServiceSource, /import api from '\.\.\/api\/api';/);
  assert.match(cleaningRequestServiceSource, /import sameOriginApi from '\.\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(cleaningRequestServiceSource, /import api from '\.\.\/api\/api';/);
  assert.match(clientServiceRequestRouteSource, /proxyBackendRoute/);
  assert.match(clientServiceRequestRouteSource, /upstreamPath: '\/api\/home-services\/service-request'/);
});

test('contact flows now use same-origin BFF and expose mirrored routes for shared dashboard consumers', () => {
  assert.match(contactServiceSource, /import sameOriginApi from '\.\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(contactServiceSource, /import api from '\.\.\/api\/api';/);
  assert.match(contactServiceSource, /sameOriginApi\.post<ApiResponse<\{ id: string \}>>\('\/api\/contact'/);
  assert.match(contactServiceSource, /sameOriginApi\.get<ApiResponse<any\[]>>\('\/api\/contact'/);
  assert.match(clientContactRouteSource, /methods: \['GET', 'POST', 'DELETE'\]/);
  assert.match(clientContactItemRouteSource, /upstreamPath: `\/api\/contact\/\$\{encodeURIComponent\(id\)\}`/);
  assert.match(clientContactRespondRouteSource, /upstreamPath: `\/api\/contact\/\$\{encodeURIComponent\(id\)\}\/respond`/);
  assert.match(dashboardContactRouteSource, /methods: \['GET', 'POST', 'DELETE'\]/);
});
