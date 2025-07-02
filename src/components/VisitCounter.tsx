import { getVisitCount } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface VisitCounterProps {
  className?: string
  refreshInterval?: number // 刷新间隔，单位毫秒
}

export default function VisitCounter({ className = '', refreshInterval = 60000 }: VisitCounterProps) {
  const [visitCount, setVisitCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchVisitCount = async () => {
    try {
      setLoading(true)
      const { data, success, message } = await getVisitCount()
      if (success) {
        setVisitCount(data?.count)
      } else {
        toast.error(message)
      }
    } catch (error) {
      console.error('获取访问次数失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 初始加载
    fetchVisitCount()

    // 设置定时刷新
    if (refreshInterval > 0) {
      timerRef.current = setInterval(fetchVisitCount, refreshInterval)
    }

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [refreshInterval])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>统计中</span>
        </div>
      )
    }

    return (
      <div className="flex items-center">
        <svg className="mr-1.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>
          访问量:
          {visitCount.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center text-sm font-medium ${className}`}>
      {renderContent()}
    </div>
  )
}
