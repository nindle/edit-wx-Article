import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

// 定义类型
interface ExportResult {
  canvas: HTMLCanvasElement
  name: string
}

interface BlobResult {
  blob: Blob
  name: string
}

// HTML2Canvas 配置
const HTML2CANVAS_CONFIG = {
  scale: 2, // 提高图片质量
  logging: false,
  useCORS: true,
}

/**
 * 创建临时DOM元素并在使用后清理
 * @param callback 使用临时元素的回调函数
 * @returns 回调函数的返回值
 */
async function withTempElement<T>(callback: (wrapper: HTMLDivElement) => Promise<T>): Promise<T> {
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.left = '-9999px'
  wrapper.style.background = '#fff'

  document.body.appendChild(wrapper)

  try {
    return await callback(wrapper)
  }
  finally {
    document.body.removeChild(wrapper)
  }
}

/**
 * 将Canvas转换为Blob
 * @param canvas Canvas元素
 * @param mimeType 图片类型
 * @returns Blob对象
 */
function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/png'): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      }
      else {
        reject(new Error('无法创建图片Blob'))
      }
    }, mimeType)
  })
}

/**
 * 显示UI提示
 * @param message 提示信息
 * @param options 配置选项
 * @returns 提示元素和清理函数
 */
function showNotification(
  message: string,
  options: {
    isError?: boolean
    duration?: number
    autoRemove?: boolean
  } = {},
): { element: HTMLDivElement, remove: () => void } {
  const { isError = false, duration = 3000, autoRemove = true } = options

  const element = document.createElement('div')
  element.textContent = message
  element.style.position = 'fixed'
  element.style.top = '50%'
  element.style.left = '50%'
  element.style.transform = 'translate(-50%, -50%)'
  element.style.padding = '10px 20px'
  element.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  element.style.color = '#fff'
  element.style.borderRadius = '4px'
  element.style.zIndex = '10000'
  document.body.appendChild(element)

  const remove = () => {
    if (document.body.contains(element)) {
      document.body.removeChild(element)
    }
  }

  if (autoRemove) {
    setTimeout(remove, duration)
  }

  return { element, remove }
}

/**
 * 创建封面图
 * @returns 返回 Promise<ExportResult>
 */
async function createCoverImage(): Promise<ExportResult> {
  try {
    // 查找 .content-container 下的第一个 h1 标签
    let title = '精美内容'

    const contentContainer = document.querySelector('.content-container')
    if (contentContainer) {
      const h1Element = contentContainer.querySelector('h1')
      if (h1Element?.textContent) {
        title = h1Element.textContent.trim()
      }
    }

    return await withTempElement(async (wrapper) => {
      // 创建封面容器
      const coverContainer = document.createElement('div')
      coverContainer.style.width = '620px'
      coverContainer.style.height = '820px'
      coverContainer.style.background = 'linear-gradient(135deg, #ff4f79 0%, #ff8a65 100%)'
      coverContainer.style.boxSizing = 'border-box'
      coverContainer.style.display = 'flex'
      coverContainer.style.flexDirection = 'column'
      coverContainer.style.justifyContent = 'center'
      coverContainer.style.alignItems = 'center'
      coverContainer.style.padding = '40px'
      coverContainer.style.color = '#fff'
      coverContainer.style.fontFamily = 'mp-quote, "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif'
      coverContainer.style.textAlign = 'center'
      coverContainer.style.position = 'relative'
      coverContainer.style.overflow = 'hidden'

      // 添加装饰元素
      const decorElement1 = document.createElement('div')
      decorElement1.style.position = 'absolute'
      decorElement1.style.width = '300px'
      decorElement1.style.height = '300px'
      decorElement1.style.borderRadius = '50%'
      decorElement1.style.background = 'rgba(255, 255, 255, 0.1)'
      decorElement1.style.top = '-100px'
      decorElement1.style.right = '-100px'

      const decorElement2 = document.createElement('div')
      decorElement2.style.position = 'absolute'
      decorElement2.style.width = '200px'
      decorElement2.style.height = '200px'
      decorElement2.style.borderRadius = '50%'
      decorElement2.style.background = 'rgba(255, 255, 255, 0.1)'
      decorElement2.style.bottom = '-50px'
      decorElement2.style.left = '-50px'

      // 创建标题元素
      const titleElement = document.createElement('h1')
      titleElement.textContent = title
      titleElement.style.fontSize = '48px'
      titleElement.style.fontWeight = 'bold'
      titleElement.style.margin = '0 0 30px 0'
      titleElement.style.padding = '0'
      titleElement.style.lineHeight = '1.4'
      titleElement.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
      titleElement.style.maxWidth = '90%'

      // 创建副标题/描述
      const subtitleElement = document.createElement('p')
      subtitleElement.textContent = '小帅哥洁洁 · 允许一切发生'
      subtitleElement.style.fontSize = '22px'
      subtitleElement.style.margin = '0'
      subtitleElement.style.padding = '0'
      subtitleElement.style.opacity = '0.8'

      // 创建底部装饰线
      const lineElement = document.createElement('div')
      lineElement.style.width = '80px'
      lineElement.style.height = '6px'
      lineElement.style.background = '#fff'
      lineElement.style.margin = '40px 0'
      lineElement.style.borderRadius = '3px'

      // 添加所有元素到封面容器
      coverContainer.appendChild(decorElement1)
      coverContainer.appendChild(decorElement2)
      coverContainer.appendChild(titleElement)
      coverContainer.appendChild(lineElement)
      coverContainer.appendChild(subtitleElement)

      // 将封面容器添加到包装元素
      wrapper.appendChild(coverContainer)

      // 使用 html2canvas 将封面转换为 canvas
      const canvas = await html2canvas(coverContainer, {
        ...HTML2CANVAS_CONFIG,
        backgroundColor: null,
      })

      // 生成唯一名称
      const name = `cover-${Date.now()}.png`

      return { canvas, name }
    })
  }
  catch (error) {
    console.error('创建封面图失败:', error)
    throw error
  }
}

