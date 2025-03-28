import type { ThemeStyles } from '../../types'
import { exportAllContainers } from './export'

/**
 * nindle 主题
 */
export const nindleTheme: ThemeStyles = {
  code: 'nindle',
  name: 'Nindle',
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
        'color': '#f5f5f5',
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
      'margin-bottom': '25px',
    },
    strong: {},
    em: {
      'font-style': 'normal',
      'color': '#ff6827',
      'font-weight': 'normal',
    },
    mark: {
      'all': 'unset',
      'background': 'none !important',
      'background-color': 'transparent !important',
      'color': '#f24848',
      'font-weight': '500',
      'font-family': 'inherit',
      'font-size': 'inherit',
      'line-height': 'inherit',
    },
    container: {
      default: {
        'padding': '12px',
        'margin': '0 0 16px',
        'border': '1px dashed #5b9cf8',
        'border-radius': '12px',
        'position': 'relative',
        'padding-top': '20px',
      },
    },
  },
  headerContent: '<div style="text-align: center; margin-bottom: 20px;"><img src="https://mmbiz.qpic.cn/sz_mmbiz_gif/HCXMMMTPuuzGPAMhqicsqBQKyklZGYhicrJjESGEhTQwIKrFicAhYbK3rMtlWmjFCT34duvGQpJfA5DSqT3zhqglw/640?wx_fmt=gif&amp;from=appmsg" alt="关注公众号" style="max-width: 100%; border-radius: 12px; margin: 0 auto;" /></div>' as string,
  footerContent: '<div style="text-align: center; margin-bottom: 20px;"><img src="https://mmbiz.qpic.cn/sz_mmbiz_gif/HCXMMMTPuuzGPAMhqicsqBQKyklZGYhicr520N0aPxvAfXib6GnNxz2Xo4gK1hrKsMSgHnxzf8DxgiaqIvbwFKv7ZQ/640?wx_fmt=gif&amp;from=appmsg" alt="关注公众号" style="max-width: 100%; border-radius: 12px; margin: 0 auto;" /></div>' as string,
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
