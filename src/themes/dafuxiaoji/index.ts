import type { ThemeStyles } from '../../types'
import { exportAllContainers } from './export'

/**
 * 大福小记 主题
 */
export const dafuxiaojiTheme: ThemeStyles = {
  code: 'dafuxiaoji',
  name: '大福小记',
  styles: {
    base: {
      'font-family': 'mp-quote, "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
      'font-size': '16px',
      'line-height': '1.5',
      'letter-spacing': '1px',
      'text-align': 'justify',
      'color': '#555555',
    },
    heading: {
      base: {
        'font-weight': 'bold',
      },
      h2: {
        'display': 'inline-block',
        'padding': '1px 10px',
        'margin-bottom': '12px',
        'color': '#fff',
        'background-color': '#4b47e8',
        'font-size': '18px',
        'border-radius': '14px 0 14px 14px',
      },
    },
    paragraph: {
      margin: '0 0 10px',
    },
    image: {
      'display': 'block',
      'max-width': '100%',
      'height': 'auto',
      'border-radius': '12px',
      'margin-bottom': '15px',
    },
    strong: {},
    em: {
      'font-style': 'normal',
      'color': '#ff6827',
      'font-weight': 'normal',
    },
    container: {
      default: {
        'padding': '12px',
        'margin': '0 0 16px',
        'border': '1px dashed #5b9cf8',
        'border-radius': '12px',
      },
    },
  },
  footerContent: '<p style="padding: 0; margin: 0 0 16px; text-align: center; font-size: 16px; color: #666;">关注点赞，好运不断！点个<span style="color: #ff4f79; font-weight: bold;">在看</span>，你最好看🌹</p>',
  onAfterRender: (contentElement) => {
    const defaultContainers = contentElement.querySelectorAll('.custom-container.default')
    if (defaultContainers.length > 0) {
      const exportAllButton = document.createElement('button')
      exportAllButton.textContent = '导出所有模块'
      exportAllButton.className = 'jie-export-button'
      exportAllButton.style.position = 'fixed'
      exportAllButton.style.right = '20px'
      exportAllButton.style.bottom = '20px'
      exportAllButton.style.padding = '8px 16px'
      exportAllButton.style.fontSize = '14px'
      exportAllButton.style.backgroundColor = '#ff4f79'
      exportAllButton.style.color = '#fff'
      exportAllButton.style.border = 'none'
      exportAllButton.style.borderRadius = '4px'
      exportAllButton.style.cursor = 'pointer'
      exportAllButton.style.zIndex = '1000'
      exportAllButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
      exportAllButton.style.transition = 'transform 0.2s ease'

      // 添加悬停效果
      exportAllButton.addEventListener('mouseenter', () => {
        exportAllButton.style.transform = 'scale(1.05)'
      })

      exportAllButton.addEventListener('mouseleave', () => {
        exportAllButton.style.transform = 'scale(1)'
      })

      exportAllButton.addEventListener('click', () => {
        exportAllContainers(defaultContainers)
      })

      document.body.appendChild(exportAllButton)
    }
  },
}
