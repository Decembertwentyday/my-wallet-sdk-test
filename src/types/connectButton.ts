// =============================================================================
// ConnectButton 的 TypeScript 类型（npm 导出，IDE 自动补全）
// =============================================================================
// 与设计图三种样式对应，示例见 App.tsx 三个 <ConnectButton />
//
// 组合规则（ConnectButton 内部）：
//   显示余额 = showBalance === true 且 accountStatus === 'full'
//   链只显示图标 = chainStatus === 'icon'
// =============================================================================

/** sm 紧凑 | md 默认 | lg 大尺寸 */
export type ConnectButtonSize = 'sm' | 'md' | 'lg'

/** 链区域：icon 仅地球图标；full 图标+链名 */
export type ChainStatus = 'icon' | 'full'

/** 账户区域：address 仅地址；full 地址+余额 */
export type AccountStatus = 'address' | 'full'

export interface ConnectButtonProps {
    /** 未连接时按钮文字 */
    label?: string
    size?: ConnectButtonSize
    showBalance?: boolean
    chainStatus?: ChainStatus
    accountStatus?: AccountStatus
    /** 点「连接钱包」、弹窗打开前触发（埋点等） */
    onConnect?: () => void
    className?: string
}
