export class AppConstants {
  static ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
  static REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
  static USER_KEY = 'USER';

  static PUBLIC_URLS = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  static ERROR_SEVERITY = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
  };

  static LOG_LEVEL = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  };
}
