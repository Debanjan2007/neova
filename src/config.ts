
const languages = ["javascript", "typescript"] as const;
const modules = ["esm", "cjs", "dual"] as const;

type Language = (typeof languages)[number];
type ModuleSystem = (typeof modules)[number];
type ModuleFormat = "esm" | "cjs";

interface ConfigInput {
    name: string;
    language: Language;
    module: ModuleSystem;
}

interface ResolvedConfig extends ConfigInput {
    isTypeScript: boolean;
    formats: ModuleFormat[];
}

export function resolveConfig(input: ConfigInput): ResolvedConfig {
    if (!input.name?.trim()) {
        throw new Error("Package name is required.");
    }

    if (!languages.includes(input.language)) {
        throw new Error(`Unsupported language: ${input.language}`);
    }

    if (!modules.includes(input.module)) {
        throw new Error(`Unsupported module system: ${input.module}`);
    }

    const formats: ModuleFormat[] =
        input.module === "dual"
            ? ["esm", "cjs"]
            : [input.module];

    return {
        name: input.name.trim(),
        language: input.language,
        module: input.module,
        isTypeScript: input.language === "typescript",
        formats
    };
}
