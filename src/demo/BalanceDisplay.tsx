// =============================================================================
// BalanceDisplay — Demo：单独演示 useWalletBalance Hook
// =============================================================================
// 必须独立成文件，不能写在 App() 内部（否则 Hooks 因组件类型重建而重置查询）
// 点击：无；连接后自动显示余额，切链会触发 isFetching →「加载中...」
// =============================================================================

import { useWalletBalance } from '../hooks/useWalletBalance'
import { formatBalanceText } from '../utils/formatBalanceText'

export function BalanceDisplay() {
    const { balance, symbol, isLoading, isFetching, isConnected, isError } = useWalletBalance()

    if (!isConnected) return null

    const { text, failed } = formatBalanceText({
        isLoading,
        isFetching,
        isError,
        balance,
        symbol,
    })

    return (
        <div className="rounded-lg bg-white px-4 py-2 shadow">
            <span className="text-sm text-gray-500">余额（Hook 演示）：</span>
            <span className={`text-sm font-medium ${failed ? 'text-red-500' : ''}`}>{text}</span>
        </div>
    )
}
