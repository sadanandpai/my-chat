import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

const ollamaProxy = {
  "/ollama": {
    target: "http://127.0.0.1:11434",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/ollama/, ""),
  },
};

// https://vite.dev/config/
export default defineConfig({
  base: "/character-chat/",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: { proxy: ollamaProxy },
  preview: { proxy: ollamaProxy },
});
