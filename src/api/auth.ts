/**
 * 用户认证相关API
 */
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UserInfoUpdateRequest,
} from '@/types/user'
import { http } from '@/utils/http/client'

export class AuthAPI {
  /**
   * 用户登录
   */
  static login(data: LoginRequest): Promise<LoginResponse> {
    return http.post('/auth/login', data)
  }

  /**
   * 用户注册
   */
  static register(data: RegisterRequest): Promise<any> {
    return http.post('/auth/register', data)
  }

  /**
   * 用户登出
   */
  static logout(): Promise<any> {
    return http.post('/auth/logout')
  }

  /**
   * 刷新令牌
   */
  static refreshToken(): Promise<{ accessToken: string }> {
    return http.post('/auth/refresh')
  }

  /**
   * 获取用户信息
   */
  static getUserInfo(): Promise<any> {
    return http.get('/user/info')
  }

  /**
   * 更新用户信息
   */
  static updateUserInfo(data: UserInfoUpdateRequest): Promise<any> {
    return http.put('/user/profile', data)
  }

  /**
   * 修改密码
   */
  static changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
    return http.put('/user/password', data)
  }
}
