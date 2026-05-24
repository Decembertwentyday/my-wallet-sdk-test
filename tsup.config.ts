import { defineConfig } from 'tsup'

/** 打包 SDK 本体：入口 src/index.ts，产物在 dist/（不含 Demo） */
export default defineConfig({
    entry: ['src/index.ts'],
    tsconfig: 'tsconfig.build.json',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'wagmi',
        'viem',
        '@tanstack/react-query',
    ],
})
