import axios from 'axios';
import { store } from '../redux/store';

const fileUploadInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8103/api', // 设置默认的base URL
  baseURL: 'https://node-gamma-five.vercel.app/api', // 设置默认的base URL
  timeout: 10000, // 设置请求超时时间
});

fileUploadInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('nodeToken');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    config.headers['Content-Type'] = 'multipart/form-data'; // 设置请求头为multipart/form-data
    store.dispatch({
      type: 'changeLoading',
      payload: true
    });
    return config;
  },
  error => {
    store.dispatch({
      type: 'changeLoading',
      payload: false
    });
    return Promise.reject(error);
  }
);

fileUploadInstance.interceptors.response.use(
  response => {
    store.dispatch({
      type: 'changeLoading',
      payload: false
    });
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default fileUploadInstance;