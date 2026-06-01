import axios from 'axios';
import { Platform } from 'react-native';

const apiBaseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web'
    ? 'http://127.0.0.1:8000/api'
    : 'http://10.116.10.101:8000/api');

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Define ou remove o token de autenticação das requisições.
export function definirToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Callback chamado quando a API responder 401 (sessão expirada).
let aoNaoAutorizado = null;
export function registrarOnNaoAutorizado(callback) {
  aoNaoAutorizado = callback;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401 && aoNaoAutorizado) {
      aoNaoAutorizado();
    }
    return Promise.reject(erro);
  }
);

export default api;
