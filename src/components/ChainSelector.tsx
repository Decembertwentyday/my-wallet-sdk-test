// =============================================================================
// ChainSelector — 已连接时的网络下拉（Mainnet / Sepolia 等）
// =============================================================================
//
// 【点击流程】
//   点触发按钮 → setOpen(true) 展开列表
//   点某一链   → handleSelectChain(chainId)
//              → switchChain({ chainId })  【钱包弹「切换网络」】
//              → 用户确认后 wagmi 的 chainId 更新
//              → useWalletBalance 自动按新链重新 eth_getBalance
//   点页面其它区域 → useEffect 里监听 document，setOpen(false)
//
// 【原理】DApp 不能偷偷改链，必须 wallet_switchEthereumChain 经用户确认
//
// 【注意】钱包若在未配置的链（如 Polygon），按钮变红，但仍可从下拉切回支持链
// =============================================================================

import { useState, useRef, useEffect } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { config } from '../wagmi/config'
import type { ChainStatus, ConnectButtonSize } from '../types/connectButton'

interface ChainSelectorProps {
    chainStatus?: ChainStatus
    size?: ConnectButtonSize
}

export function ChainSelector({ chainStatus = 'full', size = 'md' }: ChainSelectorProps) {
    const chainId = useChainId()
    const { switchChain, isPending } = useSwitchChain()
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const currentChain = config.chains.find((c) => c.id === chainId)
    const chainName = currentChain?.name ?? `未知 (${chainId})`
    const isUnsupported = !currentChain

    const sizeClasses = {
        sm: 'px-2 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
    }[size]

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    const handleSelectChain = (targetChainId: number) => {
        setOpen(false)
        if (targetChainId === chainId) return
        switchChain({ chainId: targetChainId })
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-60 ${sizeClasses} ${isUnsupported ? 'border-red-300 text-red-600' : ''}`}
                title={isUnsupported ? '当前网络不受支持，请切换' : '切换网络'}
            >
                <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {chainStatus === 'full' && (
                    <span className="max-w-[120px] truncate">{isPending ? '切换中...' : chainName}</span>
                )}
                <svg className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <ul className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {config.chains.map((chain) => (
                        <li key={chain.id}>
                            <button
                                type="button"
                                onClick={() => handleSelectChain(chain.id)}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${chain.id === chainId ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-800'}`}
                            >
                                <span>{chain.name}</span>
                                {chain.id === chainId && <span className="ml-auto text-xs text-blue-500">当前</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
