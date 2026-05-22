// =============================================================================
// useWalletBalance — 查询当前账户在「当前链」上的原生币余额
// =============================================================================
//
// 【原理】
//   RPC 方法 eth_getBalance → 返回 wei（bigint）→ formatUnits → "1.7261"
//   查询走 config.transports[chainId]，不是走 MetaMask 转发
//
// 【无点击】由 ConnectButton / BalanceDisplay 挂载时自动请求
//   enabled: 仅 isConnected && address 时才发 RPC
//
// 【切链】chainId 变化 → React Query queryKey 变 → isFetching=true → UI 应用 formatBalanceText 显示「加载中」
//
// 【注意】wagmi v3 无 balance.formatted；余额为 0 时 balance 是字符串 "0"
//
// =============================================================================

import { useAccount, useBalance } from 'wagmi'
import { formatUnits, type Address } from 'viem'

export function useWalletBalance() {
    const { address, isConnected } = useAccount()

    const {
        data: balance,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useBalance({
        address: address as Address | undefined,
        query: {
            enabled: isConnected && !!address,
        },
    })

    if (!isConnected) {
        return {
            balance: undefined,
            symbol: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            isConnected: false,
            refetch,
        } as const
    }

    const formatted =
        balance !== undefined
            ? formatUnits(balance.value, balance.decimals)
            : undefined

    return {
        balance: formatted,
        symbol: balance?.symbol ?? 'ETH',
        isLoading,
        isFetching,
        isError,
        error,
        isConnected: true,
        refetch,
    } as const
}
