import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';

export default {
    moduleName: 'iiiClient',
    dest: 'dist/bundle.js',
    entry: 'src/index.js',
    format: 'iife',
    plugins: [
        builtins(),
        globals(),
        babel({
            babelrc: false,
            sourceMaps: false,
            comments: false,
            presets: [
                ["es2015", { modules: false }]
            ],
        })
    ]
};