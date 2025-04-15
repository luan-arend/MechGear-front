import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
  },
  plugins: [
    react(), // Adiciona o plugin React
    // Adicione outros plugins aqui, se necessário
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Atalho para o diretório src
    },
  },
}));
