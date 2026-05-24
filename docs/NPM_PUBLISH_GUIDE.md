# npm 发布傻瓜式教程（第一次发布必看）

> 本文假设你把本仓库发布成一个 **React 钱包 SDK**，别人通过 `npm install` 安装使用。  
> Demo 页面（`App.tsx`、`src/demo/`）只留在 Git 仓库里本地开发，**不会**打进 npm 包。

---

## 一、发布前：哪些东西会 / 不会进 npm？

### 不会发布（留在仓库里给自己用）

| 路径 | 作用 | 要不要删？ |
|------|------|------------|
| `src/App.tsx` | 本地 Demo 页 | **不用删**，npm 只发 `dist/` |
| `src/main.tsx` | Vite 入口 | 同上 |
| `src/demo/*` | 余额/签名/转账演示 | 同上 |
| `index.html` | Vite HTML | 同上 |
| `docs/` | 设计文档 | 已在 `.npmignore` 排除 |

**结论：不用把 Demo「注释掉」**，只要 `package.json` 的 `files` 只包含 `dist`、`README.md`、`LICENSE`，用户装到的包里就没有 Demo 源码。

### 会发布（用户真正用到的）

| 路径 | 说明 |
|------|------|
| `dist/index.js` / `dist/index.cjs` | 打包后的 SDK |
| `dist/index.d.ts` | TypeScript 类型 |
| `dist/styles.css` | 按钮/弹窗样式（Tailwind 已编译好） |
| `README.md` | 安装说明 |

### 建议检查（可选）

- `App.tsx` 里 `onConnect` 的 `console.log`：仅 Demo，不进 npm，可保留
- 不要在代码里写 **私钥、RPC API Key、密码**
- npm 包名 `wallet-sdk` 很可能已被占用 → 见下文「作用域名」

---

## 二、一次性准备（在本项目里已完成的部分）

仓库里已配置：

```bash
npm run build:lib   # tsup → dist/index.js + 类型
npm run build:css   # Tailwind → dist/styles.css
npm run build       # 上面两个一起跑（发布前必跑）
npm run dev         # 本地 Demo，和发包无关
```

`prepublishOnly` 会在你执行 `npm publish` 前自动执行 `npm run build`。

---

## 三、注册 npm 账号（只需一次）

1. 打开 https://www.npmjs.com/signup  
2. 注册账号，到邮箱里 **点验证链接**  
3. 若要用 **作用域包名**（推荐）如 `@你的用户名/wallet-sdk`，免费账号即可发布 public scoped 包  

---

## 四、改包名（非常重要）

打开 `package.json`，把 `name` 改成 **全球唯一** 的名字，二选一：

**方式 A（推荐）— 作用域包，不容易重名：**

```json
"name": "@你的npm用户名/wallet-sdk"
```

例如 npm 用户名是 `allenzhang`，则：

```json
"name": "@allenzhang/wallet-sdk"
```

**方式 B — 普通包名（容易被占用）：**

```json
"name": "allenzhang-wallet-sdk"
```

同时把 `"private": true` 改成 **`false`**（否则无法发布）。

版本建议第一次用：

```json
"version": "0.1.0"
```

---

## 五、本地登录 npm（每台电脑一次）

### ⚠️ 若浏览器打开的是 `npmmirror.com` / 显示「注册 CNPM」「不允许公开登记」

说明本机 npm 指向了**国内下载镜像**，镜像**不能**注册/登录/发包。先切回官方源：

```bash
npm config get registry
# 若显示 https://registry.npmmirror.com/ 则执行：

npm config set registry https://registry.npmjs.org/
```

然后再 `npm login`。登录成功后，浏览器地址应是 **www.npmjs.com**，不是 npmmirror。

> 国内下载慢时，可只在 `npm install` 时临时加镜像：  
> `npm install 某包 --registry=https://registry.npmmirror.com`  
> **发布必须用官方源**，不要对 `npm publish` 用镜像。

---

在项目根目录打开终端：

```bash
npm login
```

按提示输入：

- Username（npm 用户名）
- Password
- Email
- OTP（若开启了两步验证）

验证是否登录成功：

```bash
npm whoami
```

应显示你的用户名。

---

## 六、本地试打包（不真正上传）

```bash
cd d:\project\wallet-sdk
npm install
npm run build
npm pack
```

会生成类似 `allenzhang-wallet-sdk-0.1.0.tgz` 的文件。

查看包里有什么（可选）：

```bash
tar -tf xxx.tgz
# Windows 可用 7-Zip 打开 .tgz
```

应 **只有** `package/dist/`、`package/README.md`、`package/LICENSE` 等，**没有** `src/demo`。

试装到别的空项目（可选）：

