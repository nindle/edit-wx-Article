import type { ClassValue } from 'clsx'
import axios from 'axios'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 创建一个axios实例
export const api = axios.create({
  baseURL: 'https://wx.api.nindle.cn',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 验证密码
 * @param password 要验证的密码
 * @returns 一个Promise，解析为验证结果对象
 */
export async function verifyPassword(password: string): Promise<{ success: boolean, message?: string }> {
  try {
    // 实际环境中应该连接到真实API
    const response = await api.post('/api/validate_password', { password })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API请求失败:', error.message)
      // 检查是否有响应数据
      if (error.response) {
        return {
          success: false,
          message: `请求失败: ${error.response.status} - ${error.response.statusText}`,
        }
      }
    }
    return { success: false, message: '网络请求失败' }
  }
}

/**
 * 获取全局访问次数
 * @returns 一个Promise，解析为访问次数对象
 */
export async function getVisitCount(): Promise<{ data: number, success: boolean, message?: string }> {
  try {
    const response = await api.get('/api/count')
    return response.data
  } catch (error) {
    console.error('获取访问次数失败:', error)
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: 0,
        success: false,
        message: `请求失败: ${error.response.status} - ${error.response.statusText}`,
      }
    }
    return { data: 0, success: false, message: '网络请求失败' }
  }
}

/**
 * 更新全局访问次数
 * @returns 一个Promise，解析为更新结果对象
 */
export async function updateVisitCount(): Promise<{ success: boolean, message?: string }> {
  try {
    const response = await api.post('/api/count', {
      action: 'inc',
    })
    return response.data
  } catch (error) {
    console.error('更新访问次数失败:', error)
    return { success: false, message: '网络请求失败' }
  }
}
