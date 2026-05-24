// =============================================================================
// wagmi 全局配置 — SDK「大脑」
// =============================================================================
//
// createConfig 三块（缺一不可）：
//   chains      — 支持哪些网络（Mainnet / Sepolia）
//   connectors  — 怎么连钱包（injected / metaMask / coinbaseWallet）
//   transports  — 每条链的 RPC（必须用 rpcUrls.ts，禁止裸 http()，否则浏览器 CORS）
//
// DEFAULT_CHAIN_ID：WalletModal connect 时默认切到 Sepolia 测试网
//
// =============================================================================

import { createConfig, fallback, http } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { injected, metaMask, coinbaseWallet } from '@wagmi/connectors'
import { MAINNET_RPC_URLS, SEPOLIA_RPC_URLS } from './rpcUrls'

export const DEFAULT_CHAIN_ID = sepolia.id // 11551111

function createHttpTransport(urls: readonly string[]) {
    return fallback(urls.map((url) => http(url)))
}

export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [ // 钱包连接器
        injected(), // 浏览器内钱包
        metaMask(), // MetaMask
        coinbaseWallet({ appName: 'Wallet SDK Demo' }),
    ],
    transports: {
        [mainnet.id]: createHttpTransport(MAINNET_RPC_URLS),
        [sepolia.id]: createHttpTransport(SEPOLIA_RPC_URLS),
    },
})
