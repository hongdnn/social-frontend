import axios from "axios";

const CHAT_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL || "";
const POST_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_POST_SERVICE_BASE_URL || "";

const chatServiceInstance = axios.create({
  baseURL: CHAT_SERVICE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const postServiceInstance = axios.create({
  baseURL: POST_SERVICE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

chatServiceInstance.interceptors.request.use(
  function (config) {
    const token = getAuthToken();

    if (
      token &&
      !config.url?.includes("/login") &&
      !config.url?.includes("/signup")
    ) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

postServiceInstance.interceptors.request.use(
  function (config) {
    const token = getAuthToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  error?: string;
  message: string;
}

export { chatServiceInstance, postServiceInstance };
