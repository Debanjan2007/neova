
const languages = ["javascript", "typescript"];
const modules = ["esm", "cjs", "dual"];

export function resolveConfig(input) {
    if (!input.name?.trim()) {
        throw new Error("Package name is required.");
    }

    if (!languages.includes(input.language)) {
        throw new Error(`Unsupported language: ${input.language}`);
    }

    if (!modules.includes(input.module)) {
        throw new Error(`Unsupported module system: ${input.module}`);
    }

    return {
        name: input.name.trim(),
        language: input.language,
        module: input.module,
        isTypeScript: input.language === "typescript",
        formats:
            input.module === "dual"
                ? ["esm", "cjs"]
                : [input.module]
    };
}
