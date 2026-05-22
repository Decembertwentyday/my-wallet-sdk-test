// =============================================================================
// useWalletSendTransaction — 发送原生币转账（会花 gas）
// =============================================================================
//
// 【点击流程（Demo）】
//   点「发送 0.001 ETH」→ sendTransaction(to, weiString)
//   → sendTransactionAsync → 钱包弹交易确认 → 返回 txHash
//
// 【金额】value 必须用 wei 字符串 + BigInt，不能用 number（精度丢失）
//   0.001 ETH = 1000000000000000（15 个 0）
//
// 【安全】收款地址、金额以钱包弹窗为准，DApp 只负责传参
//
// =============================================================================

import { useAccount, useSendTransaction } from 'wagmi'
import type { Address } from 'viem'

export function useWalletSendTransaction() {
    const { isConnected } = useAccount()
    const {
        data,
        isError,
        isPending: isLoading,
        error,
        sendTransactionAsync,
    } = useSendTransaction()

    const sendTransaction = async (to: Address, value: string): Promise<string> => {
        if (!isConnected) throw new Error('请先连接钱包')
        if (!to.startsWith('0x') || to.length !== 42) {
            throw new Error('无效的接收地址')
        }
        return sendTransactionAsync({
            to,
            value: BigInt(value),
        })
    }

    return {
        sendTransaction,
        data,
        isLoading,
        isError,
        error: error?.message ?? null,
        isConnected,
    } as const
}
