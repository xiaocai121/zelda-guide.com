/* 塞尔达攻略站 · 交互脚本（零依赖）
   职责：主题切换 / 语言记忆 / 广告位注入 / TOC 滚动高亮 / 移动端菜单 / 广告可关 */
(function () {
  'use strict';

  /* ---------- 主题 ---------- */
  var root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  var saved = 'light';
  try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
  applyTheme(saved);
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(cur);
  });

  /* ---------- 语言记忆（英文版 /en 由爬虫/后续上线，这里仅记忆偏好） ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang-toggle]');
    if (!btn) return;
    var href = btn.getAttribute('data-lang-href');
    if (href) { window.location.href = href; return; }
    var lang = root.getAttribute('lang') === 'en' ? 'zh' : 'en';
    root.setAttribute('lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e2) {}
    toast(lang === 'en' ? 'Switched to English version' : '已切回中文版');
  });

  /* ---------- 移动端菜单 ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-menu-toggle]');
    if (!btn) return;
    var links = document.querySelector('.nav-links');
    if (links) links.classList.toggle('open');
  });

  /* ---------- TOC 滚动高亮 ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
    var targets = tocLinks
      .map(function (a) {
        var id = a.getAttribute('href').slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.id;
            tocLinks.forEach(function (a) {
              a.style.color = a.getAttribute('href') === '#' + id
                ? 'var(--hylian)' : '';
            });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      targets.forEach(function (t) { obs.observe(t); });
    }
  }

  /* ---------- 广告位注入 ----------
     MVP 默认显示"合规占位"（不计入真实收入）。
     接入真实广告：在页面 </body> 前加入配置即可自动切换，例如：
     <script>window.__ADS__={type:'adsense',client:'ca-pub-xxxx',slot:{leaderboard:'123',inline:'456',sidebar:'789'}};</script>
     或百度联盟：window.__ADS__={type:'baidu',id:'xxxx'};
  */
  function injectAds() {
    var slots = document.querySelectorAll('.ad-slot');
    var cfg = window.__ADS__ || null;
    slots.forEach(function (slot) {
      var label = slot.getAttribute('data-label') || '广告';
      var size = slot.getAttribute('data-size') || '';
      if (cfg && cfg.type === 'adsense') {
        // 真实 AdSense：此处由平台自动填充，占位仅用于预览
      }
      // 占位渲染（上线前展示，避免空白；接入后由广告脚本替换）
      var ph = document.createElement('div');
      ph.className = 'ad-placeholder';
      ph.innerHTML = '<div class="ad-size">' + (size || '广告位') + '</div>' +
        '<div>' + label + ' · 接入后此处展示真实广告</div>';
      slot.appendChild(ph);
      var close = document.createElement('button');
      close.className = 'ad-close';
      close.setAttribute('aria-label', '关闭广告');
      close.textContent = '×';
      close.addEventListener('click', function (ev) {
        ev.stopPropagation();
        slot.classList.add('dismissed');
      });
      slot.appendChild(close);
    });
  }
  injectAds();

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);' +
        'background:rgba(20,23,26,.92);color:#fff;padding:10px 16px;border-radius:8px;' +
        'font-size:.9rem;z-index:200;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:90vw;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.style.opacity = '0'; }, 3200);
  }
})();
