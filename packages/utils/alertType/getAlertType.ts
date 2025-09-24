export type AlertType = 'success' | 'error' | 'warning' | 'info';

export function getAlertType(status: number): AlertType {
  if (status >= 200 && status < 300) return 'success';
  if (status >= 300 && status < 400) return 'info';
  if (status >= 400 && status < 500) return 'warning';
  if (status >= 500) return 'error';
  return 'info';
}
