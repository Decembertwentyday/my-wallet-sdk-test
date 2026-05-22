// =============================================================================
// WalletProvider — 使用本 SDK 时，在应用最外层包一层
// =============================================================================
//
// 结构（由内到外）：
//   children
//     ← QueryClientProvider（React Query 缓存 RPC）
//       ← WagmiProvider（注入 config：链、连接器、RPC）
//         ← AutoReconnectWrapper（只跑 useAutoReconnect，不渲染 UI）
//
// reconnectOnMount：传给 wagmi，true = 刷新后自动恢复连接（默认开启）
//
// =============================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../wagmi/config'
import { useAutoReconnect } from '../hooks/useAutoReconnect'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 0 },
    },
})

interface WalletProviderProps {
    children: React.ReactNode
    reconnectOnMount?: boolean
}

export function WalletProvider({
    children,
    reconnectOnMount = true,
}: WalletProviderProps) {
    return (
        <WagmiProvider config={config} reconnectOnMount={reconnectOnMount}>
            <QueryClientProvider client={queryClient}>
                <AutoReconnectWrapper />
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

function AutoReconnectWrapper() {
    useAutoReconnect()
    return null
}
