export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7209',
};

export const getApiUrl = (path: string) => {
  return `${API_CONFIG.baseURL}${path}`;
};