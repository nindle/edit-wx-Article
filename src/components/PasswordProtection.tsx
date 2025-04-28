import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifyPassword } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

// 设置微信号
const WECHAT_ID = 'Nindle_' // 微信号

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 使用API验证
      const data = await verifyPassword(password)
      if (data.success) {
        toast.success('验证成功')
        onAuthenticated()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('验证过程出错:', error)
      toast.error('验证过程出错，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 复制微信号
  const handleCopyWechat = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID)
      toast.success('公众号已复制到剪贴板')
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
        <div className="flex flex-col items-center justify-center space-y-2 text-center text-gray-600">
          <img src="./wx-qrcode.jpg" alt="二维码" className="w-52 h-52" />
          <p>扫码关注公众号【Nindle】发送【验证码】获取验证码</p>
          <p>仅供本人学习研究，禁止一切商用行为</p>
          <p>如有侵犯权益，敬请联系删除</p>
        </div>

        {/* 输入框和按钮组 */}
        <div className="space-y-4">
          <Input
            placeholder="请输入验证码"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full border-gray-300"
            disabled={loading}
          />
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? '验证中...' : '确认访问'}
            </Button>
            <Button
              type="button"
              onClick={handleCopyWechat}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              复制公众号
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
                    src="./showQRCode.jpeg"
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
