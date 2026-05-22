// =============================================================================
// App.tsx：本地 Demo 页面（演示 SDK 三种 ConnectButton 样式 + Hooks）
// =============================================================================
// 重要学习点：不要把子组件写在 App 函数「里面」
//
// 错误写法：
//   function App() {
//     function BalanceDisplay() { useWalletBalance() ... }  // 每次 App 渲染都是新组件类型
//   }
//
// 后果：连接钱包 → App 重渲染 → BalanceDisplay 被卸载再挂载 → useBalance 反复重置
//       → 表现为余额一直「加载中」或「获取失败」
//
// 正确写法：子组件放到单独文件（src/demo/*.tsx），在 App 里像普通组件一样引用
// =============================================================================

import './App.css'
import { WalletProvider } from './components/WalletProvider'
import { ConnectButton } from './components/ConnectButton'
import { BalanceDisplay } from './demo/BalanceDisplay'
import { SignDemo } from './demo/SignDemo'
import { SendDemo } from './demo/SendDemo'

function App() {
    return (
        // WalletProvider 必须包住所有用到 wagmi hooks 的组件
        <WalletProvider>
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Wallet SDK Demo</h1>

                {/* 默认样式：<ConnectButton /> 使用 types 里的默认值 */}
                <section className="flex w-full max-w-2xl flex-col items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-500">默认样式</h2>
                    <ConnectButton />
                </section>

                {/* 大尺寸完整版：与设计图代码块一致 */}
                <section className="flex w-full max-w-2xl flex-col items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-500">大尺寸完整版</h2>
                    <ConnectButton
                        label="连接钱包"
                        size="lg"
                        showBalance={true}
                        chainStatus="full"
                        accountStatus="full"
                        onConnect={() => console.log('准备连接钱包')}
                    />
                </section>

                {/* 紧凑模式：窄栏、只显示地址、链只显示图标 */}
                <section className="flex w-full max-w-2xl flex-col items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-500">紧凑模式</h2>
                    <ConnectButton
                        size="sm"
                        chainStatus="icon"
                        accountStatus="address"
                        showBalance={false}
                        className="shadow-md"
                    />
                </section>

                {/* 下面三个是 Hook 能力演示，与 ConnectButton 内置余额互不冲突 */}
                <BalanceDisplay />
                <SignDemo />
                <SendDemo />
            </div>
        </WalletProvider>
    )
}

export default App
