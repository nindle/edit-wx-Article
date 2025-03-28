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
        const numberElement = document.createElement('div')
        numberElement.textContent = containerCount.toString().padStart(2, '0')
        numberElement.style.position = 'absolute'
        numberElement.style.top = '-12px'
        numberElement.style.left = '20px'
        numberElement.style.width = '50px'
        numberElement.style.height = '24px'
        numberElement.style.lineHeight = '24px'
        numberElement.style.textAlign = 'center'
        numberElement.style.fontSize = '14px'
        numberElement.style.color = '#fff'
        numberElement.style.backgroundColor = '#4b47e8'
        numberElement.style.borderRadius = '0 10px 10px'
        numberElement.style.fontWeight = '500'
        numberElement.style.zIndex = '1'

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
