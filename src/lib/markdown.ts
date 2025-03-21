import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

/**
 * Markdown 解析器配置
 */
const markdownConfig = {
  html: true,
  typographer: true,
  linkify: true,
}

/**
 * 创建并配置 markdown-it 实例
 */
function createMarkdownParser() {
  const md = new MarkdownIt(markdownConfig)

  // 自定义图片渲染，确保图片样式一致
  md.renderer.rules.image = (tokens, idx, _options, _env, _self) => {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    const src = token.attrs?.[srcIndex]?.[1] || ''
    const alt = token.content || ''

    return `<img src="${src}" alt="${alt}" style="max-width: 100%; display: block; margin: 0 auto;">`
  }

  // 添加默认容器
  md.use(container, 'default', {
    validate: (params: string) => {
      return params.trim() === 'default' || params.trim() === ''
    },
    render: (tokens: any[], idx: number) => {
      if (tokens[idx].nesting === 1) {
        return '<section class="custom-container default">\n'
      }
      else {
        return '</section>\n'
      }
    },
  })

  return md
}

// 创建解析器实例
const md = createMarkdownParser()

// 缓存最近解析的结果，提高性能
const cache = new Map<string, string>()
const MAX_CACHE_SIZE = 20

/**
 * 将Markdown文本解析为HTML
 * @param markdownText Markdown格式的文本
 * @returns 解析后的HTML字符串
 */
export function parseMarkdown(markdownText: string): string {
  if (!markdownText.trim())
    return ''

  // 检查缓存中是否已有结果
  if (cache.has(markdownText)) {
    const cachedResult = cache.get(markdownText)
    if (cachedResult)
      return cachedResult
  }

  const result = md.render(markdownText)

  // 更新缓存
  if (cache.size >= MAX_CACHE_SIZE) {
    // 如果缓存已满，删除最早添加的项
    const firstKey = cache.keys().next().value
    if (firstKey)
      cache.delete(firstKey)
  }

  cache.set(markdownText, result)
  return result
}
