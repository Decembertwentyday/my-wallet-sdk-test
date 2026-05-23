// =============================================================================
// App.tsx：本地 Demo（一个 ConnectButton + 用 size 切换样式预览）
// =============================================================================
//
// 业务集成时只放一个按钮，例如：
//   <ConnectButton size="lg" />
//
// 下面用下拉框切换 size 仅方便本地看三种效果，上线页面可删掉 select
//
// =============================================================================

import { useState } from 'react'
import './App.css'
import { WalletProvider } from './components/WalletProvider'
import { ConnectButton } from './components/ConnectButton'
import { BalanceDisplay } from './demo/BalanceDisplay'
import { SignDemo } from './demo/SignDemo'
import { SendDemo } from './demo/SendDemo'
import type { ConnectButtonSize } from './types/connectButton'

const SIZE_OPTIONS: { value: ConnectButtonSize; label: string }[] = [
    { value: 'md', label: 'md — 默认样式' },
    { value: 'lg', label: 'lg — 大尺寸完整版' },
    { value: 'sm', label: 'sm — 紧凑模式' },
]

function App() {
    const [size, setSize] = useState<ConnectButtonSize>('md')

    return (
        <WalletProvider>
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Wallet SDK Demo</h1>

                <section className="flex w-full max-w-2xl flex-col items-center gap-4">
                    <p className="text-center text-sm text-gray-500">
                        集成时只使用一个 <code className="rounded bg-gray-200 px-1">&lt;ConnectButton size=&quot;…&quot; /&gt;</code>
                        ，通过 <code className="rounded bg-gray-200 px-1">size</code> 控制样式
                    </p>

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Demo 预览 size：</span>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value as ConnectButtonSize)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                        >
                            {SIZE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <ConnectButton
                        size={size}
                        label="连接钱包"
                        className={size === 'sm' ? 'shadow-md' : undefined}
                        onConnect={() => console.log('准备连接钱包', size)}
                    />
                </section>

                <BalanceDisplay />
                <SignDemo />
                <SendDemo />
            </div>
        </WalletProvider>
    )
}

export default App
