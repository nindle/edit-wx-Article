/**
 * 主题样式接口定义
 */
export interface ThemeStyles {
  /** 主题代码 */
  code: string
  /** 主题名称 */
  name: string
  /** 样式定义 */
  styles: {
    /** 基础样式 */
    base: Record<string, string>
    /** 标题样式 */
    heading: {
      /** 所有标题的基础样式 */
      base: Record<string, string>
      /** h1标题样式 */
      h1?: Record<string, string>
      /** h2标题样式 */
      h2?: Record<string, string>
      /** h3标题样式 */
      h3?: Record<string, string>
      /** h4标题样式 */
      h4?: Record<string, string>
      /** h5标题样式 */
      h5?: Record<string, string>
      /** h6标题样式 */
      h6?: Record<string, string>
    }
    /** 段落样式 */
    paragraph?: Record<string, string>
    /** 图片样式 */
    image: Record<string, string>
    /** 引用样式 */
    blockquote?: Record<string, string>
    /** 列表样式 */
    list?: {
      /** 列表基础样式 */
      base?: Record<string, string>
      /** 无序列表样式 */
      ul?: Record<string, string>
      /** 有序列表样式 */
      ol?: Record<string, string>
      /** 列表项样式 */
      li?: Record<string, string>
    }
    /** 加粗样式 */
    strong?: Record<string, string>
    /** 斜体样式 */
    em?: Record<string, string>
    /** 分割线样式 */
    hr?: Record<string, string>
    /** 容器样式 */
    container?: {
      /** 默认容器样式 */
      default: Record<string, string>
    }
  }
  /** 自定义开始内容 */
  headerContent?: string
  /** 自定义结尾内容 */
  footerContent?: string
  /** 渲染后回调函数，可用于添加自定义功能 */
  onAfterRender?: (contentElement: HTMLElement) => void
}

export type ToastType = 'success' | 'error' | 'hidden'
export type ToastPosition = 'top' | 'bottom'
