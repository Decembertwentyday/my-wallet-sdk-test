// =============================================================================
// WalletIcon — 钱包列表里的图标组件
// =============================================================================
// 原理：不同来源的图标质量不一，用「尝试加载 → 失败则降级」策略
//
// 降级顺序：
//   1. <img src={url}>  （EIP-6963 / iconUrl / rdns 表）
//   2. emoji 方块       （推荐表里的 icon 字段，如 🦊）
//   3. 首字母圆形头像   （图片 404 或没有配置时）
//
// failed 状态：img onError 后置 true，避免死循环请求坏链接
// =============================================================================

import { useState } from 'react'
import type { Connector } from 'wagmi'
import { resolveWalletIconUrl } from '../utils/walletConnectors'

interface WalletIconProps {
    name: string
    connector?: Connector
    iconUrl?: string
    iconEmoji?: string
    size?: 'md' | 'lg'
}

export function WalletIcon({
    name,
    connector,
    iconUrl: iconUrlProp,
    iconEmoji,
    size = 'md',
}: WalletIconProps) {
    // 图片加载失败时设为 true，组件会重新渲染走 emoji/首字母分支
    const [failed, setFailed] = useState(false)

    const resolved = resolveWalletIconUrl(connector, iconUrlProp)

    const box = size === 'lg' ? 'h-10 w-10' : 'h-9 w-9'
    const text = size === 'lg' ? 'text-base' : 'text-sm'

    if (resolved && !failed) {
        return (
            <img
                src={resolved}
                alt={name}
                className={`${box} shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-gray-200`}
                onError={() => setFailed(true)}
            />
        )
    }

    if (iconEmoji) {
        return (
            <span
                className={`${box} flex shrink-0 items-center justify-center rounded-full bg-gray-50 text-xl ring-1 ring-gray-200`}
            >
                {iconEmoji}
            </span>
        )
    }

    const letter = (name.trim()[0] || '?').toUpperCase()
    return (
        <span
            className={`${box} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ${text} font-semibold text-white ring-1 ring-gray-200`}
        >
            {letter}
        </span>
    )
}
