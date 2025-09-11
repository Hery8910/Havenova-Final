import { ApiResponse } from '../types/api';
import { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, ChangePasswordPayload, UpdateUserPayload, User, VerifyEmailPayload } from '../types/User';
export declare const registerUser: (payload: RegisterPayload) => Promise<ApiResponse<User>>;
export declare const loginUser: (payload: LoginPayload) => Promise<ApiResponse<User>>;
export declare const updateUser: (payload: UpdateUserPayload) => Promise<ApiResponse<User>>;
export declare const chagePassword: (payload: ChangePasswordPayload) => Promise<ApiResponse<User>>;
export declare const forgotPassword: (payload: ForgotPasswordPayload) => Promise<ApiResponse<User>>;
export declare const resetPassword: (payload: ResetPasswordPayload) => Promise<ApiResponse<User>>;
export declare const logoutUser: () => Promise<ApiResponse<null>>;
export declare const getUser: (clientId: string) => Promise<ApiResponse<User>>;
export declare const resendVerificationEmail: (payload: VerifyEmailPayload) => Promise<ApiResponse<null>>;
//# sourceMappingURL=userService.d.ts.map