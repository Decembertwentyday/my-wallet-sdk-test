// =============================================================================
// ConnectButton 的 TypeScript 类型（npm 导出，IDE 自动补全）
// =============================================================================
//
// 集成方通常只放一个按钮，传 size 即可得到对应样式预设：
//   <ConnectButton size="md" />   默认
//   <ConnectButton size="lg" />   大尺寸完整版
//   <ConnectButton size="sm" />   紧凑模式
//
// 需要覆盖某一项时再单独传 showBalance / chainStatus / accountStatus
//
// =============================================================================

/** sm 紧凑 | md 默认 | lg 大尺寸 */
export type ConnectButtonSize = 'sm' | 'md' | 'lg'

/** 链区域：icon 仅地球图标；full 图标+链名 */
export type ChainStatus = 'icon' | 'full'

/** 账户区域：address 仅地址；full 地址+余额 */
export type AccountStatus = 'address' | 'full'

/** 各 size 对应的默认展示（ConnectButton 内部合并，可被 props 覆盖） */
export const CONNECT_BUTTON_SIZE_PRESETS: Record<
    ConnectButtonSize,
    { showBalance: boolean; chainStatus: ChainStatus; accountStatus: AccountStatus }
> = {
    md: {
        showBalance: true,
        chainStatus: 'full',
        accountStatus: 'full',
    },
    lg: {
        showBalance: true,
        chainStatus: 'full',
        accountStatus: 'full',
    },
    sm: {
        showBalance: false,
        chainStatus: 'icon',
        accountStatus: 'address',
    },
}

export interface ConnectButtonProps {
    /** 未连接时按钮文字 */
    label?: string
    /** 尺寸与展示预设：sm 紧凑 | md 默认 | lg 大尺寸 */
    size?: ConnectButtonSize
    /** 不传则跟随 size 预设；传了则覆盖预设 */
    showBalance?: boolean
    chainStatus?: ChainStatus
    accountStatus?: AccountStatus
    /** 点「连接钱包」、弹窗打开前触发（埋点等） */
    onConnect?: () => void
    className?: string
}
