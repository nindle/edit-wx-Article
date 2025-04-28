import type { ThemeStyles } from './types'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useState } from 'react'
import CopyToClipboard from './components/CopyToClipboard'
import Header from './components/Header'
import MarkdownEditor from './components/MarkdownEditor'
import PasswordProtection from './components/PasswordProtection'
import ThemeSelector from './components/ThemeSelector'
import { Separator } from './components/ui/separator'
import WechatPreview from './components/WechatPreview'
import { useLocalStorage } from './hooks/useLocalStorage'
import { generateInlineStyledHtml, parseMarkdown } from './lib'
import { defaultTheme, getThemeByCode } from './themes'

function App() {
  // 是否已通过密码验证
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 从本地存储中获取保存的 Markdown 内容
  const { value: savedMarkdown } = useLocalStorage<string>('markdownContent', '')
  const [markdown, setMarkdown] = useState(savedMarkdown || '')
  const [html, setHtml] = useState('')

  // 使用本地存储保存主题设置
  const {
    value: themeCode,
    setValue: setThemeCode,
  } = useLocalStorage<string>('selectedTheme', defaultTheme.code)

  // 当前主题
  const [currentTheme, setCurrentTheme] = useState<ThemeStyles>(
    getThemeByCode(themeCode),
  )

  // 当主题代码变化时更新当前主题
  useEffect(() => {
    setCurrentTheme(getThemeByCode(themeCode))
  }, [themeCode])

  // 当 markdown 内容或主题变化时，转换为 HTML
  useEffect(() => {
    if (!markdown.trim()) {
      setHtml('')
      return
    }

    // 使用 parseMarkdown 解析 Markdown，然后使用 generateInlineStyledHtml 应用主题样式
    const parsedHtml = parseMarkdown(markdown)
    const styledHtml = generateInlineStyledHtml(parsedHtml, currentTheme)

    setHtml(styledHtml)
  }, [markdown, currentTheme])

  // 如果未通过密码验证，显示密码保护组件
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toaster richColors />

      <Header>
        <div className="flex items-center space-x-4">
          <ThemeSelector value={themeCode} onValueChange={setThemeCode} />
          <CopyToClipboard html={html} />
        </div>
      </Header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        <Separator orientation="vertical" />

        <div className="flex-1">
          <WechatPreview html={html} />
        </div>
      </div>
    </div>
  )
}

export default App
