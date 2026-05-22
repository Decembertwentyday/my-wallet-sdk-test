// =============================================================================
// ConnectButton — SDK 对外主按钮（npm 可导出）
// =============================================================================
//
// 【三种 UI 状态】（互斥，按 if 顺序判断）
//   1. isConnecting     → 转圈「连接中...」（用户在钱包弹窗里还没点批准）
//   2. isConnected      → [ChainSelector][地址 ± 余额][断开]
//   3. 否则（未连接）   → 蓝按钮 + 内嵌 WalletModal
//
// 【点击流程 — 未连接】
//   用户点「连接钱包」
//     → handleOpenConnect()
//     → onConnect?.()           // 可选回调，埋点用
//     → setModalOpen(true)      // 打开 WalletModal
//   用户在弹窗里选钱包并批准
//     → WalletModal 内部 connect()
//     → wagmi 更新 isConnected
//     → 本组件重渲染，进入「已连接」分支，Modal 已关闭
//
// 【点击流程 — 已连接】
//   点地址区域     → handleCopyAddress() 复制完整 0x 地址
//   点 ChainSelector → 见 ChainSelector.tsx（切链）
//   点红色电源图标 → disconnect() 断开，不删钱包账户
//
// 【props 与设计图】见 types/connectButton.ts、App.tsx 三个 section
//
// 【注意】外层必须有 <WalletProvider>；showBalance 且 accountStatus=full 才显示余额
// =============================================================================

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { WalletModal } from './WalletModal'
import { ChainSelector } from './ChainSelector'
import { useWalletBalance } from '../hooks/useWalletBalance'
import { formatBalanceText } from '../utils/formatBalanceText'
import type { ConnectButtonProps } from '../types/connectButton'

const defaultProps = {
    label: '连接钱包',
    size: 'md' as const,
    showBalance: true,
    chainStatus: 'full' as const,
    accountStatus: 'full' as const,
}

export function ConnectButton(props: ConnectButtonProps) {
    const {
        label = defaultProps.label,
        size = defaultProps.size,
        showBalance = defaultProps.showBalance,
        chainStatus = defaultProps.chainStatus,
        accountStatus = defaultProps.accountStatus,
        onConnect,
        className = '',
    } = props

    const { address, isConnecting, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const {
        balance,
        symbol,
        isLoading: balanceLoading,
        isFetching: balanceFetching,
        isError: balanceError,
    } = useWalletBalance()

    // 受控：ConnectButton 持有 modalOpen，传给 WalletModal 的 open
    const [modalOpen, setModalOpen] = useState(false)

    const containerSize = { sm: 'gap-1.5 p-1', md: 'gap-2 p-2', lg: 'gap-3 p-3' }[size]
    const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size]

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

    const handleCopyAddress = async () => {
        if (!address) return
        try {
            await navigator.clipboard.writeText(address)
        } catch {
            console.error('复制地址失败')
        }
    }

    const handleOpenConnect = () => {
        onConnect?.()
        setModalOpen(true)
    }

    if (isConnecting) {
        return (
            <button type="button" disabled className={`inline-flex cursor-wait items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white ${className}`}>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                连接中...
            </button>
        )
    }

    if (isConnected && address) {
        const shouldShowBalance = showBalance && accountStatus === 'full'
        const { text: balanceText, failed: balanceFailed } = formatBalanceText({
            isLoading: balanceLoading,
            isFetching: balanceFetching,
            isError: balanceError,
            balance,
            symbol,
        })

        return (
            <div className={`inline-flex flex-row flex-wrap items-center rounded-xl border border-gray-200 bg-gray-50 shadow-sm ${containerSize} ${className}`}>
                <ChainSelector chainStatus={chainStatus} size={size} />
                <button
                    type="button"
                    onClick={handleCopyAddress}
                    title="点击复制完整地址"
                    className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-gray-800 shadow-sm hover:bg-gray-100 ${textSize}`}
                >
                    <span>{formatAddress(address)}</span>
                    {shouldShowBalance && (
                        <span
                            className={`border-l border-gray-200 pl-2 font-sans font-medium ${balanceFailed ? 'text-red-500' : 'text-gray-600'}`}
                            title={balanceFailed ? 'RPC 失败：检查 rpcUrls.ts 或切链' : undefined}
                        >
                            {balanceText}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => disconnect()}
                    title="断开连接"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />
                    </svg>
                </button>
            </div>
        )
    }

    const connectBtnSize = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }[size]

    return (
        <>
            <button
                type="button"
                onClick={handleOpenConnect}
                className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800 ${connectBtnSize} ${className}`}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {label}
            </button>
            <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    )
}
