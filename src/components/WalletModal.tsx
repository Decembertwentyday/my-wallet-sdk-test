// =============================================================================
// WalletModal — 选择钱包弹窗（详细点击流程见文件头）
// =============================================================================
//
// 【灵活性】已安装列表 = 浏览器实际上报的全部插件（无个数上限），非写死 RECOMMENDED_WALLETS
//
// 【三种界面】installWallet === null → 列表；非 null → 安装引导
//
// 【点击流程】
//   ConnectButton 设 open=true → useEffect 触发 requestEip6963Providers()
//   点「已安装」一行 → handleConnect(connector) → connect({ chainId: Sepolia }) → 关弹窗
//   点「推荐」且未安装 → setInstallWallet → 「去安装」window.open
//
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { useConnect, useConnectors } from 'wagmi'
import type { Connector } from 'wagmi'
import { RECOMMENDED_WALLETS } from '../constants/wallets'
import { DEFAULT_CHAIN_ID } from '../wagmi/config'
import {
    findConnectorForRecommended,
    getConnectorDisplayName,
    getInstalledBrowserConnectors,
    requestEip6963Providers,
} from '../utils/walletConnectors'
import { WalletIcon } from './WalletIcon'

interface WalletModalProps {
    open: boolean
    onClose: () => void
}

export function WalletModal({ open, onClose }: WalletModalProps) {
    const connectors = useConnectors()
    const { connect } = useConnect()

    const [installWallet, setInstallWallet] = useState<{
        name: string
        iconUrl?: string
        icon: string
        installUrl: string
    } | null>(null)

    useEffect(() => {
        if (!open) return
        requestEip6963Providers()
    }, [open])

    const installedConnectors = useMemo(
        () => getInstalledBrowserConnectors(connectors),
        [connectors]
    )

    const recommendedNotInstalled = useMemo(
        () =>
            RECOMMENDED_WALLETS.filter(
                (wallet) => !findConnectorForRecommended(connectors, wallet)
            ),
        [connectors]
    )

    const handleClose = () => {
        setInstallWallet(null)
        onClose()
    }

    const handleConnect = async (connector: Connector) => {
        try {
            await connect({ connector, chainId: DEFAULT_CHAIN_ID })
            handleClose()
        } catch (error) {
            console.error('连接钱包失败:', error)
        }
    }

    const handleRecommendedClick = (wallet: typeof RECOMMENDED_WALLETS[number]) => {
        const matchingConnector = findConnectorForRecommended(connectors, wallet)
        if (matchingConnector) {
            handleConnect(matchingConnector)
        } else {
            setInstallWallet({
                name: wallet.name,
                iconUrl: wallet.iconUrl,
                icon: wallet.icon,
                installUrl: wallet.installUrl,
            })
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {installWallet ? '安装钱包' : '选择钱包'}
                    </h2>
                    <button type="button" onClick={handleClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {installWallet ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <WalletIcon name={installWallet.name} iconUrl={installWallet.iconUrl} iconEmoji={installWallet.icon} size="lg" />
                        <p className="text-sm text-gray-600">
                            未检测到 <span className="font-medium">{installWallet.name}</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => window.open(installWallet.installUrl, '_blank')}
                            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                        >
                            去安装
                        </button>
                        <button type="button" onClick={() => setInstallWallet(null)} className="text-sm text-gray-500">
                            返回列表
                        </button>
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {installedConnectors.length > 0 ? (
                            <div className="mb-4">
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    浏览器已安装（{installedConnectors.length}）
                                </h3>
                                <p className="mb-2 text-xs text-gray-500">EIP-6963 自动发现，装几个显示几个</p>
                                <div className="flex flex-col gap-2">
                                    {installedConnectors.map((connector) => {
                                        const name = getConnectorDisplayName(connector)
                                        return (
                                            <button
                                                key={connector.id}
                                                type="button"
                                                onClick={() => handleConnect(connector)}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-blue-200 hover:bg-blue-50/50"
                                            >
                                                <WalletIcon name={name} connector={connector} size="lg" />
                                                <span className="text-sm font-medium text-gray-900">{name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                暂未检测到插件。安装后刷新；打开本弹窗会再次扫描。
                            </p>
                        )}

                        {recommendedNotInstalled.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">推荐安装</h3>
                                <div className="flex flex-col gap-2">
                                    {recommendedNotInstalled.map((wallet) => (
                                        <button
                                            key={wallet.name}
                                            type="button"
                                            onClick={() => handleRecommendedClick(wallet)}
                                            className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50"
                                        >
                                            <WalletIcon name={wallet.name} iconUrl={wallet.iconUrl} iconEmoji={wallet.icon} size="lg" />
                                            <span className="text-sm font-medium text-gray-900">{wallet.name}</span>
                                            <span className="ml-auto text-xs text-orange-500">未安装</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
