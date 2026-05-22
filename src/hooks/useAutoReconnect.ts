// =============================================================================
// useAutoReconnect — 刷新页面后尝试恢复上次连接的钱包
// =============================================================================
//
// 【两层重连，不要重复立刻调两次 reconnect】
//
//   第 1 层（内置）：<WagmiProvider reconnectOnMount />
//     页面加载时 wagmi 读 localStorage 里的 recentConnectorId，静默 reconnect
//
//   第 2 层（本 Hook）：延迟 600ms 再试一次
//     原因：EIP-6963 注册连接器是异步的，太早 reconnect 可能找不到对应 connector
//     条件：仍未连接 && 有 recentConnectorId && 本页只重试一次（useRef）
//
// 【为何不用 console.error 打失败？】
//     用户从未连过、或已撤销授权，失败是正常情况，不应吓人
//
// =============================================================================

import { useEffect, useRef } from 'react'
import { reconnect } from '@wagmi/core'
import { useAccount, useConfig } from 'wagmi'

const LATE_RETRY_MS = 600

export function useAutoReconnect() {
    const config = useConfig()
    const { isConnected } = useAccount()
    const retried = useRef(false)

    useEffect(() => {
        if (retried.current) return

        const timer = window.setTimeout(async () => {
            retried.current = true

            if (isConnected) return

            let recentId: string | null | undefined
            try {
                recentId = await config.storage?.getItem('recentConnectorId')
            } catch {
                return
            }
            if (!recentId) return

            try {
                const result = await reconnect(config)
                if (import.meta.env.DEV && result.length > 0) {
                    console.info('[wallet-sdk] 延迟自动重连成功')
                }
            } catch {
                // 静默：插件未就绪或用户未授权
            }
        }, LATE_RETRY_MS)

        return () => window.clearTimeout(timer)
    }, [config, isConnected])
}
