import path from 'path';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import tsPlugin from 'rollup-plugin-typescript2';

const pkgDir = path.resolve(__dirname, 'packages');
const targetDir = path.resolve(pkgDir, process.env.TARGET);
const resolveFn = (target) => path.resolve(targetDir, target);

const pkgJson = require(resolveFn('package.json'));
const name = path.basename(targetDir);

const outputConfig = {
  "esm-bundler": {
    file: resolveFn(`dist/${name}.esm-bundler.js`),
    format: "es"
  },
  "cjs": {
    file: resolveFn(`dist/${name}.cjs.js`),
    format: "cjs"
  },
  "global": {
    file: resolveFn(`dist/${name}.global.js`),
    format: 'iife' 
  }
}

const options = pkgJson.buildOptions;
function createConfig(format, output) {
  output.name = options.name;
  output.sourcemap = true;

  // 生成rollup配置
  return {
    input: resolveFn('src/index.ts'),
    output,
    plugins: [
      json(),
      tsPlugin({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      nodeResolve()
    ]
  }
}

export default options?.formats?.map(format => createConfig(format, outputConfig[format]));