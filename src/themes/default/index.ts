import type { ThemeStyles } from '../../types'

/**
 * 默认主题 - 原始样式
 */
export const defaultTheme: ThemeStyles = {
  code: 'default',
  name: '默认主题',
  styles: {
    base: {
      'font-family': 'mp-quote, "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
      'font-size': '16px',
      'line-height': '1.75em',
      'letter-spacing': '1px',
      'text-align': 'justify',
    },
    heading: {
      base: {
        'font-weight': 'bold',
        'margin-top': '24px',
        'margin-bottom': '24px',
      },
      h1: {
        'font-size': '24px',
      },
      h2: {
        'font-size': '22px',
        'color': '#33a474',
        'line-height': '1.35em',
      },
      h3: {
        'font-size': '18px',
        'margin-bottom': '16px',
      },
      h4: {
        'font-size': '16px',
      },
    },
    paragraph: {
      margin: '0 0 20px',
    },
    image: {
      'display': 'block',
      'max-width': '100%',
      'height': 'auto',
      'border-radius': '6px',
    },
    blockquote: {
      'margin': '1em 0',
      'padding': '0.5em 1em',
      'border-left': '3px solid #e6e6e6',
      'background-color': '#f7f7f7',
      'color': '#666',
    },
    list: {
      base: {
        'padding-left': '1.2em',
        'margin': '0 0 24px',
      },
      ul: {
        'list-style-type': 'disc',
      },
      ol: {
        'list-style-type': 'decimal',
        'counter-reset': 'item',
      },
      li: {
        'margin-bottom': '8px',
        'letter-spacing': '0.5px',
      },
    },
    strong: {
      'font-weight': 'bold',
      'display': 'inline',
    },
    em: {
      'display': 'inline',
      'font-style': 'italic',
      'color': '#88619a',
      'font-weight': 'bold',
    },
    hr: {
      'border': 'none',
      'border-top': '1px solid #e6e6e6',
      'margin': '1.5em 0',
    },
  },
  footerContent: '<p style="padding: 0; margin: 0 0 16px; text-align: center; font-size: 14px; color: #666;">关注点赞，好运不断！点个<span style="color: #33a474; font-weight: bold;">在看</span>，你最好看🌹</p>',
}