```bash
mkdir C:\temp\test-sdk && cd C:\temp\test-sdk
npm init -y
npm install d:\project\wallet-sdk\你的包名-0.1.0.tgz
```

---

## 七、正式发布（第一次）

1. 确认 `package.json`：`"private": false`，`name` 已改好，`version` 为 `0.1.0`  
2. 确认 Git 已提交（好习惯，非 npm 强制）  
3. 执行：

```bash
npm publish --access public
```

> 若包名是 `@scope/xxx`，**必须**加 `--access public`，否则 scoped 包默认私有（需付费）。

成功后会显示 `+ @xxx/wallet-sdk@0.1.0`。

在浏览器打开：  
`https://www.npmjs.com/package/@你的用户名/wallet-sdk`

---

## 八、在别的项目里使用

```bash
npm install @你的用户名/wallet-sdk
```

```tsx
import { WalletProvider, ConnectButton } from '@你的用户名/wallet-sdk'
import '@你的用户名/wallet-sdk/styles.css'

function App() {
  return (
    <WalletProvider>
      <ConnectButton size="md" />
    </WalletProvider>
  )
}
```

宿主项目还需安装 **peerDependencies**（若 npm 没自动装）：

```bash
npm install react react-dom wagmi viem @tanstack/react-query
```

---

## 九、以后更新版本

1. 改代码  
2. 改 `package.json` 的 `version`（语义化版本）：  
   - 修 bug：`0.1.0` → `0.1.1`  
   - 新功能：`0.1.1` → `0.2.0`  
   - 破坏性改动：`0.2.0` → `1.0.0`  
3. 再执行：

```bash
npm run build
npm publish --access public
```

---

## 十、常见问题

| 问题 | 处理 |
|------|------|
| `402 Payment Required` / 私有包 | 加 `--access public` |
| `403` 包名被占用 | 换 `name` |
| `403` **Two-factor authentication... required to publish** | 见下方 **§10.1**（必须开 2FA） |
| `You must verify your email` | 去邮箱点验证 |
| 样式不生效 | 宿主项目 `import '包名/styles.css'` |
| 类型找不到 | 确认 `dist/index.d.ts` 存在，重新 `npm run build` |

### 10.1 发布报 403：必须开启两步验证（2FA）

完整报错类似：

```text
403 Forbidden - Two-factor authentication or granular access token
with bypass 2fa enabled is required to publish packages.
```

**原因：** npm 规定：凡发布包，账号必须开启 **2FA（双因素认证）**，不能跳过。

**解决步骤（推荐，约 3 分钟）：**

1. 浏览器登录 https://www.npmjs.com  
2. 右上角头像 → **Account** → 左侧 **Two-Factor Authentication**  
   或直接打开：https://www.npmjs.com/settings/~/tfa  
3. 选择 **Authorization and publishing**（授权和发布都要验证码）  
   - 不要选仅 “Authorization only”，否则发布仍可能失败  
4. 用手机装 **Google Authenticator**、**Microsoft Authenticator** 或微信/Google 能扫的 TOTP 应用  
5. 扫页面二维码，输入 App 里 6 位动态码，保存 **recovery codes**（恢复码务必存好）  
6. 在本机重新登录 npm：

   ```bash
   npm logout
   npm login
   ```

7. 再发布（会要求输入一次 6 位验证码 OTP）：

   ```bash
   npm publish --access public
   ```

   若终端没提示 OTP，可先：

   ```bash
   npm profile enable-2fa auth-and-writes
   ```

   或发布前设置（仅当次终端会话）：

   ```bash
   # PowerShell
   $env:NPM_CONFIG_OTP = "123456"   # 换成 Authenticator 当前 6 位数
   npm publish --access public
   ```

**备选：Granular Access Token（适合 CI，本机也可用）**

1. https://www.npmjs.com/settings/~/tokens → **Generate New Token** → **Granular Access Token**  
2. Packages：**Read and write**；Scope 选你的 `@allen_chai`  
3. 若页面有 **“Bypass 2FA for automation”** 可勾选（按 npm 当前政策）  
4. 复制 token，**不要提交到 Git**  
5. 用户目录 `C:\Users\Allen\.npmrc` 增加一行（把 token 换成你的）：

   ```ini
   //registry.npmjs.org/:_authToken=npm_xxxxxxxx
   ```

6. 再执行 `npm publish --access public`

---

## 十一、发布检查清单（打印对照）

- [ ] `npm whoami` 能显示用户名  
- [ ] `package.json` 的 `name` 唯一且 `private: false`  
- [ ] `npm run build` 无报错  
- [ ] `npm pack` 里无 `src/demo`  
- [ ] README 安装示例里的包名已改成你的  
- [ ] `npm publish --access public` 成功  
- [ ] 新仓库 `npm install` 能装上并用  

祝你第一次发布顺利。
