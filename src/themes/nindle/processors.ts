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

    let containerCount = 0

    // 处理所有自定义容器
    elements.forEach((containerElement) => {
      if (!(containerElement instanceof HTMLElement))
        return

      const containerClass = containerElement.className

      // 应用特定类型的样式
      if (containerClass.includes('custom-container')) {
        containerCount++

        // 创建序号元素
        const numberElement = document.createElement('p')
        numberElement.className = 'container-number'
        numberElement.textContent = containerCount.toString().padStart(2, '0')

        // 应用序号样式
        applyStyles([numberElement], {}, {
          'position': 'absolute',
          'top': '-12px',
          'left': '20px',
          'width': '50px',
          'height': '24px',
          'line-height': '24px',
          'text-align': 'center',
          'font-size': '14px',
          'color': '#fff',
          'background-color': '#4b47e8',
          'border-radius': '0 10px 10px',
          'font-weight': '500',
          'z-index': '1',
          'display': 'inline-block',
          'user-select': 'none',
        })

        // 添加序号到容器
        containerElement.insertBefore(numberElement, containerElement.firstChild)
      }

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
