import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"], // ESM output
  target: "node22",
  outDir: "api",
  sourcemap: true,
  clean: true,
  bundle: true,
  splitting: false,

  //* Externalize all node_modules + Prisma
  external: [
    "express",
    "@prisma/client",
    "cors",
    "cookie-parser",
    "compression",
    "dotenv",
    "helmet",
    "hpp",
    "morgan",
    "events",
    "path",
    "fs",
    "url",
    "better-auth",
  ],

  outExtension({ format }) {
    if (format === "esm") return { js: ".js" };
    return {};
  },
});