/**
 * 导出容器为图片
 * @param containerElement 容器元素
 * @param index 容器索引，用于生成文件名
 * @returns 返回 Promise<ExportResult>
 */
async function exportContainerAsImage(containerElement: HTMLElement, index?: number): Promise<ExportResult> {
  try {
    return await withTempElement(async (wrapper) => {
      // 克隆容器元素
      const clone = containerElement.cloneNode(true) as HTMLElement
      clone.style.margin = '0'

      // 创建一个带内边距的外层容器
      const paddingContainer = document.createElement('div')
      paddingContainer.style.padding = '24px'
      paddingContainer.style.background = '#fff'
      paddingContainer.style.boxSizing = 'border-box'
      paddingContainer.style.width = '620px'
      paddingContainer.style.maxWidth = '100%'

      // 将克隆元素添加到带内边距的容器中
      paddingContainer.appendChild(clone)
      wrapper.appendChild(paddingContainer)

      // 使用 html2canvas 将元素转换为 canvas
      const canvas = await html2canvas(paddingContainer, {
        ...HTML2CANVAS_CONFIG,
        backgroundColor: '#fff',
      })

      // 生成唯一名称
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      const indexPrefix = typeof index === 'number' ? `模块${index + 1}-` : ''
      const name = `${indexPrefix}container-${timestamp}-${random}.png`

      return { canvas, name }
    })
  }
  catch (error) {
    console.error('导出容器为图片失败:', error)
    throw error
  }
}

/**
 * 导出所有容器
 * @param containers 容器元素列表
 */
export async function exportAllContainers(containers: NodeListOf<Element>): Promise<void> {
  try {
    const notification = showNotification('正在生成图片，请稍候...', { autoRemove: false })

    // 创建一个 JSZip 实例
    const zip = new JSZip()

    // 创建封面图
    const coverResult = await createCoverImage()
    const coverBlob = await canvasToBlob(coverResult.canvas)
    zip.file(coverResult.name, coverBlob)

    // 导出所有容器
    const containerPromises: Promise<BlobResult>[] = []
    containers.forEach((container, index) => {
      if (container instanceof HTMLElement) {
        const promise = exportContainerAsImage(container, index)
          .then(async (result) => {
            const blob = await canvasToBlob(result.canvas)
            return { blob, name: result.name }
          })
        containerPromises.push(promise)
      }
    })

    // 等待所有容器导出完成
    const results = await Promise.all(containerPromises)

    // 添加所有图片到 zip
    results.forEach((result) => {
      zip.file(result.name, result.blob)
    })

    // 生成 zip 文件
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    // 下载 zip 文件
    saveAs(zipBlob, `小帅哥洁洁-模块导出-${Date.now()}.zip`)

    // 更新通知
    notification.remove()
    showNotification('导出成功！', { duration: 2000 })
  }
  catch (error) {
    console.error('导出所有容器失败:', error)
    showNotification('导出失败，请重试', { isError: true })
  }
}
