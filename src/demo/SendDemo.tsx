// =============================================================================
// SendDemo — Demo：点击发送 0.001 ETH（Sepolia 测试网需有测试币）
// =============================================================================

import { useWalletSendTransaction } from '../hooks/useWalletSendTransaction'

export function SendDemo() {
    const { sendTransaction, data, isLoading, isConnected } = useWalletSendTransaction()

    if (!isConnected) return null

    const handleSend = async () => {
        try {
            const txHash = await sendTransaction(
                '0xeCA7D58f09c29d64E14506985c0ec7374e56e6dB',
                '1000000000000000'
            )
            console.log('交易哈希:', txHash)
        } catch (err) {
            console.error('交易失败:', err)
        }
    }

    return (
        <div className="rounded-lg bg-white px-4 py-2 shadow">
            <button
                type="button"
                onClick={handleSend}
                disabled={isLoading}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 disabled:opacity-50"
            >
                {isLoading ? '交易确认中...' : '发送 0.001 ETH 测试'}
            </button>
            {data && <div className="mt-2 break-all text-xs text-gray-600">交易哈希: {data}</div>}
        </div>
    )
}
