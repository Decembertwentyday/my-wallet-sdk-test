# 在其他项目里使用 @allen_chai/wallet-sdk

从零新建一个 React 项目并接入钱包按钮的完整步骤。

---

## 前提

- 已安装 Node.js 18+（你当前是 v20 即可）
- 浏览器已安装 **MetaMask**（或其它 Web3 钱包扩展）
- SDK 已发布到 npm：`@allen_chai/wallet-sdk`（在 https://www.npmjs.com/package/@allen_chai/wallet-sdk 能搜到）

安装包时请用 **官方源**（不要用 npmmirror 装 scoped 包，容易异常）：

```bash
npm config get registry
# 应为 https://registry.npmjs.org/
# 若不是：npm config set registry https://registry.npmjs.org/
```

---

## 方式 A：新建一个测试项目（推荐第一次试）

### 第 1 步：创建 Vite + React + TS 项目

```powershell
cd D:\project
npm create vite@latest my-wallet-test -- --template react-ts
cd my-wallet-test
npm install
```

### 第 2 步：安装 SDK 和 peer 依赖

```powershell
npm install @allen_chai/wallet-sdk react react-dom wagmi viem @tanstack/react-query
```

（`react` 创建项目时已有，再装一遍也没问题，保证版本满足 peer。）

### 第 3 步：改 `src/App.tsx`

整文件替换为：

```tsx
import { WalletProvider, ConnectButton } from '@allen_chai/wallet-sdk'
import '@allen_chai/wallet-sdk/styles.css'

function App() {
  return (
    <WalletProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 }}>
        <h1>我的 DApp</h1>

        {/* size: md 默认 | lg 大 | sm 紧凑 */}
        <ConnectButton size="md" label="连接钱包" />
      </div>
    </WalletProvider>
  )
}

export default App
```

### 第 4 步：启动

```powershell
npm run dev
```

浏览器打开终端里给的地址（一般是 `http://localhost:5173`）。

### 第 5 步：在页面上验证

1. 点 **连接钱包** → 弹出钱包列表  
2. 选 **MetaMask** → 在扩展里点 **连接**  
3. 连接成功后应看到：**链名 + 缩短地址 + 余额 + 断开按钮**  
4. 点链名区域可 **切换 Sepolia / Mainnet**（默认连 Sepolia 测试网）  
5. 点地址可复制；点红色图标断开  

---

## 方式 B：接到你已有的 React 项目

### 第 1 步：安装依赖

在项目根目录：

```powershell
npm install @allen_chai/wallet-sdk wagmi viem @tanstack/react-query
```

若还没有 React 18+：

```powershell
npm install react react-dom
```

### 第 2 步：用 Provider 包住应用

**Vite（`main.tsx`）示例：**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from '@allen_chai/wallet-sdk'
import '@allen_chai/wallet-sdk/styles.css'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </StrictMode>,
)
```

**Next.js App Router** 需在 Client Component 里包一层（`'use client'`），例如 `providers.tsx`：

```tsx
'use client'

import { WalletProvider } from '@allen_chai/wallet-sdk'
import '@allen_chai/wallet-sdk/styles.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
```

再在 `layout.tsx` 里包 `<Providers>`。

### 第 3 步：在任意页面放按钮

```tsx
import { ConnectButton } from '@allen_chai/wallet-sdk'

export function Header() {
  return (
    <header>
      <ConnectButton size="sm" />
    </header>
  )
}
```

**注意：** 使用 `useWalletBalance` 等 hooks 的组件，必须在 `WalletProvider` **里面**。

---

## ConnectButton 常用写法

```tsx
// 默认中等样式
<ConnectButton />

// 大尺寸（导航栏醒目）
<ConnectButton size="lg" />

// 紧凑（页头右侧）
<ConnectButton size="sm" />

// 自定义未连接文案 + 点击回调
<ConnectButton
  size="md"
  label="连接 Web3 钱包"
  onConnect={() => console.log('用户点了连接')}
/>
```

| size | 未连接 | 已连接 |
|------|--------|--------|
| `md` | 中等蓝按钮 | 链名 + 地址 + 余额 |
| `lg` | 更大按钮 | 同 md |
| `sm` | 小按钮 | 链仅图标、仅地址、无余额 |

---

## 使用 Hooks（余额 / 签名 / 转账）

组件必须在 `WalletProvider` 内：

```tsx
import { useWalletBalance, useWalletSignMessage } from '@allen_chai/wallet-sdk'
import { useAccount } from 'wagmi'

function MyPanel() {
  const { isConnected } = useAccount()
  const { balance, symbol, isLoading } = useWalletBalance()
  const { signMessage, isPending } = useWalletSignMessage()

  if (!isConnected) return <p>请先连接钱包</p>

  return (
    <div>
      <p>余额：{isLoading ? '加载中…' : `${balance} ${symbol}`}</p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => signMessage('Hello from my dapp')}
      >
        签名
      </button>
    </div>
  )
}
```

---

## 方式 C：还没发布 npm，用本地包试装

在 **wallet-sdk 仓库**里：

```powershell
cd D:\project\wallet-sdk
npm run build
npm pack
```

会生成 `allen_chai-wallet-sdk-0.1.0.tgz`（文件名以实际为准）。

在 **测试项目**里：

```powershell
npm install D:\project\wallet-sdk\allen_chai-wallet-sdk-0.1.0.tgz
```

其余步骤与方式 A 相同。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 按钮没样式、很丑 | 是否写了 `import '@allen_chai/wallet-sdk/styles.css'` |
| `useWalletBalance must be used within WagmiProvider` | 外层缺 `<WalletProvider>` |
| 装不上 `@allen_chai/wallet-sdk` | `npm config set registry https://registry.npmjs.org/` |
| 余额显示失败 | 钱包切到 Sepolia；或检查网络；公共 RPC 可能限流 |
| 连接后没弹 MetaMask | 确认扩展已启用、站点未被拒绝连接 |
| Next.js 报错 window is not defined | Provider、ConnectButton 放 `'use client'` 组件里 |

---

## 最小检查清单

- [ ] `npm install @allen_chai/wallet-sdk` 成功  
- [ ] 全局引入了 `styles.css`  
- [ ] 根组件包了 `<WalletProvider>`  
- [ ] 页面里有 `<ConnectButton />`  
- [ ] `npm run dev` 能打开页面并连上钱包  
