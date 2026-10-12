
import fs from "node:fs/promises";
import path from "node:path";
import { resolveConfig } from "./config.js";

function createPackageJson(config) {
    const { name, module, isTypeScript } = config;
    const isDual = module === "dual";
    const isCjs = module === "cjs";

    const output = isCjs ? "index.js" : "index.js";
    const cjsOutput = "index.cjs";

    const pkg = {
        name,
        version: "1.0.0",
        description: "",
        license: "MIT",
        type: isCjs ? "commonjs" : "module",
        main: isDual || isCjs
            ? `./dist/${isDual ? cjsOutput : output}`
            : "./dist/index.js",
        module: "./dist/index.js",
        exports: {
            ".": isDual
                ? {
                    import: {
                        types: "./dist/index.d.ts",
                        default: "./dist/index.js"
                    },
                    require: {
                        types: "./dist/index.d.cts",
                        default: "./dist/index.cjs"
                    }
                }
                : isCjs
                    ? {
                        types: isTypeScript
                            ? "./dist/index.d.ts"
                            : undefined,
                        require: "./dist/index.js",
                        default: "./dist/index.js"
                    }
                    : {
                        types: isTypeScript
                            ? "./dist/index.d.ts"
                            : undefined,
                        import: "./dist/index.js",
                        default: "./dist/index.js"
                    }
        },
        files: ["dist"],
        scripts: {
            build: "tsup",
            dev: "tsup --watch",
            prepublishOnly: "npm run build"
        },
        devDependencies: {
            tsup: "^8.5.1",
            ...(isTypeScript ? { typescript: "^5.0.0" } : {})
        }
    };

    // Remove optional properties that have no value.
    function clean(value) {
        if (Array.isArray(value)) {
            return value.map(clean);
        }

        if (value && typeof value === "object") {
            return Object.fromEntries(
                Object.entries(value)
                    .filter(([, child]) => child !== undefined)
                    .map(([key, child]) => [key, clean(child)])
            );
        }

        return value;
    }

    return clean(pkg);
}

function createTsupConfig(config) {
    const { formats, isTypeScript } = config;

    return `
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.${isTypeScript ? "ts" : "js"}"],
  format: ${JSON.stringify(formats)},
  outDir: "dist",
  clean: true,
  dts: ${isTypeScript},
  splitting: false,
  sourcemap: true,
  ${config.module === "dual"
            ? `outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },`
            : ""
        }
});
`.trimStart();
}

export async function generatePackage(input, destination = process.cwd()) {
    const config = resolveConfig(input);
    const target = path.resolve(destination, config.name);

    // Refuse to overwrite an existing directory.
    try {
        await fs.access(target);
        throw new Error(`Destination already exists: ${target}`);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    await fs.mkdir(path.join(target, "src"), {
        recursive: true
    });

    const extension = config.isTypeScript ? "ts" : "js";

    const source = `
export function hello(name${config.isTypeScript ? ": string" : ""} = "world") {
  return \`Hello, \${name}!\`;
}
`.trimStart();

    await Promise.all([
        fs.writeFile(
            path.join(target, "package.json"),
            JSON.stringify(createPackageJson(config), null, 2) + "\n"
        ),
        fs.writeFile(
            path.join(target, "src", `index.${extension}`),
            source
        ),
        fs.writeFile(
            path.join(target, "tsup.config.mjs"),
            createTsupConfig(config)
        ),
        fs.writeFile(
            path.join(target, ".gitignore"),
            "node_modules/\ndist/\n.env\n"
        )
    ]);

    if (config.isTypeScript) {
        await fs.writeFile(
            path.join(target, "tsconfig.json"),
            JSON.stringify({
                compilerOptions: {
                    target: "ES2022",
                    module: "NodeNext",
                    moduleResolution: "NodeNext",
                    strict: true,
                    declaration: true,
                    skipLibCheck: true
                },
                include: ["src"]
            }, null, 2) + "\n"
        );
    }

    return target;
}
