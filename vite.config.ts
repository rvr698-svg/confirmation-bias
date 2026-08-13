import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 5173 is taken by another project on this machine.
  server: { port: 5273, strictPort: true },
})
