import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const API_URL = "http://localhost:3000"

const api = axios.create({ baseURL: API_URL })
const adminApi = axios.create({ baseURL: API_URL })

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("Current Refresh Token before request:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token found, logging out...");
    return null;
  }

  try {
    const { data } = await axios.post(`${API_URL}/web/refresh-token`, { refreshToken });
    console.log("New Access Token received:", data.accessToken);

    localStorage.setItem("token", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 401) {
      console.log("Refresh token expired or invalid, logging out...");
    } else {
      console.log("Unexpected error while refreshing token.");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = '/auth/login';
    return null;
  }
};


const refreshAdminToken = async () => {
  const refreshToken = localStorage.getItem("adminRefreshToken");
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${API_URL}/web/admin-refresh-token`, { refreshToken });
    localStorage.setItem("adminToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh admin token", error);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
     window.location.href ='/dashboard/auth/login'
    return null;
  }
};

// web
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

// admin
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const newToken = await refreshAdminToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return adminApi.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);


export default defineBoot(({ app }) => {
  const token = localStorage.getItem("token");
  console.log("Stored Token on Page Load:", token);

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$adminApi = adminApi
})
export { api , adminApi }
