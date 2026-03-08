/**
 * HTTP 请求工具类
 * 基于 Axios 封装，支持拦截器、错误处理、请求取消等功能
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { authService } from '@/services/auth.service'
import { encrypt, decrypt } from '@/utils/security/crypto'
import NProgress from 'nprogress'

// 扩展Axios请求配置
interface RequestConfig extends AxiosRequestConfig {
  hideLoading?: boolean // 是否隐藏加载状态
  hideError?: boolean // 是否隐藏错误提示
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟(ms)
}

// 响应数据接口
interface ResponseData<T = any> {
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
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      ...config,
    })

    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: RequestConfig) => {
        // 显示加载进度条
        if (!config.hideLoading) {
          NProgress.start()
        }

        // 添加认证token
        const token = getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加时间戳防止缓存
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          }
        }

        // 生成请求标识用于取消重复请求
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

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        NProgress.done()

        // 移除已完成的请求
        const requestKey = this.generateRequestKey(response.config)
        this.pendingRequests.delete(requestKey)

        const { data } = response

        // 统一处理业务状态码
        if (data.code === 200) {
          return data.data
        } else if (data.code === 401) {
          // 未授权，跳转登录
          this.handleUnauthorized()
          return Promise.reject(new Error(data.message || '未授权'))
        } else if (data.code === 403) {
          // 权限不足
          ElMessage.error('权限不足')
          return Promise.reject(new Error(data.message || '权限不足'))
        } else {
          // 其他业务错误
          if (!(response.config as RequestConfig).hideError) {
            ElMessage.error(data.message || '请求失败')
          }
          return Promise.reject(new Error(data.message))
        }
      },
      async error => {
        NProgress.done()

        const { config } = error
        const requestKey = this.generateRequestKey(config)
        this.pendingRequests.delete(requestKey)

        if (axios.isCancel(error)) {
          // 请求被取消
          return Promise.reject(new Error('请求已被取消'))
        }

        if (!config || !(config as RequestConfig).retry) {
          this.handleError(error)
          return Promise.reject(error)
        }

        // 重试逻辑
        const retryCount = config.__retryCount || 0
        const retry = (config as RequestConfig).retry || 0
        const retryDelay = (config as RequestConfig).retryDelay || 1000

        if (retryCount >= retry) {
          this.handleError(error)
          return Promise.reject(error)
        }

        config.__retryCount = retryCount + 1

        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return this.instance.request(config)
      }
    )
  }

  /**
   * 生成请求唯一标识
   */
  private generateRequestKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config
    return `${method?.toUpperCase()}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`
  }

  /**
   * 处理未授权错误
   */
  private handleUnauthorized(): void {
    authService.clearToken()
    authService.clearUserInfo()

    ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      window.location.reload()
    })
  }

  /**
   * 统一错误处理
   */
  private handleError(error: any): void {
    let message = '网络错误'

    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
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
          message = `连接错误${status}`
      }
    } else if (error.request) {
      message = '网络连接异常'
    } else {
      message = error.message || '未知错误'
    }

    ElMessage.error(message)
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  }

  /**
   * 下载文件
   */
  download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    return this.instance
      .get(url, {
        responseType: 'blob',
        ...config,
      })
      .then((response: any) => {
        const blob = new Blob([response])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename || 'download'
        link.click()
        URL.revokeObjectURL(link.href)
      })
  }

  /**
   * 取消所有请求
   */
  cancelAllRequests(): void {
    this.pendingRequests.forEach(controller => {
      controller.abort()
    })
    this.pendingRequests.clear()
  }
}

// 创建默认实例
export const http = new HttpClient()

// 导出类以便创建多个实例
export default HttpClient
