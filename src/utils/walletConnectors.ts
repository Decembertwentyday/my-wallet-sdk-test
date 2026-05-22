// =============================================================================
// walletConnectors.ts — 钱包列表「数据层」工具（与 UI 解耦，方便测试和复用）
// =============================================================================
//
// 为什么不把这些函数写在 WalletModal 里？
//   - 弹窗只负责「点击与展示」，筛选/去重/匹配逻辑集中在这里更清晰
//   - 以后别的页面（如设置页）也可调用 getInstalledBrowserConnectors
//
// =============================================================================

import type { Connector } from 'wagmi'
import { WALLET_ICON_BY_NAME, WALLET_ICON_BY_RDNS } from '../constants/walletIcons'
import { RECOMMENDED_WALLETS } from '../constants/wallets'

/** wagmi 里属于「浏览器插件类」的 connector.type */
const NAMED_BROWSER_TYPES = new Set(['injected', 'metaMask', 'coinbaseWallet'])

/**
 * 触发 EIP-6963 重新发现
 * 事件名必须是 eip6963:requestProvider（规范规定）
 */
export function requestEip6963Providers(): void {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event('eip6963:requestProvider'))
}

/**
 * 去重用的 key：同一钱包可能同时存在 injected 与 metaMask 两条 connector
 * 优先用 rdns（钱包全球唯一 ID），没有 rdns 则用 wagmi 内部的 connector.id
 */
export function getConnectorDedupeKey(connector: Connector): string {
    if (connector.rdns) {
        const rdns = Array.isArray(connector.rdns) ? connector.rdns[0] : connector.rdns
        return `rdns:${rdns}`
    }
    return `id:${connector.id}`
}

/** 过滤掉无意义的「泛化 Injected」占位，避免列表里多一行看不懂的项 */
function isGenericInjectedConnector(connector: Connector): boolean {
    if (connector.type !== 'injected') return false
    if (connector.rdns) return false
    const name = (connector.name || '').trim().toLowerCase()
    return name === '' || name === 'injected' || name === 'browser wallet'
}

/** 是否应出现在「浏览器已安装」列表 */
export function isBrowserWalletConnector(connector: Connector): boolean {
    if (!NAMED_BROWSER_TYPES.has(connector.type)) return false
    if (isGenericInjectedConnector(connector)) return false
    return true
}

/**
 * 去重：相同 rdns 只保留一条
 * 若两条重复，保留带 icon 的那条（EIP-6963 上报的通常图标更准）
 */
export function dedupeConnectors(connectors: readonly Connector[]): Connector[] {
    const map = new Map<string, Connector>()
    for (const c of connectors) {
        const key = getConnectorDedupeKey(c)
        const prev = map.get(key)
        if (!prev) {
            map.set(key, c)
            continue
        }
        const prevIcon = getConnectorIconUrl(prev)
        const nextIcon = getConnectorIconUrl(c)
        if (!prevIcon && nextIcon) map.set(key, c)
    }
    return [...map.values()]
}

/** 弹窗「已安装」区最终列表：无数量上限 */
export function getInstalledBrowserConnectors(connectors: readonly Connector[]): Connector[] {
    const candidates = connectors.filter(isBrowserWalletConnector)
    const unique = dedupeConnectors(candidates)
    return unique.sort((a, b) =>
        getConnectorDisplayName(a).localeCompare(getConnectorDisplayName(b), 'zh-CN')
    )
}

export function getConnectorDisplayName(connector: Connector): string {
    if (connector.name) return connector.name
    if (connector.rdns) {
        const rdns = Array.isArray(connector.rdns) ? connector.rdns[0] : connector.rdns
        return rdns
    }
    return '未知钱包'
}

/** 钱包插件通过 EIP-6963 提供的 icon 字段（常为 base64 图片） */
export function getConnectorIconUrl(connector: Connector): string | undefined {
    if (typeof connector.icon === 'string' && connector.icon.length > 0) {
        return connector.icon
    }
    return undefined
}

function getRdnsList(connector: Connector): string[] {
    if (!connector.rdns) return []
    return Array.isArray(connector.rdns)
        ? connector.rdns.map(String)
        : [String(connector.rdns)]
}

/**
 * 解析展示用图标 URL（多层兜底，所以叫 resolve）
 * 顺序：调用方传入 > 连接器自带 > 本地 rdns 表 > 名称表 > 推荐表
 */
export function resolveWalletIconUrl(
    connector?: Connector,
    explicitIconUrl?: string
): string | undefined {
    if (explicitIconUrl) return explicitIconUrl

    if (connector) {
        const fromConnector = getConnectorIconUrl(connector)
        if (fromConnector) return fromConnector

        for (const rdns of getRdnsList(connector)) {
            if (WALLET_ICON_BY_RDNS[rdns]) return WALLET_ICON_BY_RDNS[rdns]
        }

        const nameKey = (connector.name || '').toLowerCase()
        if (WALLET_ICON_BY_NAME[nameKey]) return WALLET_ICON_BY_NAME[nameKey]

        const recommended = RECOMMENDED_WALLETS.find((w) =>
            connectorMatchesRecommended(connector, w)
        )
        if (recommended?.iconUrl) return recommended.iconUrl
    }

    return undefined
}

/**
 * 判断某个 connector 是否就是推荐表里的那个钱包（用于去重推荐区）
 * 匹配规则：rdns 有交集，或 connector.name 在 altNames 里
 */
export function connectorMatchesRecommended(
    connector: Connector,
    wallet: { rdns: string | readonly string[]; altNames?: readonly string[] }
): boolean {
    const walletRdns = Array.isArray(wallet.rdns)
        ? wallet.rdns.map(String)
        : [String(wallet.rdns)]
    const connectorRdns = getRdnsList(connector)

    if (walletRdns.some((w) => connectorRdns.includes(w))) return true
    if (wallet.altNames?.includes(connector.name)) return true

    return false
}

/** 点击推荐项时：若已安装，找到对应 connector 用于 connect */
export function findConnectorForRecommended(
    connectors: readonly Connector[],
    wallet: { rdns: string | readonly string[]; altNames?: readonly string[] }
): Connector | undefined {
    return connectors.find((c) => connectorMatchesRecommended(c, wallet))
}
