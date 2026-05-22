// =============================================================================
// RECOMMENDED_WALLETS — 弹窗「推荐安装」区配置（不是已安装列表的上限）
// =============================================================================
//
// 已安装列表来自浏览器 EIP-6963，本文件只用于：
//   1. 未检测到时展示「去安装」链接
//   2. rdns / altNames 匹配，避免推荐区与「已安装」重复
//   3. iconUrl 作为 WalletIcon 兜底
//
// 扩展新钱包：复制一项，填 rdns（可查 EIP-6963 文档）、installUrl、iconUrl
//
// =============================================================================

export const RECOMMENDED_WALLETS = [
    {
        rdns: ['io.metamask', 'io.metamask.mobile'],
        name: 'MetaMask',
        iconUrl: 'https://docs.metamask.io/metamask-fox.svg',
        icon: '🦊',
        installUrl: 'https://metamask.io/download/',
    },
    {
        rdns: 'com.coinbase.wallet',
        name: 'Coinbase Wallet',
        iconUrl: 'https://www.coinbase.com/img/favicon/favicon-256.png',
        icon: '🔵',
        installUrl: 'https://www.coinbase.com/wallet/downloads',
    },
    {
        rdns: ['com.okex.wallet'],
        name: 'OKX Wallet',
        iconUrl: 'https://static.okx.com/cdn/assets/imgs/226/EB771C0E78AFCA7F.png',
        icon: '🟠',
        installUrl: 'https://www.okx.com/download',
        altNames: ['OKX Wallet', 'OKX'],
    },
    {
        rdns: 'io.rabby',
        name: 'Rabby Wallet',
        iconUrl: 'https://rabby.io/assets/images/logo-128.png',
        icon: '🐰',
        installUrl: 'https://rabby.io/download',
        altNames: ['Rabby', 'Rabby Wallet'],
    },
    {
        rdns: 'io.phantom',
        name: 'Phantom',
        iconUrl: 'https://phantom.app/img/phantom-icon-purple.svg',
        icon: '👻',
        installUrl: 'https://phantom.app/download',
    },
] as const
