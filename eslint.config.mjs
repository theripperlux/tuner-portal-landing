import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Legacy / Phase 1 out of scope ignores:
    "*.js",
    "src/lib/forms/**",
    "src/lib/roi/**",
    "src/lib/validation/**",
    "src/lib/mdx.ts",
    "src/types/content.ts",
    "src/types/modules.ts",
    "src/utils/statusFilter.ts",

    // Frontend / UI Components are explicitly excluded from Phase 1.2 Backend Hardening
    "src/components/**",
    "src/app/**",
    "src/config/**",
    "src/i18n/**",
    "src/i18n.ts",
    "src/lib/api/**",
    "src/lib/auth.ts",
    "src/lib/auth/__tests__/**",
    "scripts/**",
    "migration_tester.ts"
  ]),
]);

export default eslintConfig;
