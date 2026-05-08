import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  ...next,
  prettier,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
