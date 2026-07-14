# 塞尔达攻略站 · MVP（零构建静态站）

> 覆盖《王国之泪 TOTK》与《旷野之息 BOTW》的图文攻略聚合站。
> 目标：玩家少翻站、多通关；中文走百度、英文走 Google；原创为主 + 定时补抓；广告位天生为变现设计。
> 本版是**零构建静态站**——不需要任何开发环境，双击即可看，拖到托管平台即可上线。

---

## 0. 你（无开发基础）能直接做的事

| 你想做 | 怎么做 | 难度 |
|---|---|---|
| 看效果 | 双击 `index.html` | ⭐ |
| 上线 | 推到 GitHub 并开 Pages（见第 2 节） | ⭐⭐ |
| 加一篇攻略 | 复制 `totk/guides/shrine-rauru.html` 改文字和图片 | ⭐⭐ |
| 接广告赚钱 | 看第 5 节，需先满足平台门槛 | ⭐⭐⭐ |
| 自动更新内容 | 已配好 GitHub Actions，按第 4 节接仓库即可 | ⭐⭐ |

---

## 1. 本地预览

方式 A（最简单）：直接双击 `site/index.html`。
方式 B（推荐，链接/广告更真实）：在 `site/` 目录起一个本地服务器——

```bash
# 用 Python（系统一般自带）
cd site
python -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

---

## 2. 部署上线（推荐 GitHub Pages）

### 方案 1（推荐，你已选）：GitHub Pages
> 前置必做：仓库 Settings → Pages → Build and deployment → Source 选「GitHub Actions」
1. 把**整个仓库**（含 `site/` 与根目录的 `.github/`）推到 GitHub 的 `main` 分支
2. 首次 push 后，仓库 `Actions` 页的「部署到 GitHub Pages」会自动运行
3. 跑完即可在 `https://你的用户名.github.io/你的仓库名/` 访问
4. 之后每次 push（含自动补抓）都会自动重新部署，无需再操作

### 替换占位域名（上线前必做，一步到位）
所有页面的 `canonical`/`hreflang`、sitemap、robots 里现在是占位 `zelda-guide.example.com`。
运行一行命令即可全部替换（把网址换成你真实的 Pages 地址）：

```bash
cd site
node crawler/set-domain.js https://你的用户名.github.io/你的仓库名
```

脚本会扫描并重写 `index.html` / `totk/index.html` / `botw/index.html` / `sitemap-0.xml` / `robots.txt` 共 5 个文件。

### 其他平台（备选，非 GitHub Pages）
- **Netlify 拖拽**：打开 https://app.netlify.com/drop，把 `site/` 拖进去，得 `xxx.netlify.app` 域名。
- **Cloudflare Pages**：连接 Git 仓库，不构建直接发布 `site/`，可绑自己域名。
- **EdgeOne Pages / 21YunBox**：国内免备案，大陆访问快。
> 选这些平台也要先跑上面的「替换占位域名」。

---

## 3. 如何加一篇攻略（原创，利于过审）

1. 复制 `totk/guides/shrine-rauru.html` 为 `totk/guides/你的标题.html`
2. 改这几处：
   - `<title>` 和 `<h1>`：攻略标题
   - `cover-banner` 里的 `<img src>`：换成你的封面图（放 `assets/img/`）
   - 正文：用已有的 `.step`（步骤卡）、`.callout`（提示框）、`.item-row`（物品行）结构写
   - `id="faq"` 里的 `<details>`：写读者常问的问题（会被 Google 富媒体展示）
3. 在中枢页 `totk/index.html` 的攻略列表里加一张卡片链接过去
4. 在 `sitemap-0.xml` 加一行 `<url>`（或在第 4 节接好 Git 后，等自动提交）
5. 图片建议用**原创 SVG / AI 插画**，避免直接搬运任天堂官方图（版权）。本站已生成一批原创 SVG 与 AI 氛围图在 `assets/img/`。

---

## 4. 自动更新（定期补抓，满足"定期自动更新"）

机制：`site/crawler/crawl.js`（零依赖 Node 脚本）定时抓取你配置的**合规公开资料源**，
自动生成带出处的攻略页；`GitHub Actions` 每天 02:00 UTC 跑一次并提交，托管平台随 push 自动重建上线。

