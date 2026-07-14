#!/usr/bin/env node
/**
 * 一键替换占位域名（非开发者友好）
 * 用法：node crawler/set-domain.js https://你的用户名.github.io/你的仓库名
 * 作用：把本仓库 5 个文件里的 https://zelda-guide.example.com 全部换成真实域名
 */
const fs = require('fs');
const path = require('path');

const domain = process.argv[2];
if (!domain || !/^https?:\/\//.test(domain)) {
  console.error('用法: node crawler/set-domain.js https://你的用户名.github.io/你的仓库名');
  process.exit(1);
}
const base = domain.replace(/\/+$/, ''); // 去掉末尾斜杠
const PLACEHOLDER = 'https://zelda-guide.example.com';

// 相对 site/ 根的文件列表
const files = [
  'index.html',
  'totk/index.html',
  'botw/index.html',
  'sitemap-0.xml',
  'robots.txt'
];

let total = 0;
for (const f of files) {
  const p = path.join(__dirname, '..', f);
  if (!fs.existsSync(p)) {
    console.log('⚠ 跳过（不存在）: ' + f);
    continue;
  }
  let s = fs.readFileSync(p, 'utf8');
  const n = s.split(PLACEHOLDER).length - 1;
  if (n === 0) { console.log('· 无需替换: ' + f); continue; }
  s = s.split(PLACEHOLDER).join(base);
  fs.writeFileSync(p, s, 'utf8');
  total += n;
  console.log('✓ ' + f + '  替换 ' + n + ' 处');
}
console.log('\n完成：共替换 ' + total + ' 处。之后新增页面请用真实域名写 canonical/sitemap。');
