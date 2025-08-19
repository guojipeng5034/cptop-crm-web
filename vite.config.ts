import {resolve} from 'path'
import type {ConfigEnv, UserConfig} from 'vite'
import {loadEnv} from 'vite'
import {createVitePlugins} from './build/vite'
import pkg from './package.json' // Add this import
import {exclude, include} from "./build/vite/optimize"

import fs from 'fs'
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()
// 模块大小缓存（提升构建性能）
const moduleSizeCache = new Map<string, number>()

// 路径查找
function pathResolve(dir: string) {
    return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default ({command, mode}: ConfigEnv): UserConfig => {
    let env = {} as any
    const isBuild = command === 'build'
    if (!isBuild) {
        env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
    } else {
        env = loadEnv(mode, root)
    }
    return {
        define: {
          'process.env.VITE_APP_VERSION': JSON.stringify(pkg.version), // Add this for older convention if needed
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version) // Standard Vite way
        },
        base: env.VITE_BASE_PATH,
        root: root,
        // 服务端渲染
        server: {
            port: env.VITE_PORT, // 端口号
            host: "0.0.0.0",
            open: env.VITE_OPEN === 'true',
            // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
            // proxy: {
            //   ['/admin-api']: {
            //     target: env.VITE_BASE_URL,
            //     ws: false,
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(new RegExp(`^/admin-api`), ''),
            //   },
            // },
        },
        // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
        plugins: createVitePlugins(env,isBuild),
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/styles/variables.scss" as *;',
                    javascriptEnabled: true,
                    silenceDeprecations: ["legacy-js-api"],
                }
            }
        },
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
            alias: [
                // {
                //     find: 'vue-i18n',
                //     replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
                // },
                {
                    find: /\@\//,
                    replacement: `${pathResolve('src')}/`
                }
            ]
        },
      build: {
        assetsInlineLimit: 1024 * 10,
        chunkSizeWarningLimit: 1000, // 将警告阈值设置为 1000 KB
        minify: 'esbuild', // 比terser更快
        cssMinify: 'esbuild', // Vite 4.0+支持
        manifest: false,
        ssrManifest: false,
        cssCodeSplit: true, // CSS 代码分割
        reportCompressedSize: false, // 关闭压缩大小报告（减少计算）
        outDir: env.VITE_OUT_DIR || 'dist',
        sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
        // brotliSize: false,
        terserOptions: {
          compress: {
            drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
            drop_console: env.VITE_DROP_CONSOLE === 'true'
          }
        },
        rollupOptions: {
          treeshake: true, // 开启 Tree Shaking，消除未使用的代码，减小最终的包大小
          output: {
            // 使用导入的 manualChunks 函数
            // 自定义 chunks 输出配置
            chunkFileNames: 'assets/js/[name].[hash].js',
            entryFileNames: 'assets/js/[name].[hash].js',
            assetFileNames: (assetInfo:any) => {
              // 文件名称
              if (assetInfo.name.endsWith('.css')) {
                return 'assets/css/[name]-[hash].css'
              }
              // 图片名称
              const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico']
              if (imgExts.some(ext => assetInfo.name.endsWith(ext))) {
                return 'assets/img/[name]-[hash][extname]'
              }
              // 其他文件
              return 'assets/static/[name]-[hash][extname]'
            }
          },
        },
      },
      optimizeDeps: { include, exclude }
    }
}

