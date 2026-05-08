import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  ...next,
  prettier,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
