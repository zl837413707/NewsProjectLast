import axios from 'axios';
import { store } from '../redux/store'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8103/api',
  // baseURL: 'https://node-self.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('nodeToken');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    store.dispatch({
      type: 'changeLoading',
      payload: true
    })
    return config;
  },
  error => {
    store.dispatch({
      type: 'changeLoading',
      payload: false
    })
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    store.dispatch({
      type: 'changeLoading',
      payload: false
    })
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;