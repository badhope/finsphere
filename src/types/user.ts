/**
 * 用户相关类型定义
 */

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  nickname?: string
  phone?: string
  roles: Role[]
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  code: string
  description?: string
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface UserInfoUpdateRequest {
  nickname?: string
  avatar?: string
  phone?: string
}
