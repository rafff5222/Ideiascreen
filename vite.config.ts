import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext', // Remove eval() em produção
  },
  server: {
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'; worker-src 'self' blob:"
    }
  }
})
export default defineConfig({
  build: {
    target: 'esnext',       // Elimina eval() em produção
    sourcemap: false        // Melhora segurança
  },
  server: {
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval'"
    }
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Configurações de segurança
  build: {
    target: 'esnext',          // Elimina eval() em produção
    minify: 'terser',          // Ofuscação do código
    sourcemap: false,          // Remove mapas para produção
    chunkSizeWarningLimit: 1000 // Ajuste para projetos grandes
  },

  // Configurações do servidor de desenvolvimento
  server: {
    headers: {
      "Content-Security-Policy": 
        "default-src 'none'; " +
        "script-src 'self' 'unsafe-eval'; " + // Permite Vite em dev
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; " +
        "connect-src 'self'; " +
        "worker-src 'self' blob:"
    },
    port: 3000,                // Porta fixa para evitar conflitos
    strictPort: true           // Impede fallback para outras portas
  },

  // Otimizações adicionais
  esbuild: {
    legalComments: 'none'      // Remove comentários de licença
  }
});
# Execute localmente para testar:
rm -rf node_modules && npm install
npm run build
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {} // ⚠️ Desativa o CSP temporariamente
  },
  build: {
    target: 'esnext'
  }
});
# Execute localmente para testar:
rm -rf node_modules .svelte-kit package-lock.json
npm install
npm run build
// vite.config.ts
export default defineConfig({
  server: {
    headers: {} // Desativa CSP para emergências
  }
})
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy": 
        "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://*.vercel.app https://*.vercel-insights.com; " +
        "connect-src 'self' https://*.vercel.app; " +
        "worker-src 'self' blob:; " +
        "default-src 'self'"
    }
  },
  build: {
    target: 'esnext' // Elimina eval() desnecessários em produção
  }
})
export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy": 
        "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://*.vercel.app https://*.vercel-insights.com; " +
        "connect-src 'self' https:; " +
        "style-src 'self' 'unsafe-inline'; " +
        "worker-src 'self' blob:; " +
        "frame-src 'none'"
    }
  }
})
