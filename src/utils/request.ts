import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'ant-design-vue';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000, // 金融数据请求不能太慢
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在此处注入 Token (模拟)
    const token = localStorage.getItem('fin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 假设后端返回格式为 { code: 200, data: {}, message: '' }
    if (res.code !== 200) {
      message.error(res.message || '系统错误');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data; // 直接返回数据层，方便业务直接使用
  },
  (error) => {
    message.error(error.message);
    return Promise.reject(error);
  }
);

export default service;
