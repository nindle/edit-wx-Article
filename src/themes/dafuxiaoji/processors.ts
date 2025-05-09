import type { ElementProcessor } from '../processors'
import { applyStyles } from '@/lib'

/**
 * 小帅哥洁洁主题的处理器
 */
export const jieThemeProcessors: Record<string, ElementProcessor> = {
  // 可以在这里添加小帅哥洁洁主题的特定处理方法
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

        // 处理 default 容器内的最后一个 p 标签，设置 margin 为 0
        const paragraphs = containerElement.querySelectorAll('p')
        if (paragraphs.length > 0) {
          const lastParagraph = paragraphs[paragraphs.length - 1] as HTMLElement
          applyStyles([lastParagraph], styles.base, {
            ...styles.paragraph,
            margin: '0',
          })
        }
      }
    })
  },
}
