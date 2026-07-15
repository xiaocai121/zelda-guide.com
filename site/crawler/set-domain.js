#!/usr/bin/env node
/**
 * 一键替换占位域名（非开发者友好，全站递归版）
 * 用法：node crawler/set-domain.js https://你的域名
 * 作用：把 site/ 下所有文本文件里的 https://zelda-guide.com 换成真实域名
 *       （含攻略页、生成器里的默认域名常量等，避免以后再漏）
 * 注意：只处理文本文件，自动跳过 png/jpg/svg 等二进制，安全。
 */
const fs = require('fs');
const path = require('path');

const domain = process.argv[2];
if (!domain || !/^https?:\/\//.test(domain)) {
  console.error('用法: node crawler/set-domain.js https://你的域名');
  process.exit(1);
}
const base = domain.replace(/\/+$/, ''); // 去掉末尾斜杠
const PLACEHOLDER = 'https://zelda-guide.com';

// 仅处理的文本扩展名（避免误改二进制）
const TEXT_EXT = new Set([
  '.html', '.htm', '.xml', '.txt', '.md', '.css', '.js', '.json',
  '.yml', '.yaml', '.svg', '.csv', '.ts', '.tsx', '.vue'
]);
// 明确跳过的二进制
const SKIP_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.bmp',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.mov', '.mp3', '.pdf', '.zip'
]);

const SITE = path.join(__dirname, '..');

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.workbuddy' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) { walk(full, out); continue; }
    const ext = path.extname(name).toLowerCase();
    if (SKIP_EXT.has(ext)) continue;
    if (!TEXT_EXT.has(ext)) continue;
    out.push(full);
  }
  return out;
}

const files = walk(SITE, []);
let total = 0, touched = 0;
for (const p of files) {
  let s;
  try { s = fs.readFileSync(p, 'utf8'); } catch { continue; }
  const n = s.split(PLACEHOLDER).length - 1;
  if (n === 0) continue;
  s = s.split(PLACEHOLDER).join(base);
  fs.writeFileSync(p, s, 'utf8');
  total += n; touched++;
  const rel = path.relative(SITE, p);
  console.log('✓ ' + rel + '  替换 ' + n + ' 处');
}
if (touched === 0) console.log('· 没有需要替换的文件');
else console.log('\n完成：共 ' + touched + ' 个文件、' + total + ' 处已替换为 ' + base);
console.log('提示：之后新增页面请直接用真实域名写 canonical/sitemap。');
