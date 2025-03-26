import type { ThemeStyles } from '../types'
import { getThemeProcessor } from '@/themes/processors'

/**
 * 元素选择器映射
 */
const ELEMENT_SELECTORS = {
  heading: 'h1, h2, h3, h4, h5, h6',
  paragraph: 'p',
  image: 'img',
  blockquote: 'blockquote',
  list: 'ul, ol',
  hr: 'hr',
  strong: 'strong',
  em: 'em',
  mark: 'mark',
  container: '.custom-container',
}

/**
 * 压缩 HTML 字符串
 * @param html HTML 字符串
 * @returns 压缩后的 HTML 字符串
 */
function minifyHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
    .replace(/>\s+</g, '><') // 删除标签之间的空白
    .replace(/<!--[\s\S]*?-->/g, '') // 删除HTML注释
    .trim() // 删除首尾空白
}

/**
 * 将样式对象转换为样式字符串
 * @param styles 样式对象
 * @returns 样式字符串
 */
export function styleObjectToString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}

/**
 * 将样式应用到元素上
 * @param elements 要应用样式的元素数组
 * @param baseStyles 基础样式
 * @param additionalStyles 附加样式
 */
export function applyStyles(
  elements: HTMLElement[],
  baseStyles: Record<string, string> = {},
  additionalStyles: Record<string, string> = {},
): void {
  if (!elements.length)
    return

  const combinedStyles = { ...baseStyles, ...additionalStyles }
  const styleString = styleObjectToString(combinedStyles)

  elements.forEach((element) => {
    element.setAttribute('style', styleString)
  })
}

/**
 * 生成纯文本内容
 * @param html HTML 字符串
 * @returns 纯文本内容
 */
export function generatePlainText(html: string): string {
  if (typeof document === 'undefined')
    return ''

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || ''
}

/**
 * 移除之前添加的导出按钮（如果存在）
 */
function removeExistingExportButton(): void {
  if (typeof document === 'undefined')
    return

  const existingButton = document.querySelector('.jie-export-button')
  if (existingButton && existingButton.parentNode) {
    existingButton.parentNode.removeChild(existingButton)
  }
}

/**
 * 应用主题样式到HTML元素
 * @param container HTML容器元素
 * @param theme 主题样式
 */
function applyThemeStyles(container: HTMLElement, theme: ThemeStyles): void {
  const STYLES = theme.styles

  // 应用所有样式处理
  for (const [type, selector] of Object.entries(ELEMENT_SELECTORS)) {
    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    if (elements.length > 0) {
      // 获取当前元素类型的处理器
      const processor = getThemeProcessor(theme.code, type)
      if (processor) {
        processor(elements, STYLES)
      }
    }
  }
}

/**
 * 生成带内联样式的 HTML
 * @param html 原始 HTML
 * @param theme 主题样式
 * @returns 带内联样式的 HTML
 */
export function generateInlineStyledHtml(html: string, theme: ThemeStyles): string {
  if (typeof document === 'undefined')
    return html

  // 先移除可能存在的导出按钮
  removeExistingExportButton()

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 过滤掉一级标题
  const h1Elements = tempDiv.querySelectorAll('h1')
  h1Elements.forEach((element) => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })

  // 应用主题样式
  applyThemeStyles(tempDiv, theme)

  // 创建最终内容容器并组装完整内容
  const contentWrapper = document.createElement('div')
  contentWrapper.innerHTML = [
    theme.headerContent || '',
    tempDiv.innerHTML,
    theme.footerContent || '',
  ].join('')

  // 调用主题的 onAfterRender 回调函数（如果存在）
  // 使用 setTimeout 确保 DOM 已更新
  setTimeout(() => {
    if (theme.onAfterRender) {
      const contentContainer = document.querySelector('.content-container') as HTMLElement
      if (contentContainer) {
        theme.onAfterRender(contentContainer)
      }
    }
  }, 10)

  return minifyHtml(contentWrapper.innerHTML)
}
