export interface FormData {
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  phone: string;
  language: string;
  theme: 'light' | 'dark';
  message: string;
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
  message: {
    required: string;
    tooShort: string;
    tooLong: string;
  };
}
export type FormMode =
  | 'register'
  | 'login'
  | 'edit'
  | 'forgotPassword'
  | 'resetPassword'
  | 'contact';

export type FormField =
  | 'name'
  | 'email'
  | 'password'
  | 'address'
  | 'profileImage'
  | 'phone'
  | 'language'
  | 'theme'
  | 'message'
  | 'clientId';

export interface UserContactFormProps {
  fields: FormField[];
  onSubmit: (data: FormData) => Promise<void> | void;
  mode: FormMode;
}
