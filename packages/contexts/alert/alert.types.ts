// alert.types.ts
export interface PopupText {
  title: string;
  description: string;
  close?: string;
  confirm?: string;
}

export interface PopupsTexts {
  button?: {
    accept: string;
    continue: string;
    close: string;
  };

  GLOBAL_LOADING?: PopupText;
  REGISTER_LOADING_SUBMIT?: PopupText;

  USER_REGISTER_SUCCESS?: PopupText;
  USER_LOGIN_SUCCESS?: PopupText;
  USER_TOS_NOT_ACCEPTED?: PopupText;
  USER_VERIFY_INVALID_TOKEN?: PopupText;
  USER_VERIFY_EXPIRED_TOKEN?: PopupText;
  USER_VERIFY_EMAIL_RESENDED?: PopupText;
  USER_FORGOT_PASSWORD_EMAIL_SENDED?: PopupText;
  USER_EDIT_EMPTY_NEW_PASSWORD?: PopupText;
  USER_PASSWORD_RESET_SUCCESS?: PopupText;
  USER_NEED_TO_LOGIN?: PopupText;
  USER_SESSION_EXPIRED?: PopupText;
  LOGOUT_SUCCESS?: PopupText;
  LOGOUT_FAILED?: PopupText;
  LOGOUT_CONFIRM?: PopupText;
  AUTH_GET_SUCCESS?: PopupText;

  EMAIL_VERIFICATION_RESENT?: PopupText;

  REFRESH_TOKEN_MISSING?: PopupText;
  REFRESH_TOKEN_INVALIDATED?: PopupText;
  REFRESH_TOKEN_EXPIRED?: PopupText;
  ACCESS_TOKEN_REFRESHED?: PopupText;

  CLIENT_FETCH_FAILED?: PopupText;

  GLOBAL_INTERNAL_ERROR?: PopupText;
  PERMISSION_DENIED?: PopupText;
  WORKER_LOAD_FAILED?: PopupText;
}

export type PopupCode = Exclude<keyof PopupsTexts, 'button'>;
