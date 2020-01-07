import builtins from "rollup-plugin-node-builtins";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: {
        file: "build/bundle.js",
        format: "cjs", // just for the namedExports hack
        intro: "const global = window;",
        
    },
    // only for final build. demo page does need these modules, so I guess this file should observe some kind of build mode.
    external: ['@polymer/polymer','lit-html','@polymer/decorators','n3','jsonld'],
    plugins: [
        builtins(),
        resolve({
            extensions: [".js", ".ts"],
            browser: true,
            only: ['streamed-graph']
        }),
        typescript(),
        commonjs({
            namedExports: {
                'jsonld': ['expand'], // fixes "expand is not exported by node_modules/jsonld/lib/index.js"
            }
        }),
      
    ]
};
