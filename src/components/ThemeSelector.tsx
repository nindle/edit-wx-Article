import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { allThemes } from '@/themes'

interface ThemeSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

function ThemeSelector({ value, onValueChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择主题" />
        </SelectTrigger>
        <SelectContent>
          {allThemes.map(theme => (
            <SelectItem key={theme.code} value={theme.code}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ThemeSelector
