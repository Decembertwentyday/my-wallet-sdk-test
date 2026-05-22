// =============================================================================
// 钱包图标兜底表 — 当 EIP-6963 未返回 icon 时，按 rdns 或名称查 URL
// =============================================================================
// 加载失败时 WalletIcon 会降级为 emoji 或首字母头像（见 WalletIcon.tsx）
// =============================================================================

export const WALLET_ICON_BY_RDNS: Record<string, string> = {
    'io.metamask': 'https://docs.metamask.io/metamask-fox.svg',
    'io.metamask.mobile': 'https://docs.metamask.io/metamask-fox.svg',
    'com.coinbase.wallet': 'https://www.coinbase.com/img/favicon/favicon-256.png',
    'com.okex.wallet': 'https://static.okx.com/cdn/assets/imgs/226/EB771C0E78AFCA7F.png',
    'io.rabby': 'https://rabby.io/assets/images/logo-128.png',
    'io.phantom': 'https://phantom.app/img/phantom-icon-purple.svg',
    'com.brave.wallet': 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
    'com.trustwallet.app': 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg',
}

export const WALLET_ICON_BY_NAME: Record<string, string> = {
    metamask: 'https://docs.metamask.io/metamask-fox.svg',
    rabby: 'https://rabby.io/assets/images/logo-128.png',
    'rabby wallet': 'https://rabby.io/assets/images/logo-128.png',
    phantom: 'https://phantom.app/img/phantom-icon-purple.svg',
    okx: 'https://static.okx.com/cdn/assets/imgs/226/EB771C0E78AFCA7F.png',
    'okx wallet': 'https://static.okx.com/cdn/assets/imgs/226/EB771C0E78AFCA7F.png',
    'coinbase wallet': 'https://www.coinbase.com/img/favicon/favicon-256.png',
}
