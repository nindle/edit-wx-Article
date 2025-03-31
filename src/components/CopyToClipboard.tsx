import { Button } from '@/components/ui/button'
import { Copy, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CopyToClipboardProps {
  html: string
}

function CopyToClipboard({ html }: CopyToClipboardProps) {
  const [isCopying, setIsCopying] = useState(false)

  const copyHtml = async () => {
    if (!html.trim()) {
      toast.error('没有内容可复制')
      return
    }

    setIsCopying(true)

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' }),
        })

        await navigator.clipboard.write([clipboardItem])
        toast.success('内容已复制到剪贴板，可直接粘贴到微信公众号编辑器')
      }
      else {
        toast.error('您的浏览器不支持复制功能，请手动复制或尝试使用其他浏览器')
      }
    }
    catch (err) {
      console.error('复制失败:', err)
      toast.error('复制失败，请手动复制或尝试使用其他浏览器')
    }
    finally {
      setIsCopying(false)
    }
  }

  const copyText = async () => {
    if (!html.trim()) {
      toast.error('没有内容可复制')
      return
    }

    setIsCopying(true)

    try {
      // 创建一个临时元素来获取纯文本内容
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const textContent = tempDiv.textContent || ''

      await navigator.clipboard.writeText(textContent.trim())
      toast.success('纯文本内容已复制到剪贴板')
    }
    catch (err) {
      console.error('复制失败:', err)
      toast.error('复制失败，请手动复制或尝试使用其他浏览器')
    }
    finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="default"
        size="default"
        disabled={isCopying}
        onClick={copyHtml}
      >
        <Copy className="h-4 w-4" />
        复制HTML
      </Button>

      <Button
        variant="outline"
        size="default"
        disabled={isCopying}
        onClick={copyText}
      >
        <FileText className="h-4 w-4" />
        复制内容
      </Button>
    </div>
  )
}

export default CopyToClipboard
