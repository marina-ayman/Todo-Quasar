import axios from "axios";

const API_URL = "http://localhost:5000"

export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  try {
    const { data } = await axios.post(`${API_URL}/refresh-token`, { refreshToken });

    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
};
