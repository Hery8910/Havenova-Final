export const userAuthRoutes = {
  login: '/user/login',
  register: '/user/register',
  forgotPassword: '/user/forgot-password',
  verifyEmail: '/user/verify-email',
  setPassword: '/user/set-password',
} as const;

export const clientSessionRoutes = {
  overview: '/profile',
  settings: '/profile/settings',
  notifications: '/profile/notifications',
  orders: '/profile/orders',
  requests: '/profile/requests',
} as const;

export const adminSessionRoutes = {
  overview: '/profile',
  edit: '/profile/edit',
  notifications: '/profile/notification',
  requests: '/profile/requests',
} as const;

export const workerSessionRoutes = {
  overview: '/profile',
  edit: '/profile/edit',
  notifications: '/profile/notifications',
  requests: '/profile/requests',
} as const;

export const sessionRouteCatalog = {
  client: {
    auth: userAuthRoutes,
    complement: clientSessionRoutes,
  },
  dashboard: {
    auth: {
      login: userAuthRoutes.login,
      forgotPassword: userAuthRoutes.forgotPassword,
      setPassword: userAuthRoutes.setPassword,
    },
    complement: adminSessionRoutes,
  },
  worker: {
    auth: {
      login: userAuthRoutes.login,
      forgotPassword: userAuthRoutes.forgotPassword,
      setPassword: userAuthRoutes.setPassword,
    },
    complement: workerSessionRoutes,
  },
} as const;

export type SessionAppKey = keyof typeof sessionRouteCatalog;
