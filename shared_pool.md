# 共享内存池（Shared Pool）— 塞尔达攻略网站 MVP

> 维护者：郝交付（交付总监）
> 写入阶段：Phase 1（专家回传后汇总）
> 用途：Phase 1.5 Spec 生成、Phase 2 设计细化、Phase 3 开发的唯一事实来源

---

## A. 竞品列表（PM 写入）
| 名称 | 类型 | 语言/SEO | 优势 | 劣势 | 变现 | 我们补的空白 |
|---|---|---|---|---|---|---|
| Zelda Dungeon | 直接 | EN/Google | 深度高、互动地图、几乎无广告 | 英文翻墙、TOTK 未做完、中文 SEO=0 | 捐赠 | 中文+百度SEO+双游戏完整 |
| 游民星空 | 直接 | ZH/百度 | 中文、百度SEO极强、内容全 | 广告重、双游戏割裂、检索弱 | 国内联盟 | 统一双游戏+结构化检索 |
| 3DM | 直接 | ZH/百度 | 中文、内容多 | 广告更重、深度略逊 | 国内联盟 | 双游戏统一+双语 |
| Game8 | 直接 | 多语/Google | Google SEO极强、移动优先 | 模板化偏浅、广告密集 | 广告+会员 | 原创深度+中文百度SEO |
| IGN Guides | 直接 | EN/Google | 质量最高、跨端同步 | 英文翻墙、无中文 | 广告 | 中文+百度SEO+双游戏 |
| B站/YouTube 视频 | 替代 | ZH/EN | 直观、实战 | 碎片化、检索难 | 创作者广告 | 系统化可检索文字攻略 |
| Reddit/贴吧/NGA | 替代 | ZH/EN | 即时、真实 | 极分散、不成体系 | 几乎无 | 抓取整合进结构化站 |

## B. 核心功能 + RICE（PM 写入）
Score=(Reach×Impact×Confidence)/Effort。MVP 必做：SEO 基建(67.5)、广告位系统(63.3)、自动补抓管线(23.3)、双游戏结构化内容库(20.0)。
延后：站内统一检索(36.0, v1.1)、互动地图(5.25, Backlog)、收藏进度(4.2)、UGC(4.0)。不做：自产视频(1.0)。

## C. 用户画像（PM 写入）
- P1 国内双坑收集党（核心变现）：18-35男，中文弱英，百度，100%收集，痛点是无中文一站式。
- P2 海外英文玩家（AdSense）：18-40，英文，Google，痛点是模板化/深度弱。
- P3 新手/路痴（流量入口）：中文，百度/B站，痛点是视频碎片化搜不到位置。

## D. 技术约束（架构师写入）
1. 不支持 IE；目标现代浏览器，ES2020+。
2. 构建产物：Astro 纯静态 dist/，无运行时 SSR 依赖。
3. 全站 SSG(output:static)；少数动态接口用 Edge Function/Worker。
4. 定时任务托管 = GitHub Actions schedule（UTC）；高频升级 Cloudflare Cron Triggers。**否决 Vercel Cron Hobby（每天仅 2 次）**。
5. 内容边界：original/ 仅人工，wiki/ 仅爬虫；frontmatter 必含 game(totk|botw)、lang(zh|en)、is_original。
6. 双市场路由：/zh 中文(百度+百度联盟)，/en 英文(Google+AdSense)，环境变量切换禁混用。
7. 百度 SEO 硬约束：robots.txt 的 sitemap 行**禁写 sitemap-index.xml**，须写 sitemap-0.xml；主动提交+自动推送。
8. 广告代码统一走 `<AdSlot>`，禁散落脚本。
9. 爬虫合规：仅抓 robots 合规公开内容，保 source_url 与抓取时间，限流 ≥2s/请求，禁破版权/反爬。
10. 国内自定义域名投百度联盟必须 ICP 备案（执照）；未备案期用平台默认域名仅预留位。

## E. 选型结论（架构师写入）
**主栈：Astro(SSG) + GitHub Actions 爬虫 + 双托管（Cloudflare Pages 全球 / EdgeOne Pages 或 21YunBox 国内）+ Markdown(Git) 内容 + Decap CMS 可选。**
次选 Hugo（万级页+纯开发者）；否决纯 CSR 与常驻 SSR。
对比矩阵综合分：Astro 4.7 / Hugo 4.0 / Next export 3.6 / VitePress 3.6。

## F. 不可行警告（架构师写入）
1. ⚠ 广告变现非上线即得：AdSense 需 ≥30 原创+运营时长+过审率<30%；百度联盟需执照+ICP 备案。收入需数周~数月，勿计入 MVP 验收。
2. ⚠ 国内访问速度依赖托管/备案：未备案期走免备案国内节点或 BunnyCDN 港新，首屏 1-3s；最优需备案+国内 CDN（后期项）。
3. ⚠ 百度 sitemap-index.xml 不兼容：误写即零收录。
4. ⚠ 大规模构建瓶颈：数万页全量重建慢；MVP 千级页无碍。
5. ⚠ 爬虫法律/封禁风险：原创为主、补抓为辅（百度/AdSense 要求原创度 ≥60%）。
6. ⚠ GitHub Actions 调度不确定性：UTC、可能延迟、60 天无提交自动停用。

## G. 设计方向（设计师写入）
- 对标品牌：**Notion（主）** + Stripe Docs / Linear（次）；IGN/Fandom 为反面教材（广告密集/割裂）。
- 配色基调：Hylian 绿 `#2E6B4F` + Triforce 黄铜 `#B68A3E` 点缀，羊皮纸底 `#FAF8F3` / 洞窟炭 `#14171A`。无紫色、无纯黑纯灰。
- 风格：编辑型冷静 wiki、双主题（浅+深）。首页**拒俗套 Hero 大图**。
- 广告共存 7 条铁律：原生/克制/禁插页/合规/可关/内容优先/不抢首屏。
- anti-slop 13 项自查全部通过。

## H. 一致性结论
PRD 功能 ↔ 架构实现：✅ 全对应。
架构约束 ↔ 设计 Token：✅ 双主题/广告克制一致。
对标品牌 ↔ 竞品池：✅ 不冲突。
无阻塞不一致，可进入用户确认（Phase 1 唯一交互点）。
