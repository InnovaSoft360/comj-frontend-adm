// lib/api.ts
import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para tratar erros de conexão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      // API indisponível - não quebra o frontend
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Servidor indisponível. Tente novamente em alguns instantes.'
      });
    }
    return Promise.reject(error);
  }
);

export default api;