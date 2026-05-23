// =============================================================================
// SDK 对外导出入口（第二阶段 npm 发布以此为主）
// =============================================================================
//
// 使用方：
//   import { WalletProvider, ConnectButton, useWalletBalance } from '你的包名'
//
// 注意：ConnectButton 依赖 Tailwind；宿主项目需 @import "tailwindcss"
//
// =============================================================================

export { WalletProvider } from './components/WalletProvider'
export { ConnectButton } from './components/ConnectButton'
export { ChainSelector } from './components/ChainSelector'

export { useWalletBalance } from './hooks/useWalletBalance'
export { useWalletSignMessage } from './hooks/useWalletSignMessage'
export { useWalletSendTransaction } from './hooks/useWalletSendTransaction'

export type {
    ConnectButtonProps,
    ConnectButtonSize,
    ChainStatus,
    AccountStatus,
} from './types/connectButton'
export { CONNECT_BUTTON_SIZE_PRESETS } from './types/connectButton'

export { config, DEFAULT_CHAIN_ID } from './wagmi/config'
