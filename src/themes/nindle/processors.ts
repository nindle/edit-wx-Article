import type { ElementProcessor } from '../processors'
import { applyStyles } from '@/lib'

/**
 * nindle 主题的处理器
 */
export const nindleThemeProcessors: Record<string, ElementProcessor> = {
  container: (elements, styles) => {
    const container = styles.container
    if (!container)
      return

    // 处理所有自定义容器
    elements.forEach((containerElement) => {
      if (!(containerElement instanceof HTMLElement))
        return

      const containerClass = containerElement.className

      if (containerClass.includes('default')) {
        // 设置容器为 Flexbox 布局
        applyStyles([containerElement], {}, {
          ...container.default,
          flexDirection: 'column',
        })

        // 创建内容包装器
        const contentWrapper = document.createElement('div')
        contentWrapper.className = 'container-content'

        // 将容器的所有子元素移动到内容包装器中
        while (containerElement.firstChild) {
          contentWrapper.appendChild(containerElement.firstChild)
        }

        containerElement.appendChild(contentWrapper)

        // 处理 default 容器内的最后一个 p 标签，设置 margin 为 0
        const paragraphs = contentWrapper.querySelectorAll('p')
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
