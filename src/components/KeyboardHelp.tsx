import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HelpCircle } from 'lucide-react'

function KeyboardHelp() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>键盘快捷键</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">加粗</span>
            <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+B</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">斜体</span>
            <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+I</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">链接</span>
            <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+K</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">插入空格</span>
            <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Tab</kbd>
          </div>
        </div>

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm text-gray-500">
          提示：选中文本后使用快捷键，可以直接为选中文本应用格式。
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default KeyboardHelp