接入步骤：
1. 把仓库推到 GitHub（已按 GitHub Pages 配好，详见第 2 节）
2. 在 `site/crawler/crawl.js` 的 `SOURCES` 里填入你的合规源（**先核对对方 robots.txt 与版权声明**）
3. 完成。之后每天自动补抓，无需你手动维护
4. 想立刻跑一次：在 GitHub 仓库 `Actions` 页点 `定时补抓更新` → `Run workflow`

> 合规底线：仅抓可公开引用内容、保留出处、请求限流 ≥2s、原创度需 ≥60%（百度/AdSense 要求）。
> 所以补抓是"辅"，原创深度内容才是"主"。

---

## 5. 广告变现（诚实前置条件）

⚠️ **广告不是上线就能赚钱**，两个平台都有门槛：

| 平台 | 面向 | 前置条件 | 过审难度 |
|---|---|---|---|
| **Google AdSense** | 海外英文流量（/en） | ≥30 篇原创 + 运营一段时间 + 内容政策合规 | 过审率偏低（<30%），需耐心 |
| **百度联盟** | 国内中文流量（/zh） | 需**营业执照** + **ICP 备案**域名 | 需资质，个人较难 |

接入方式（代码已留好口子，上线后才填）：
在任意页面的 `</body>` 前加一段配置，广告位会自动从"占位"切换成真实广告：

```html
<!-- AdSense 示例 -->
<script>window.__ADS__={type:'adsense',client:'ca-pub-你的ID',slot:{leaderboard:'xxx',inline:'xxx',sidebar:'xxx'}};</script>
<!-- 或 百度联盟 -->
<script>window.__ADS__={type:'baidu',id:'你的ID'};</script>
```

广告位已遍布每页：顶部信息流（970×90）、文中信息流（728×90）、侧边矩形（300×250）、文末。
用户可点 × 关闭（合规要求"可关"）。

**建议节奏**：先专心把原创内容做厚、把SEO 收录做起来（这才是流量来源），
等原创度与流量达标再申请广告，别本末倒置。

---

## 6. SEO 提交（让百度/Google 收录）

1. 百度搜索资源平台（ziyuan.baidu.com）提交：
   - 站点 `sitemap-0.xml`（已按百度约束命名为 `sitemap-0.xml`，**勿改名 sitemap-index.xml**，否则零收录）
   - 主动推送新链接（平台提供 API token）
2. Google Search Console（search.google.com/search-console）提交同一 `sitemap-0.xml`
3. 每页已带 `hreflang`（zh/en 互链）、`canonical`、FAQ/Article 结构化数据，利于富媒体展示。

---

## 7. 文件结构

```
site/
├─ index.html              # 首页（双游戏入口 + 氛围 Hero）
├─ totk/index.html        # 王国之泪 中枢
├─ botw/index.html        # 旷野之息 中枢
├─ totk/guides/          # TOTK 攻略页（含 2 篇示例）
├─ botw/guides/          # BOTW 攻略页（含 2 篇示例）
├─ assets/
│  ├─ css/main.css        # 设计系统（Hylian 绿 + 黄铜，双主题，广告位组件）
│  ├─ js/main.js          # 主题切换/语言记忆/广告注入/TOC
│  └─ img/               # 原创 SVG（地图/图标/封面）+ AI 氛围图
├─ sitemap-0.xml         # 百度/Google 收录（Baidu 合规命名）
├─ robots.txt             # 爬虫规则
└─ crawler/crawl.js       # 自动补抓脚本（零依赖）
```
> 注：`.github/workflows/`（部署 + 自动更新）在**仓库根目录**，不在 `site/` 内。

---

## 8. 后期演进

当前是"零构建静态站"，和它的终极形态 Astro(SSG) 的**产物完全一致（都是静态 HTML）**。
等你或团队有开发环境后，可把内容 Markdown 化、迁移到 Astro，获得更好的构建/内容管理体验——
但 MVP 阶段，这套静态站已经能上线、能收录、能接广告、能自动更新，无需等待。

---

© 2026 塞尔达攻略站 · 攻略内容为原创整理，游戏名称与元素版权归 Nintendo 所有，本站与任天堂无隶属关系。
