import axios from 'axios';
import { store } from '../redux/store'

// 创建一个axios实例
const instance = axios.create({
  // baseURL: 'http://127.0.0.1:8103/api', // 设置默认的base URL
  baseURL: 'https://node-gamma-five.vercel.app/api', // 设置默认的base URL
  timeout: 10000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json', // 设置默认请求头

  },
});

// 请求拦截器，可以在请求发送之前做一些全局处理，比如添加token
instance.interceptors.request.use(
  config => {
    // 在请求发送之前做些什么
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
    // 对请求错误做些什么
    store.dispatch({
      type: 'changeLoading',
      payload: false
    })
    return Promise.reject(error);
  }
);

// 响应拦截器，可以在接收到响应后做一些全局处理
instance.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    store.dispatch({
      type: 'changeLoading',
      payload: false
    })
    return response;
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default instance;