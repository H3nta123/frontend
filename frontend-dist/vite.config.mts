// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          pinia: ['defineStore', 'storeToRefs'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://31dd2928-f665-4aba-9ad7-69622142e81b.tunnel4.com/',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const host = req.headers.host
            if (host) {
              const parts = host.split('.')
              // Извлекаем всё, что до первой точки
              const sub = parts[0]
              if (parts.length >= 2 && sub !== 'localhost' && sub !== '127') {
                console.log(`[Vite Proxy API] Host: ${host} -> X-Subdomain: ${sub}`)
                proxyReq.setHeader('X-Subdomain', sub)
              } else {
                console.log(`[Vite Proxy API] Host: ${host} -> No subdomain detected`)
              }
              const backendHost = host.replace(':3000', ':8080')
              proxyReq.setHeader('X-Forwarded-Host', backendHost)
            }
          })
        },
      },
      '/site-config': {
        target: 'http://31dd2928-f665-4aba-9ad7-69622142e81b.tunnel4.com/',
        changeOrigin: true,
        secure: false,
        // Убрали rewrite: '/', так как это могло ломать путь к эндпоинту
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const host = req.headers.host
            if (host) {
              const parts = host.split('.')
              const sub = parts[0]
              if (parts.length >= 2 && sub !== 'localhost' && sub !== '127') {
                console.log(`[Vite Proxy SiteConfig] Host: ${host} -> X-Subdomain: ${sub}`)
                proxyReq.setHeader('X-Subdomain', sub)
              } else {
                console.log(`[Vite Proxy SiteConfig] Host: ${host} -> No subdomain detected`)
              }
              const backendHost = host.replace(':3000', ':8080')
              proxyReq.setHeader('X-Forwarded-Host', backendHost)
            }
          })
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy Error]', err)
          })
        },
      },
    }
  }
})
