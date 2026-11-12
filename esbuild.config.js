const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
function sourceFiles(directory) {
  return fs
    .readdirSync(directory)
    .sort()
    .flatMap(name => {
      const file = path.join(directory, name);
      return fs.statSync(file).isDirectory() ? sourceFiles(file) : [file];
    });
}
const digest = crypto.createHash('sha256');
for (const file of [
  ...sourceFiles('src'),
  ...sourceFiles('config'),
  'verified-offsets-ios.json',
  'esbuild.config.js',
]) {
  digest.update(file);
  digest.update(fs.readFileSync(file));
}
const buildId = digest.digest('hex').slice(0, 12);
const args = process.argv.slice(2);
for (const arg of args) {
  if (arg !== '--device=ios') {
    throw new Error(`Unsupported build option: ${arg}. Target: v70 iOS ARM64.`);
  }
}
esbuild.buildSync({
  entryPoints: ['src/init.ts'],
  bundle: true,
  outfile: 'script.js',
  platform: 'neutral',
  format: 'iife',
  target: 'es2022',
  sourcemap: 'external',
  define: { __OFFLINE_BUILD_ID__: JSON.stringify(buildId) },
});
console.log(`Built script.js (v70 iOS ARM64, build ${buildId})`);
