/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import type { UserConfig as VitestUserConfig } from "vitest/config";
import { configDefaults } from "vitest/config";

const vitestConfig: VitestUserConfig = {
  test: {
    ...configDefaults,
    experimentalVmThreads: true,
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.interface.ts"],
      all: true,
      reporter: ["text", "json-summary", "json", "html"],
      lines: 80,
      branches: 80,
      statements: 80,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
    legacy(),
  ],
  // test: vitestConfig.test,
});
