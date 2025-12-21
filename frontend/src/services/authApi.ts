import { api } from "@/lib/api";

export const loginApi = async (payload: {
  username: string;
  password: string;
}) => {
  const { data } = await api.post("/api/users/login/", payload);
  return data;
};

export const registerApi = async (payload: {
  username: string;
  email: string;
  password1: string;
  password2: string;
}) => {
  const { data } = await api.post("/api/users/register/", payload);
  return data;
};

export const fetchUserApi = async () => {
  const { data } = await api.get("/api/auth/user/");
  return data;
};

export const logoutApi = async () => {
  await api.post("/api/auth/logout/");
};

export const requestPasswordResetApi = async (email: string) => {
  await api.post("/api/users/forgot-password/", { email });
};



export const resetPasswordApi = async (payload: {
  token: string;
  password: string;
}) => {
  await api.post("/api/users/reset-password/", payload);
};

export const changePasswordApi = async (payload: {
  current_password: string;
  new_password: string;
}) => {
  await api.post("/api/users/change-password/", payload);
};

export const changeUsernameApi = async (username: string) => {
  const { data } = await api.post<{
    username: string;
  }>("/api/users/change-username/", { username });

  return data;
};

export const checkUsernameAvailabilityApi = async (username: string) => {
  const { data } = await api.get<{
    available: boolean;
  }>("/api/users/check-username/", {
    params: { username },
  });

  return data;
};

export const requestEmailChangeApi = async (email: string) => {
  await api.post("/api/users/change-email/request/", { email });
};

export const verifyEmailChangeApi = async (payload: {
  email: string;
  code: string;
}) => {
  const { data } = await api.post<{
    email: string;
  }>("/api/users/change-email/confirm/", payload);

  return data;
};

