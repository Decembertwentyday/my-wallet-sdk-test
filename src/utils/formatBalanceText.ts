// =============================================================================
// formatBalanceText — 统一余额文案（避免 0 ETH 被当成「获取失败」）
// =============================================================================
//
// 判断顺序（重要）：
//   1. isLoading || isFetching → 加载中（切链瞬间也算）
//   2. isError                → 获取失败（RPC/CORS）
//   3. balance 有值           → "1.23 ETH"（含 "0 ETH"）
//   4. 否则                   → "—"
//
// =============================================================================

export interface BalanceTextInput {
    isLoading: boolean
    isFetching: boolean
    isError: boolean
    balance: string | undefined
    symbol: string | undefined
}

export function formatBalanceText({
    isLoading,
    isFetching,
    isError,
    balance,
    symbol,
}: BalanceTextInput): { text: string; failed: boolean } {
    if (isLoading || isFetching) {
        return { text: '加载中...', failed: false }
    }
    if (isError) {
        return { text: '获取失败', failed: true }
    }
    if (balance !== undefined && symbol) {
        return { text: `${balance} ${symbol}`, failed: false }
    }
    return { text: '—', failed: false }
}
