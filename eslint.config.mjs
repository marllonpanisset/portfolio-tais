import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Next.js 16 ships these presets as native Flat Config arrays. Importing them
 * directly avoids FlatCompat, which is only for legacy eslintrc presets and
 * cannot safely translate the plugins already registered by ESLint 9.
 */
const eslintConfig = [...nextCoreWebVitals, ...nextTypeScript];

export default eslintConfig;
