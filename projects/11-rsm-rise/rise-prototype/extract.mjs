import {readFileSync, writeFileSync} from 'node:fs';
const root = new URL('./', import.meta.url);
const original = readFileSync(new URL('original.html', root), 'utf8');
const css = original.match(/<style>([\s\S]*?)<\/style>/)[1];
const js = original.match(/<script>([\s\S]*?)<\/script>/)[1];
const open = '\n(function(){\n';
const close = '})();\n';
if (!js.startsWith(open) || !js.endsWith(close)) throw Error('Unexpected original wrapper');
const body = js.slice(open.length, -close.length);
const split = body.indexOf('  var ES=');
if (split < 0) throw Error('Dictionary not found');
// Two classic scripts share the original lexical scope. Station documents isolate
// that scope from the exhibition shell. The source statements remain byte-exact.
writeFileSync(new URL('styles.css', root), css);
writeFileSync(new URL('app.js', root), body.slice(0, split));
writeFileSync(new URL('i18n.js', root), body.slice(split));
const html = original.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="./styles.css">')
  .replace(/<script>[\s\S]*?<\/script>/, '<script src="./app.js"></script>\n<script src="./i18n.js"></script>');
writeFileSync(new URL('index.html', root), html);
console.log('Extracted original statements and CSS without edits.');
