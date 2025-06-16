import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Components({
      resolvers: [
        PrimeVueResolver(),
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: '/',
  // 设置反向代理实现跨域访问服务端
  server: {
    proxy: {
      // mock服务器
      '/mock': {
        target: 'http://127.0.0.1:4523/m1/6398604-6095377-default',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/mock/, '')
      },
      // 开发服务器
      '/dev': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev/, '')
      }
    }
  },
})
