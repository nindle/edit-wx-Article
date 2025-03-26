import type { ThemeStyles } from '../types'
import { applyStyles } from '../lib/html'
import { defaultThemeProcessors } from './default/processors'
import { jieThemeProcessors } from './jie/processors'
import { nindleThemeProcessors } from './nindle/processors'

// 定义处理器类型
export type ElementProcessor = (elements: HTMLElement[], styles: ThemeStyles['styles']) => void

// 定义主题处理器映射类型
export type ThemeProcessors = Record<string, Record<string, ElementProcessor>>

/**
 * 基础元素处理器
 */
export const baseElementProcessors: Record<string, ElementProcessor> = {
  // 处理标题的基础方法
  heading: (elements, styles) => {
    elements.forEach((heading) => {
      const tagName = heading.tagName.toLowerCase() as keyof typeof styles.heading
      applyStyles([heading], styles.base, {
        ...styles.heading.base,
        ...styles.heading[tagName],
      })
    })
  },

  // 处理段落
  paragraph: (elements, styles) => {
    applyStyles(elements, styles.base, styles.paragraph)
  },

  // 处理图片
  image: (elements, styles) => {
    applyStyles(elements, {}, styles.image)
  },

  // 处理引用块
  blockquote: (elements, styles) => {
    applyStyles(elements, styles.base, styles.blockquote)

    // 处理 blockquote 内部的 p 标签，移除默认样式
    elements.forEach((blockquote) => {
      const innerParagraphs = blockquote.querySelectorAll('p')
      if (innerParagraphs.length) {
        applyStyles(Array.from(innerParagraphs) as HTMLElement[], {}, {})
      }
    })
  },

  // 处理列表
  list: (elements, styles) => {
    const listStyles = styles.list || {}

    // 分别处理 ul 和 ol 列表
    elements.forEach((list) => {
      const tagName = list.tagName.toLowerCase()

      // 应用特定的 ul/ol 样式
      if (tagName === 'ul' && listStyles.ul) {
        applyStyles([list], listStyles.base, listStyles.ul)
      }
      else if (tagName === 'ol' && listStyles.ol) {
        applyStyles([list], listStyles.base, listStyles.ol)
      }

      // 处理列表项
      if (listStyles.li) {
        const listItems = list.querySelectorAll('li')
        if (listItems.length) {
          applyStyles(Array.from(listItems) as HTMLElement[], styles.base, listStyles.li)
        }
      }
    })
  },

  // 处理 strong 标签
  strong: (elements, styles) => {
    applyStyles(elements, {}, styles.strong)
  },

  // 处理 em 标签
  em: (elements, styles) => {
    applyStyles(elements, {}, styles.em)
  },

  // 处理 mark 标签
  mark: (elements, styles) => {
    applyStyles(elements, {}, styles.mark)
  },

  // 处理分割线
  hr: (elements, styles) => {
    applyStyles(elements, {}, styles.hr)
  },

  // 添加自定义容器处理器
  container: (elements, styles) => {
    const container = styles.container
    if (!container)
      return

    // 处理所有自定义容器
    elements.forEach((containerElement) => {
      if (!(containerElement instanceof HTMLElement))
        return

      const containerClass = containerElement.className

      // 应用特定类型的样式
      if (containerClass.includes('default')) {
        applyStyles([containerElement], {}, container.default)
      }
    })
  },
}

/**
 * 所有主题的处理器映射
 */
export const themeProcessors: ThemeProcessors = {
  default: defaultThemeProcessors,
  jie: jieThemeProcessors,
  nindle: nindleThemeProcessors,
}

/**
 * 获取主题的处理器
 * @param themeCode 主题代码
 * @param elementType 元素类型
 * @returns 对应的处理器函数
 */
export function getThemeProcessor(themeCode: string, elementType: string): ElementProcessor | undefined {
  const themeProcessor = themeProcessors[themeCode]?.[elementType]
  return themeProcessor || baseElementProcessors[elementType]
}
