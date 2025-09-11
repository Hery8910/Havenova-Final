export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  phone: string;
  language: string;
  theme: string;
  clientId: string;
}

export interface formErrorProps {
  name: {
    required: string;
    invalidFormat: string;
  };
  email: {
    required: string;
    invalid: string;
  };
  phone: {
    required: string;
    invalid: string;
  };
  password: {
    required: string;
    tooShort: string;
    missingUppercase: string;
    missingNumber: string;
    missingSymbol: string;
  };
  address: {
    required: string;
    invalid: string;
  };
  serviceAddress: {
    required: string;
    invalid: string;
  };
}
export type UserFormMode =
  | "register"
  | "login"
  | "edit"
  | "forgotPassword"
  | "resetPassword";

export type UserFormField =
  | "name"
  | "email"
  | "password"
  | "address"
  | "profileImage"
  | "phone"
  | "language"
  | "theme"
  | "clientId";
  
export interface UserContactFormProps {
  fields: UserFormField[];
  onSubmit: (data: RegisterFormData) => Promise<void> | void;
  mode: UserFormMode;
}