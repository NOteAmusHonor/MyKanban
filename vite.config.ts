import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library-Mode wenn BUILD=library
  const isLibrary = process.env.BUILD === 'library'

  if (isLibrary) {
    return defineConfig({
      plugins: [vue()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'MyKanban',
          formats: ['es', 'umd'],
          fileName: (format) => `mykanban.${format === 'es' ? 'js' : 'umd.cjs'}`,
        },
        rollupOptions: {
          // Vue, Pinia, etc. als externe Dependencies
          external: ['vue', 'pinia', 'vue-router'],
          output: {
            globals: {
              vue: 'Vue',
              pinia: 'Pinia',
              'vue-router': 'VueRouter',
            },
          },
        },
        sourcemap: true,
      },
    })
  }

  // Normale App-Config
  return defineConfig({
    plugins: [vue(), vueDevTools()],
    define: {
      __PROJECT_NAME__: JSON.stringify(pkg.name ?? ''),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        // In dev: proxy API calls to the standalone Express server
        '/api': {
          target: 'http://localhost:3737',
          changeOrigin: true,
        },
      },
    },
  })
})
