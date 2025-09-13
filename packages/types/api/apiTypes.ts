export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message?: string;
  data?: T;
  [key: string]: any; 
}
