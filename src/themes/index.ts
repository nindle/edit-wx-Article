import type { ThemeStyles } from '../types'
import { dafuxiaojiTheme } from './dafuxiaoji'
import { defaultTheme } from './default'
import { jieTheme } from './jie'
import { nindleTheme } from './nindle'
// 导出所有主题
export const allThemes: ThemeStyles[] = [
  defaultTheme,
  jieTheme,
  nindleTheme,
  dafuxiaojiTheme,
]

// 导出默认主题
export { defaultTheme }

// 通过代码获取主题
export function getThemeByCode(code: string): ThemeStyles {
  return allThemes.find(theme => theme.code === code) || defaultTheme
}
