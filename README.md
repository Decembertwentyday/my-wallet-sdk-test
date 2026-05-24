# @allen_chai/wallet-sdk

React Web3 钱包 SDK：连接按钮、多链切换、EIP-6963 钱包列表、余额展示。

> 在其他项目里接入：**[docs/USAGE_IN_OTHER_PROJECT.md](./docs/USAGE_IN_OTHER_PROJECT.md)**（逐步教程）  
> 发布说明：[docs/NPM_PUBLISH_GUIDE.md](./docs/NPM_PUBLISH_GUIDE.md)

## 安装

```bash
npm install @allen_chai/wallet-sdk react react-dom wagmi viem @tanstack/react-query
```

## 快速使用

```tsx
import { WalletProvider, ConnectButton } from '@allen_chai/wallet-sdk'
import '@allen_chai/wallet-sdk/styles.css'

export function App() {
    return (
        <WalletProvider>
            <ConnectButton size="md" />
        </WalletProvider>
    )
}
```

### `size` 三种样式

| size | 说明 |
|------|------|
| `md` | 默认（可省略） |
| `lg` | 大尺寸 |
| `sm` | 紧凑：链仅图标、仅地址、不显示余额 |

## 导出 API

| 导出 | 说明 |
|------|------|
| `WalletProvider` | 必须包裹应用 |
| `ConnectButton` | 连接 / 已连接 UI |
| `ChainSelector` | 链切换（也可单独用） |
| `useWalletBalance` | 当前链余额 |
| `useWalletSignMessage` | 签名 |
| `useWalletSendTransaction` | 发交易 |
| `config`, `DEFAULT_CHAIN_ID` | 高级：自定义 wagmi |

## 本地开发本仓库（维护 SDK 的人）

```bash
npm install
npm run dev          # Demo 页面（App.tsx + src/demo/）
npm run build        # 打 npm 包用的 dist/
npm run build:demo   # 打 Vite 静态站（可选）
```

## 文档

- **在其他项目使用**：[docs/USAGE_IN_OTHER_PROJECT.md](./docs/USAGE_IN_OTHER_PROJECT.md)
- 架构与设计：[docs/WALLET_SDK_DESIGN.md](./docs/WALLET_SDK_DESIGN.md)
- 发布步骤：[docs/NPM_PUBLISH_GUIDE.md](./docs/NPM_PUBLISH_GUIDE.md)

## License

MIT
