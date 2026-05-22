// =============================================================================
// 应用入口 — 只做 React 挂载，不含钱包逻辑
// =============================================================================
// StrictMode 下开发环境 effect 可能执行两次，自动重连已用 useRef 防重复补连
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
