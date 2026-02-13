import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const plugins: Array<any> = [react()];

  return {
    define: {
      __ADMIN_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    server: {
      host: "::",
      port: 5174,
      fs: {
        // Allow convex generated, node_modules, and this project directory
        allow: [
          path.resolve(__dirname),
          path.resolve(__dirname, "../convex/_generated"),
          path.resolve(__dirname, "node_modules"),
        ],
      },
    },
    plugins,
    define: {
      __ADMIN_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        convex_generated: path.resolve(__dirname, "../convex/_generated"),
      },
    },
  };
});
