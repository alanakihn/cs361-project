import axios from "axios";

const authEndpoint = import.meta.env.VITE_AUTH_MIDDLEWARE;

interface NewAccountParams {
  username: string;
  password: string;
}
interface UidResponse {
  uid: string,
}
const createNewAccount = async (account: NewAccountParams): Promise<UidResponse | null> => {
  try {
    const result = await axios.post(`${authEndpoint}/signup`, account);
    return result.data;
  } catch (e: any) {
    return null;
  }
};

interface LoginParams {
  username: string;
  password: string;
}
interface TokenResponse {
  token: string,
  uid: string,
}
const getAuthToken = async (credentials: LoginParams): Promise<TokenResponse | null> => {
  try {
    const result = await axios.post(`${authEndpoint}/login`, credentials);
    return result.data;
  } catch (e: any) {
    return null;
  }
};

interface VerifyParams {
  token: string;
}
interface UserDetails {
  username: string;
  uid: string;
  createdAt: string;
}
const verifyToken = async (token: VerifyParams): Promise<UserDetails | null> => {
  try {
    const result = await axios.post(`${authEndpoint}/verify`, token);
    return result.data;
  } catch (e: any) {
    return null;
  }
};

export {
  createNewAccount,
  getAuthToken,
  verifyToken,
}

export type {
  UserDetails,
}
