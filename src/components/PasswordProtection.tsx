import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useState } from 'react'
import { toast } from 'sonner'

// 设置固定密码
const FIXED_PASSWORD = 'md2wx123'
const WECHAT_ID = 'Nindle_' // 微信号

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
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

  // 复制微信号
  const handleCopyWechat = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID)
      toast.success('微信号已复制到剪贴板')
    }
    catch (err) {
      console.error(err)
      toast.error('复制失败，请手动复制')
    }
  }

  // 显示群聊二维码
  const handleJoinGroup = () => {
    setShowQRCode(true)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {/* 标题图标 */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-700">
            公告
          </h2>
        </div>

        {/* 提示文本 */}
        <div className="space-y-2 text-center text-gray-600">
          <p>关注公众号【Nindle】发送【密码】获取访问密码</p>
          <p>若提示密码不对，请清理浏览器缓存再输入</p>
          <p>仅供本人学习研究，禁止一切商用行为</p>
          <p>如有侵犯权益，敬请联系删除</p>
        </div>

        {/* 输入框和按钮组 */}
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="请输入访问密码"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full border-gray-300"
          />
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              确认访问
            </Button>
            <Button
              type="button"
              onClick={handleCopyWechat}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              复制微信号
            </Button>
            <Button
              type="button"
              onClick={handleJoinGroup}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              进群
            </Button>
          </div>
        </div>

        {/* 二维码弹窗 */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  扫码加入群聊
                </h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src="./showQRCode.jpeg" // 需要替换为实际的二维码图片路径
                    alt="群聊二维码"
                    className="w-full h-auto"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  请使用QQ扫描二维码加入群聊
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setShowQRCode(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                关闭
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
