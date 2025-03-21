import { Button } from '@/components/ui/button'
import { Monitor, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WechatPreviewProps {
  html: string
}

function WechatPreview({ html }: WechatPreviewProps) {
  // 从本地存储中获取预览模式
  const savedPreviewMode = localStorage.getItem('isMobilePreview') === 'true'
  const [isMobilePreview, setIsMobilePreview] = useState(savedPreviewMode)

  // 切换预览模式并保存到本地存储
  const togglePreviewMode = () => {
    const newMode = !isMobilePreview
    setIsMobilePreview(newMode)
    localStorage.setItem('isMobilePreview', newMode.toString())
  }

  // 组件挂载时从本地存储恢复预览模式
  useEffect(() => {
    setIsMobilePreview(savedPreviewMode)
  }, [savedPreviewMode])

  return (
    <div className="min-h-full overflow-auto bg-gray-100 flex flex-col h-full">
      <div className="p-2 bg-white border-b flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePreviewMode}
        >
          {isMobilePreview ? <Monitor /> : <Smartphone />}
          {isMobilePreview ? '标准视图' : '手机视图'}
        </Button>
      </div>

      <div className="flex-1 flex justify-center py-5 overflow-auto">
        <div
          className={`content-container bg-white p-5 shadow-sm text-base leading-relaxed w-full relative overflow-auto ${
            isMobilePreview ? 'max-w-[375px] border border-gray-300 rounded-lg' : 'max-w-[680px]'
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

export default WechatPreview
