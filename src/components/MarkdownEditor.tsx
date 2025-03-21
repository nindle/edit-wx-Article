import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Package,
  Quote,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import KeyboardHelp from './KeyboardHelp'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

// 使用React.memo优化组件渲染性能
const MarkdownEditor = React.memo(({ value, onChange }: MarkdownEditorProps) => {
  // 编辑器引用
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // 使用本地存储保存内容
  const { setValue: setSaveMarkdownContent } = useLocalStorage<string>('markdownContent', '')

  /**
   * 更新内容并触发事件
   * 使用useCallback优化性能，避免不必要的函数重建
   */
  const updateContent = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    onChange(newValue)

    // 自动保存到本地存储
    setSaveMarkdownContent(newValue)
  }, [onChange, setSaveMarkdownContent])

  /**
   * 处理Tab键，插入空格而不是切换焦点
   * 使用useCallback优化性能
   */
  const handleTabKey = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault()

      const target = event.currentTarget
      const start = target.selectionStart || 0
      const end = target.selectionEnd || 0

      // 在光标位置插入两个空格
      const newValue = `${target.value.substring(0, start)}  ${target.value.substring(end)}`

      // 更新文本区域的值
      target.value = newValue

      // 将光标位置移动到插入的空格之后
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 2
          onChange(target.value)
          setSaveMarkdownContent(target.value)
        }
      }, 0)
    }
  }, [onChange, setSaveMarkdownContent])

  /**
   * 处理键盘快捷键
   * 使用useCallback优化性能
   */
  const handleKeyboardShortcuts = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 处理Tab键
    if (event.key === 'Tab') {
      handleTabKey(event)
      return
    }

    // 保存快捷键 (Ctrl+S)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      return
    }

    // 只处理Ctrl/Cmd组合键
    if (!(event.ctrlKey || event.metaKey))
      return

    const target = event.currentTarget
    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const selectedText = target.value.substring(start, end)

    let newText = ''
    let newCursorPos = 0

    // 根据不同的键执行不同的操作
    switch (event.key.toLowerCase()) {
      // 加粗
      case 'b':
        event.preventDefault()
        if (selectedText) {
          newText = `**${selectedText}**`
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + newText.length
        }
        else {
          newText = '**粗体文本**'
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + 2
        }
        break

      // 斜体
      case 'i':
        event.preventDefault()
        if (selectedText) {
          newText = `*${selectedText}*`
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + newText.length
        }
        else {
          newText = '*斜体文本*'
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + 1
        }
        break

      // 链接
      case 'k':
        event.preventDefault()
        if (selectedText) {
          newText = `[${selectedText}](链接地址)`
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + selectedText.length + 3
        }
        else {
          newText = '[链接文本](链接地址)'
          target.value = target.value.substring(0, start) + newText + target.value.substring(end)
          newCursorPos = start + 1
        }
        break

      default:
        return
    }

    // 更新光标位置并触发更新
    setTimeout(() => {
      if (target) {
        if (selectedText) {
          target.selectionStart = target.selectionEnd = newCursorPos
        }
        else {
          target.selectionStart = start + newCursorPos
          target.selectionEnd = start + newText.length - newCursorPos
        }
        onChange(target.value)
        setSaveMarkdownContent(target.value)
      }
    }, 0)
  }, [handleTabKey, onChange, setSaveMarkdownContent])

  /**
   * 插入Markdown格式文本
   * 使用useCallback优化性能
   */
  const insertFormat = useCallback((format: string) => {
    if (!editorRef.current)
      return

    const editor = editorRef.current
    const start = editor.selectionStart || 0
    const end = editor.selectionEnd || 0
    const selectedText = editor.value.substring(start, end)

    let insertText = ''
    let cursorOffset = 0

    switch (format) {
      case 'h1':
        insertText = `# ${selectedText || '标题'}\n`
        cursorOffset = 2
        break
      case 'h2':
        insertText = `## ${selectedText || '标题'}\n`
        cursorOffset = 3
        break
      case 'h3':
        insertText = `### ${selectedText || '标题'}\n`
        cursorOffset = 4
        break
      case 'bold':
        insertText = `**${selectedText || '粗体文本'}**`
        cursorOffset = 2
        break
      case 'italic':
        insertText = `*${selectedText || '斜体文本'}*`
        cursorOffset = 1
        break
      case 'quote':
        insertText = `> ${selectedText || '引用文本'}\n`
        cursorOffset = 2
        break
      case 'code':
        insertText = `\`\`\`\n${selectedText || '代码块'}\n\`\`\``
        cursorOffset = 4
        break
      case 'link':
        insertText = `[${selectedText || '链接文本'}](链接地址)`
        cursorOffset = selectedText ? selectedText.length + 3 : 1
        break
      case 'image':
        insertText = `![${selectedText || '图片描述'}](图片链接)`
        cursorOffset = selectedText ? selectedText.length + 4 : 2
        break
      case 'ul':
        insertText = `- ${selectedText || '列表项'}\n`
        cursorOffset = 2
        break
      case 'ol':
        insertText = `1. ${selectedText || '列表项'}\n`
        cursorOffset = 3
        break
      case 'hr':
        insertText = `\n---\n`
        cursorOffset = 5
        break
      case 'container':
        insertText = `:::\n${selectedText || '自定义容器内容'}\n:::`
        cursorOffset = 11
        break
    }

    // 插入文本
    editor.value = editor.value.substring(0, start) + insertText + editor.value.substring(end)

    // 更新光标位置
    setTimeout(() => {
      if (editor) {
        if (selectedText) {
          editor.selectionStart = editor.selectionEnd = start + insertText.length
        }
        else {
          editor.selectionStart = start + cursorOffset
          editor.selectionEnd = start + insertText.length - (format === 'code' ? 4 : 0) - (format === 'hr' ? 1 : 0) - (format === 'container' ? 4 : 0)
        }
        editor.focus()
        onChange(editor.value)
        setSaveMarkdownContent(editor.value)
      }
    }, 0)
  }, [onChange, setSaveMarkdownContent])

  // 使用useMemo缓存工具栏按钮配置，避免重复创建
  const toolbarButtons = useMemo(() => [
    {
      label: '标题1',
      icon: <Heading1 />,
      format: 'h1',
      shortcut: 'Ctrl+Alt+1',
    },
    {
      label: '标题2',
      icon: <Heading2 />,
      format: 'h2',
      shortcut: 'Ctrl+Alt+2',
    },
    {
      label: '标题3',
      icon: <Heading3 />,
      format: 'h3',
      shortcut: 'Ctrl+Alt+3',
    },
    {
      label: '粗体',
      icon: <Bold />,
      format: 'bold',
      shortcut: 'Ctrl+B',
    },
    {
      label: '斜体',
      icon: <Italic />,
      format: 'italic',
      shortcut: 'Ctrl+I',
    },
    {
      label: '引用',
      icon: <Quote />,
      format: 'quote',
    },
    {
      label: '代码',
      icon: <Code />,
      format: 'code',
    },
    {
      label: '链接',
      icon: <Link />,
      format: 'link',
      shortcut: 'Ctrl+K',
    },
    {
      label: '图片',
      icon: <Image />,
      format: 'image',
    },
    {
      label: '无序列表',
      icon: <List />,
      format: 'ul',
    },
    {
      label: '有序列表',
      icon: <ListOrdered />,
      format: 'ol',
    },
    {
      label: '分割线',
      icon: <Minus />,
      format: 'hr',
    },
    {
      label: '自定义容器',
      icon: <Package />,
      format: 'container',
    },
  ], [])

  // 组件挂载后设置焦点
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b bg-white">
        <div className="flex space-x-1 overflow-x-auto">
          {toolbarButtons.map(button => (
            <Button
              key={button.format}
              variant="ghost"
              size="sm"
              title={button.shortcut ? `${button.label} (${button.shortcut})` : button.label}
              onClick={() => insertFormat(button.format)}
            >
              {button.icon}
            </Button>
          ))}
        </div>
        <div className="ml-auto">
          <KeyboardHelp />
        </div>
      </div>
      <textarea
        ref={editorRef}
        className="flex-1 p-4 w-full resize-none outline-none font-mono text-base"
        value={value}
        onChange={updateContent}
        onKeyDown={handleKeyboardShortcuts}
        placeholder="在这里输入Markdown内容..."
      />
    </div>
  )
})

export default MarkdownEditor
