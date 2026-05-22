// =============================================================================
// SignDemo — Demo：点击按钮 → 钱包签名一条消息
// =============================================================================

import { useWalletSignMessage } from '../hooks/useWalletSignMessage'

export function SignDemo() {
    const { signMessage, data, isLoading, isConnected } = useWalletSignMessage()

    if (!isConnected) return null

    const handleSign = async () => {
        try {
            const signature = await signMessage('Hello, Wallet!')
            console.log('签名结果:', signature)
        } catch (err) {
            console.error('签名失败:', err)
        }
    }

    return (
        <div className="rounded-lg bg-white px-4 py-2 shadow">
            <button
                type="button"
                onClick={handleSign}
                disabled={isLoading}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? '签名中...' : '签名测试'}
            </button>
            {data && <div className="mt-2 break-all text-xs text-gray-600">签名: {data}</div>}
        </div>
    )
}
