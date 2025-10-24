import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Servidor indisponível. Tente novamente em alguns instantes.'
      });
    }
    return Promise.reject(error);
  }
);

export default api;