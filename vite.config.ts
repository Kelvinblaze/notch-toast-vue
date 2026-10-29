import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        module: resolve(__dirname, 'src/module.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entry) =>
        format === 'es' ? `${entry}.mjs` : `${entry}.cjs`,
    },
    rollupOptions: {
      external: ['vue', 'motion-v', '@vueuse/core', 'node:fs', 'nuxt', '@nuxt/kit', '@nuxt/schema'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: false,
  },
})
