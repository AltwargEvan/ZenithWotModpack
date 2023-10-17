import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import pages from "vite-plugin-pages";
import { defineConfig } from "vite";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [tsconfigPaths(), react(), pages({ dirs: "./src/pages" })],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  // resolve: {
  //   alias: {
  //     react: path.resolve(__dirname, "./node_modules/@types/react"),
  //   },
  // },
}));
