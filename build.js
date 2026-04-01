const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const minify = args.includes('--minify');
const filteredArgs = args.filter(a => a !== '--minify');

const EXTERNAL_MODULES = ['crypto-js'];

async function buildProvider(name) {
  const srcDir = path.join(__dirname, 'src', name);
  const outFile = path.join(__dirname, 'providers', `${name}.js`);

  if (!fs.existsSync(srcDir)) {
    console.error(`[build] No se encontró src/${name}/`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(__dirname, 'providers'), { recursive: true });

  console.log(`[build] Building ${name}...`);

  const result = await esbuild.build({
    entryPoints: [path.join(srcDir, 'index.js')],
    bundle: true,
    outfile: outFile,
    platform: 'node',
    format: 'cjs',
    target: ['es2016'],
    minify,
    external: EXTERNAL_MODULES,
    logLevel: 'warning',
  });

  const stats = fs.statSync(outFile);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`[build] ✓ ${outFile} (${sizeKB} KB)`);
}

async function main() {
  const providerNames = filteredArgs.length > 0 ? filteredArgs : ['lamovie', 'cinecalidad','embed69','zoowomaniacos','xupalace','seriesmetro'];

  for (const name of providerNames) {
    await buildProvider(name);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
