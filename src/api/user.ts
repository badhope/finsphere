import request from '@/utils/request';

interface LoginData {
  username: string;
  password: string;
}

export function login(data: LoginData) {
  return request({ url: '/login', method: 'post', data });
}

export function register(data: any) {
  return request({ url: '/register', method: 'post', data });
}
