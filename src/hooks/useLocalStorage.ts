import { useCallback, useState } from 'react'

/**
 * 使用本地存储的钩子函数
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 包含存储值、设置值和删除值的方法和状态
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 获取初始值
  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      // 如果值不存在，返回默认值
      if (item === null)
        return defaultValue

      // 尝试解析JSON
      return JSON.parse(item) as T
    }
    catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // 使用 useState 存储值
  const [storedValue, setStoredValue] = useState<T>(getInitialValue)

  /**
   * 设置存储的值
   * @param value 要存储的值
   */
  const setValue = useCallback((value: T): void => {
    try {
      // 保存到 state
      setStoredValue(value)

      // 保存到 localStorage
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key])

  /**
   * 删除存储的值
   */
  const removeValue = useCallback((): void => {
    try {
      // 重置为默认值
      setStoredValue(defaultValue)

      // 从 localStorage 中删除
      localStorage.removeItem(key)
    }
    catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, defaultValue])

  return {
    value: storedValue,
    setValue,
    removeValue,
  }
}
