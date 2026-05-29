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

export default api;
