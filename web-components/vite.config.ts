import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({mode})=> {
  const processEnvValues = {
    'process.env': {version: process.env.npm_package_version}
  }
  return {    
    define: processEnvValues,
    plugins: [vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith('ve-')
          }
        }
      }
    }
    )],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    
    build: {
      rollupOptions: {
        input: {
          index: './index.html',
        },
        output: {
          dir: 'dist',
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name?.split('.').at(1)
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) extType = 'img';
            return `${extType}/[name][extname]`;
          },
          entryFileNames: `js/[name].js`,
          chunkFileNames: 'js/[name]-[hash].js'
        }
      }
    }
  }
})
