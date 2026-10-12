import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/script.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
});