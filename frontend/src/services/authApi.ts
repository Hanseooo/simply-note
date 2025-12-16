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
