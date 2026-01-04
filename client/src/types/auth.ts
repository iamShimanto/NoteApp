export type User = {
  _id: string;
  fullName: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  message?: string;
  user?: User;
  token?: string; // keep if your backend returns token
};
