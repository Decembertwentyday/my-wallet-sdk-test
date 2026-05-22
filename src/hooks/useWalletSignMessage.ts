// =============================================================================
// useWalletSignMessage — 消息签名（不花 gas，不广播交易）
// =============================================================================
//
// 【点击流程（Demo）】
//   用户点「签名测试」→ signMessage('Hello') → signMessageAsync
//   → 钱包弹 personal_sign → 用户确认 → 返回 0x 签名串
//
// 【原理】私钥在钱包内签名，网页只拿到签名结果，拿不到私钥
//
// 【wagmi v3】等待态用 isPending，此处别名 isLoading 保持对外 API 稳定
//
// =============================================================================

import { useAccount, useSignMessage } from 'wagmi'

export function useWalletSignMessage() {
    const { isConnected } = useAccount()
    const {
        data,
        isError,
        isPending: isLoading,
        error,
        signMessageAsync,
    } = useSignMessage()

    const signMessage = async (message: string) => {
        if (!isConnected) throw new Error('请先连接钱包')
        return signMessageAsync({ message })
    }

    return {
        signMessage,
        data,
        isLoading,
        isError,
        error: error?.message ?? null,
        isConnected,
    } as const
}
