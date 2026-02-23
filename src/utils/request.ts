import axios from 'axios';
import { message } from 'ant-design-vue';
import { getToken } from './auth';

const service = axios.create({
  baseURL: '/api', // 接口基础路径
  timeout: 10000, // 请求超时时间
});

// 请求拦截器：自动携带 Token
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 假设 code 200 为成功
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data; // 直接返回数据体
  },
  (error) => {
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
