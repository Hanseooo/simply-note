export type RegisterResponse = {
  key: string; 
};

export type User = {
    id: number;
    username: string;
    email: string;
    is_email_verified: boolean;
  };

export type LoginResponse = {
  token: string;
  user: User;
};

export type VerifyEmailResponse = {
  access: string;
  refresh: string;
  user: User
};

