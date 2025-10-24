// lib/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7209',
};

export const getApiUrl = (path: string) => {
  return `${API_CONFIG.baseURL}${path}`;
};