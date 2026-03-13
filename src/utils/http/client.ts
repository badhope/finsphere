/**
 * HTTP 请求工具类
 * 基于 Axios 封装，支持拦截器、错误处理、请求取消等功能
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'

import { getToken, clearAuth } from '@/utils/auth'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

interface RequestConfig extends AxiosRequestConfig {
  hideLoading?: boolean
  hideError?: boolean
  retry?: number
  retryDelay?: number
  __retryCount?: number
}

interface ResponseData<T = unknown> {
  code: number
  data: T
  message: string
  timestamp: number
}

class HttpClient {
  private instance: AxiosInstance
  private pendingRequests: Map<string, AbortController> = new Map()

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      ...config,
    })

    this.setupInterceptors()
  }

  private generateRequestKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config
    return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<RequestConfig>) => {
        const requestConfig = config as unknown as RequestConfig

        if (!requestConfig.hideLoading) {
          NProgress.start()
        }

        const token = getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          }
        }

        const requestKey = this.generateRequestKey(config)
        if (this.pendingRequests.has(requestKey)) {
          const controller = this.pendingRequests.get(requestKey)
          controller?.abort()
        }

        const controller = new AbortController()
        config.signal = controller.signal
        this.pendingRequests.set(requestKey, controller)

        return config
      },
      error => {
        NProgress.done()
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        NProgress.done()

        const requestKey = this.generateRequestKey(response.config)
        this.pendingRequests.delete(requestKey)

        const { data } = response

        if (data.code === 200) {
          return data.data
        } else if (data.code === 401) {
          this.handleUnauthorized()
          return Promise.reject(new Error(data.message || '未授权'))
        } else if (data.code === 403) {
          ElMessage.error('权限不足')
          return Promise.reject(new Error(data.message || '权限不足'))
        } else {
          const requestConfig = response.config as unknown as RequestConfig
          if (!requestConfig.hideError) {
            ElMessage.error(data.message || '请求失败')
          }
          return Promise.reject(new Error(data.message))
        }
      },
      async error => {
        NProgress.done()

        const config = error.config as RequestConfig | undefined
        if (config) {
          const requestKey = this.generateRequestKey(config)
          this.pendingRequests.delete(requestKey)
        }

        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求已被取消'))
        }

        if (!config?.retry) {
          this.handleError(error)
          return Promise.reject(error)
        }

        const retryCount = config.__retryCount ?? 0
        const retry = config.retry ?? 0
        const retryDelay = config.retryDelay ?? 1000

        if (retryCount >= retry) {
          this.handleError(error)
          return Promise.reject(error)
        }

        config.__retryCount = retryCount + 1

        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return this.instance.request(config)
      }
    )
  }

  private handleUnauthorized(): void {
    clearAuth()
    ElMessage.error('登录已过期，请重新登录')
    window.location.href = '/login'
  }

  private handleError(error: unknown): void {
    let message = '请求失败'

    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = '请求参数错误'
            break
          case 401:
            message = '未授权，请登录'
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求资源不存在'
            break
          case 500:
            message = '服务器内部错误'
            break
          case 502:
            message = '网关错误'
            break
          case 503:
            message = '服务不可用'
            break
          case 504:
            message = '网关超时'
            break
          default:
            message = error.response.data?.message || `请求失败 (${error.response.status})`
        }
      } else if (error.request) {
        message = '网络错误，请检查网络连接'
      } else {
        message = error.message || '请求配置错误'
      }
    } else if (error instanceof Error) {
      message = error.message
    }

    ElMessage.error(message)
  }

  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
}

export const http = new HttpClient()
