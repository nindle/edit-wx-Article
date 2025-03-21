import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useState } from 'react'
import { toast } from 'sonner'

// 设置固定密码
const FIXED_PASSWORD = 'md2wx123'

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const { setValue: setAuthenticated } = useLocalStorage<boolean>('isAuthenticated', false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === FIXED_PASSWORD) {
      toast.success('验证成功')
      // 验证成功后，将认证状态保存到本地存储
      setAuthenticated(true)
      onAuthenticated()
    }
    else {
      toast.error('密码错误')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          请输入访问密码
        </h2>
        <p className="text-center text-gray-600">
          此应用受密码保护，请输入正确的密码以继续
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full"
            autoFocus
          />

          <Button type="submit" className="w-full">
            验证密码
          </Button>
        </form>
      </div>
    </div>
  )
}
