import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), envCompatible()],
    server:
      mode === "development"
        ? {
            proxy: {
              "/api": {
                target: env.VITE_API_URL,
                changeOrigin: true,
              },
              "/socket.io": {
                target: env.VITE_API_URL_WEB_SOCKETS,
                changeOrigin: true,
                ws: true,
              },
            },
          }
        : undefined,
  };
});
