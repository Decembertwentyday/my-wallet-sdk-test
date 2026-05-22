// =============================================================================
// 浏览器可用的公共 RPC 地址（必须支持 CORS，否则 localhost 会报红字）
// =============================================================================
// 原理：余额查询是网页用 fetch 直接 POST 到 RPC，不是走 MetaMask。
// viem 主网默认 https://eth.merkle.io 不允许浏览器跨域 → 控制台 CORS 报错 → 余额失败。
//
// 注意：公共节点可能限流；生产环境请换成 Alchemy / Infura 等并开启 Web 端域名白名单。
// =============================================================================

/** 以太坊主网（chainId: 1）— 多个备用，前一个失败会尝试下一个 */
export const MAINNET_RPC_URLS = [
    'https://cloudflare-eth.com',
    'https://ethereum.publicnode.com',
] as const

/** Sepolia 测试网（chainId: 11155111） */
export const SEPOLIA_RPC_URLS = [
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc.sepolia.org',
] as const
