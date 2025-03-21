import type { ElementProcessor } from '../processors'
import { applyStyles } from '@/lib'

/**
 * 默认主题的处理器
 */
export const defaultThemeProcessors: Record<string, ElementProcessor> = {
  // 默认主题的标题处理：为 h2 添加编号
  heading: (elements, styles) => {
    let h2Count = 0
    elements.forEach((heading) => {
      const tagName = heading.tagName.toLowerCase() as keyof typeof styles.heading

      // 特殊处理 h2 标签
      if (tagName === 'h2') {
        h2Count++
        const numberContainer = document.createElement('div')
        numberContainer.textContent = h2Count.toString().padStart(2, '0')
        heading.prepend(numberContainer)
      }

      applyStyles([heading], styles.base, {
        ...styles.heading.base,
        ...styles.heading[tagName],
      })
    })
  },
}
