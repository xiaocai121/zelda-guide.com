#!/usr/bin/env node
/**
 * 塞尔达攻略站 · 自动补抓爬虫（零依赖，Node 18+）
 * ---------------------------------------------------------------
 * 职责：定时抓取「robots 合规、可公开引用」的攻略/资料源，
 *       提取正文 → 生成带 frontmatter 的 Markdown（源码），
 *       并渲染成可直接访问的静态 HTML 攻略页（自动更新可见化）。
 *
 * 合规约束（架构师硬约束）：
 *   - 仅抓 robots.txt 允许、明确可引用的公开内容
 *   - 每个页面保留 source_url 与 fetched_at，注明出处
 *   - 请求间隔 ≥ 2s，禁破版权/反爬
 *   - 原创度需 ≥60%（百度/AdSense 要求），故补抓为「辅」
 *
 * 使用：node crawler/crawl.js
 * 接管部署：GitHub Actions 每日 02:00 UTC 调用本脚本并提交，
 *        平台（Cloudflare Pages / Netlify）随 git push 自动重建上线。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const ASSETS = '../../assets'; // 从 <game>/guides/<slug>.html 回指

/**
 * 待抓取源配置。请替换为你的合规源（务必先核对对方 robots.txt 与版权声明）。
 * 示例：某公开塞尔达 wiki 的「神庙列表」页面。
 */
const SOURCES = [
  // { url: 'https://example-wiki.example/totk/shrines', game: 'totk', lang: 'zh', slug: 'shrines-list-auto', title: 'TOTK 全神庙列表（自动补抓）' },
  // { url: 'https://example-wiki.example/botw/korok-map', game: 'botw', lang: 'zh', slug: 'korok-map-auto', title: 'BOTW 呀哈哈地图（自动补抓）' },
];

const FRONTMATTER = (m) => `---
game: ${m.game}
lang: ${m.lang}
is_original: false
title: "${m.title}"
source_url: "${m.source_url}"
fetched_at: "${m.fetched_at}"
---\n`;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSource(src) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'ZeldaGuideBot/1.0 (+https://zelda-guide.com; 合规补抓)' },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const bodyMatch = html.match(/<(article|main)[\s\S]*?<\/(article|main)>/i)
      || html.match(/<body[\s\S]*?<\/body>/i);
    const text = stripHtml(bodyMatch ? bodyMatch[0] : html).slice(0, 4000);
    return { title: titleMatch ? titleMatch[1].trim() : src.title, text };
  } catch (e) {
    // 兜底：源不可达/被反爬时，仍产出带出处的占位页，保证流水线不中断
    return { title: src.title, text: `（自动补抓暂未取到正文：${e.message}。请核对 source_url 的 robots 与版权，或改为人工整理后接入。）` };
  }
}

function renderHtml(m, bodyText) {
  const gameName = m.game === 'totk' ? '王国之泪 TOTK' : '旷野之息 BOTW';
  const safeBody = bodyText.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${m.title} · ${gameName} | 塞尔达攻略站</title>
  <meta name="description" content="${m.title}（自动补抓，注明出处）" />
  <link rel="canonical" href="https://zelda-guide.com/${m.game}/guides/${m.slug}.html" />
  <link rel="stylesheet" href="${ASSETS}/css/main.css" />
  <script>(function(){var t='light';try{t=localStorage.getItem('theme')||'light';}catch(e){}document.documentElement.setAttribute('data-theme',t);})();</script>
</head>
<body>
  <div class="container" style="padding-top:24px">
    <div class="breadcrumb"><a href="${ASSETS}/../index.html">首页</a> / <a href="../index.html">${gameName}</a> / <span>${m.title}</span></div>
    <span class="eyebrow">${gameName} · 自动补抓</span>
    <h1>${m.title}</h1>
    <div class="callout">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
      <div><h4>内容来源说明</h4><p>本页由定时爬虫合规补抓自 <a href="${m.source_url}">${m.source_url}</a>，抓取时间 ${m.fetched_at}。版权归原作者所有，本站仅作索引整理，原创深度内容见站内其他页面。</p></div>
    </div>
    <article style="line-height:1.8;color:var(--ink-soft)">
      <p>${safeBody}</p>
    </article>
    <div class="ad-slot inline" data-label="文末信息流广告" data-size="728×90"><span class="ad-label">广告</span></div>
    <p class="muted" style="font-size:.82rem;margin-top:18px">本页为自动补抓占位页；如需完整图文攻略，请在 SOURCES 中接入更细的源或人工补全。</p>
  </div>
  <script src="${ASSETS}/js/main.js"></script>
</body>
</html>`;
}

async function main() {
  if (!SOURCES.length) {
    console.log('[crawl] 未配置 SOURCES，跳过（请在 crawler/crawl.js 中填入合规源）。');
    return;
  }
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  for (const src of SOURCES) {
    const meta = {
      game: src.game, lang: src.lang || 'zh', slug: src.slug,
      title: src.title, source_url: src.url, fetched_at: new Date().toISOString().slice(0, 10),
    };
    const data = await fetchSource(src);
    meta.title = data.title || meta.title;

    const md = FRONTMATTER(meta) + '\n# ' + meta.title + '\n\n' + data.text + '\n';
    const mdPath = path.join(CONTENT_DIR, meta.game + '-' + meta.slug + '.md');
    fs.writeFileSync(mdPath, md, 'utf8');

    const htmlDir = path.join(ROOT, meta.game, 'guides');
    fs.mkdirSync(htmlDir, { recursive: true });
    fs.writeFileSync(path.join(htmlDir, meta.slug + '.html'), renderHtml(meta, data.text), 'utf8');

    console.log(`[crawl] 已生成：${meta.game}/guides/${meta.slug}.html  (源：${meta.source_url})`);
    await new Promise((r) => setTimeout(r, 2000)); // 限流 ≥2s
  }
  console.log('[crawl] 完成。');
}

main().catch((e) => { console.error(e); process.exit(1); });
