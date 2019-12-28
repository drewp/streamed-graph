import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import builtins from "rollup-plugin-node-builtins";

export default {
  input: "src/index.ts",
  output: {
    file: "build/bundle.js",
    format: "esm",
    intro: "const global = window;"
  },
  plugins: [
    builtins(),
    resolve({
      extensions: [".js", ".ts"],
      browser: true
    }),
    typescript()
  ]
};
