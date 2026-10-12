import * as p from "@clack/prompts";
import { generatePackage } from "./generator.js";
async function main() {
    p.intro("Neova — npm package scaffolding");
    const name = await p.text({
        message: "What is your package name?",
        placeholder: "my-awesome-package",
        validate(value) {
            if (!value?.trim()) return "Package name is required.";
        }
    });
    if (p.isCancel(name)) {
        p.cancel("Generation cancelled.");
        process.exitCode = 1;
        return;
    }
    const language = await p.select({
        message: "Choose your language",
        options: [
            { value: "javascript", label: "JavaScript" },
            { value: "typescript", label: "TypeScript" }
        ]
    });
    if (p.isCancel(language)) {
        p.cancel("Generation cancelled.");
        process.exitCode = 1;
        return;
    }
    const module = await p.select({
        message: "Choose your module system",
        options: [
            { value: "esm", label: "ESM" },
            { value: "cjs", label: "CommonJS" },
            { value: "dual", label: "Dual (ESM + CJS)" }
        ]
    });
    if (p.isCancel(module)) {
        p.cancel("Generation cancelled.");
        process.exitCode = 1;
        return;
    }
    try {
        const target = await generatePackage({
            name,
            language,
            module
        });
        p.log.success(`Package created at ${target}`);
        p.outro("Next: install dependencies and build your package.");
    } catch (error) {
        p.log.error(error.message);
        process.exitCode = 1;
    }
}
main();