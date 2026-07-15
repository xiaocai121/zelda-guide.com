#!/usr/bin/env node
/**
 * 批量生成攻略页 + 重新生成 sitemap-0.xml（零依赖，双语版）
 * 用法：node crawler/gen-guide.js
 * 说明：同时产出中文（/{game}/guides/）与英文（/en/{game}/guides/）两套页面，
 *       自动互链 hreflang(zh-CN/en)、调整资源相对路径、并把英文 URL 写入 sitemap。
 *       域名来自下方 BASE（上线前用 set-domain.js 一键替换）。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://zelda-guide.com';
const DATE = '2026-07-15';

// 现有 4 篇（仅进 sitemap 与中文生成，英文版为 v1.1 后续补充）
const EXISTING = [
  { game: 'totk', slug: 'shrine-rauru', pc: 0.8 },
  { game: 'totk', slug: 'durability-fusion', pc: 0.8 },
  { game: 'botw', slug: 'korok-seed-100', pc: 0.8 },
  { game: 'botw', slug: 'shrine-keeta', pc: 0.8 }
];

const IMG = {
  sky: 'Floating_green_islands_in_a_br_2026-07-14T16-25-46.png',
  vast: 'A_vast_peaceful_fantasy_open_w_2026-07-14T16-25-48.png',
  plateau: 'A_great_plateau_with_majestic__2026-07-14T16-25-47.png'
};

const TOC = [
  { id: 'where', text: '一、准备与前置' },
  { id: 'how', text: '二、分步攻略' },
  { id: 'tips', text: '三、进阶技巧' },
  { id: 'faq', text: '常见问题' }
];

const GUIDES = [
  // ===================== TOTK =====================
  {
    game: 'totk', slug: 'sky-island-guide', read: '约 7 分钟',
    title: '初始空岛与天空探索 · 王国之泪 TOTK', h1: '初始空岛与天空探索路线',
    eyebrow: 'TOTK · 流程',
    desc: 'TOTK 初始空岛原创图文攻略：起飞顺序、通天术与余料建造实操、天空资源点，帮新手稳健离开大空岛。',
    cover: IMG.sky,
    lead: '大空岛是 TOTK 的起点，机关设计同时教你「通天术」与「余料建造」两大核心。下面按推荐顺序带你稳妥通关并离开。',
    bodyHtml: `
        <h2 id="where">一、起飞前的准备</h2>
        <p>进入大空岛后先熟悉操作：左摇杆移动、R 键通天术、长按 L 呼出建造选单。建议先在新手回廊把两套操作各练一次。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-heart.svg" alt="心" /></div><div><strong>回血水果 ×3</strong>：岛上有果树，顺手摘。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>训练用木棍 ×1</strong>：岛边缘可拾，用于练习余料建造。</div></div>

        <h2 id="how">二、推荐推进顺序</h2>
        <div class="steps">
          <div class="step"><div><h4>进入建造教学回廊</h4><p>跟着指引用「余料建造」把木棍接在盾上，理解组合逻辑。</p></div></div>
          <div class="step"><div><h4>解锁通天术</h4><p>到指定祭坛互动获得能力，之后可贴附任何顶面直接穿到上方。</p></div></div>
          <div class="step"><div><h4>收集天空物资</h4><p>沿浮空石板捡「左纳乌能源」与电池素材，为离岛后载具打底。</p></div></div>
          <div class="step"><div><h4>触发离岛</h4><p>完成主线节点后从边缘起飞点滑翔离开大空岛，正式进入海拉鲁。</p></div></div>
        </div>

        <h2 id="tips">三、离岛后的第一件事</h2>
        <p>落地后优先解锁就近的鸟望台，点亮地图。天空拾到的能源留着做载具，别急着花。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>若滑翔落点偏了，落地后打开地图选最近鸟望台快速传送，省去长途跋涉。</p></div>
        </div>`,
    faqs: [
      { q: '通天术用不了？', a: '确认已通过祭坛拿到能力；且目标顶面必须可被「贴附」，纯水面或特殊材质不行。' },
      { q: '离岛前必须把物资捡完吗？', a: '不必，但建议至少拿 1 个左纳乌能源，后面载具建造会用到。' },
      { q: '新手回廊卡住？', a: '多数卡点是没接好组合件，回看建造选单确认部件已吸附再确认。' }
    ],
    next: { href: 'vehicle-build-basics.html', text: '左纳乌载具搭建入门' }
  },
  {
    game: 'totk', slug: 'vehicle-build-basics', read: '约 8 分钟',
    title: '左纳乌载具搭建入门 · 王国之泪 TOTK', h1: '左纳乌装置载具搭建入门',
    eyebrow: 'TOTK · 机制',
    desc: 'TOTK 余料建造载具原创教程：车轮+操纵杆组合、稳定重心技巧、常见翻车原因与省电方案。',
    cover: IMG.vast,
    lead: '载具是 TOTK 最有特色的玩法。掌握「车轮+操纵杆+能源」三角，就能造出地面车、船甚至飞天器。',
    bodyHtml: `
        <h2 id="where">一、核心三件套</h2>
        <p>任何载具都基于三个部件：提供动力的左纳乌能源、传递控制的操纵杆、以及执行移动的车轮/风扇/浮空板。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>操纵杆 ×1</strong>：控制方向，必带。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>左纳乌能源 ×1</strong>：供电，决定续航。</div></div>

        <h2 id="how">二、造一台地面车（分步）</h2>
        <div class="steps">
          <div class="step"><div><h4>放底盘</h4><p>选一块平整平板作车身，长度够放两个车轮即可。</p></div></div>
          <div class="step"><div><h4>装车轮</h4><p>在车身前后各接一个车轮，注意左右对称，否则跑偏。</p></div></div>
          <div class="step"><div><h4>接操纵杆</h4><p>把操纵杆吸附在车身中央，系统会提示绑定控制。</p></div></div>
          <div class="step"><div><h4>通电试车</h4><p>装上能源，按操控键前进；若原地打转，多半是车轮朝向反了。</p></div></div>
        </div>

        <h2 id="tips">三、稳定与省电</h2>
        <p>重心越低越稳：把能源和操纵杆放在车身下方。长距离用「风扇+浮空板」替代车轮更省电。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>翻车多半因为重心过高或车轮不对称。造完先在平地空转测试，再上坡。</p></div>
        </div>`,
    faqs: [
      { q: '载具不动？', a: '检查是否装了能源且电量充足；操纵杆是否成功绑定（有绑定提示）。' },
      { q: '怎么做飞天器？', a: '用浮空板+风扇向上，能源供电，控制上升与前进即可短暂飞行。' },
      { q: '能源耗尽怎么办？', a: '地图上散布左纳乌矿，用余料建造敲下再装；或回神庙补给。' }
    ],
    next: { href: 'best-weapons-totk.html', text: 'TOTK 强力武器推荐' }
  },
  {
    game: 'totk', slug: 'totk-korok-1000', read: '约 9 分钟',
    title: '呀哈哈 1000 个收集总览 · 王国之泪 TOTK', h1: '呀哈哈 1000 个收集总览与工具',
    eyebrow: 'TOTK · 全收集',
    desc: 'TOTK 全 1000 个呀哈哈原创总览：类型分布、必备道具、地图标记法与高效路线，告别漏收。',
    cover: IMG.sky,
    lead: 'TOTK 共有 1000 个呀哈哈，是系列之最。按「类型」拆解收集，比盲找高效得多。',
    bodyHtml: `
        <h2 id="where">一、先备两样东西</h2>
        <p>多数呀哈哈靠规律解谜。带齐能大幅提速：</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-seed.svg" alt="种子" /></div><div><strong>种子 ×20</strong>：投入石像/土堆必备。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>弓 ×1</strong>：远距触发机关。</div></div>

        <h2 id="how">二、常见类型与解法</h2>
        <div class="steps">
          <div class="step"><div><h4>土堆/石像</h4><p>把对应物品（种子、水果、武器）投进缺口。</p></div></div>
          <div class="step"><div><h4>花环挑战</h4><p>沿发光线圈滑翔或奔跑，别脱线。</p></div></div>
          <div class="step"><div><h4>石碑拼图</h4><p>把散落石碑推回原位对齐。</p></div></div>
          <div class="step"><div><h4>时间挑战</h4><p>限时到达终点，优先骑马或载具。</p></div></div>
        </div>

        <h2 id="tips">三、高效路线</h2>
        <p>先清完一座区域再换，配合地图标记（✓）避免重复。天空与地底各占一批，别只盯地表。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>用「呀哈哈面具」（需先触发）会让附近呀哈哈发声，是后期补齐的神器。</p></div>
        </div>`,
    faqs: [
      { q: '一定要收满 1000 吗？', a: '不需要满也能通关；收满主要换奖励与成就，按需即可。' },
      { q: '漏了怎么办？', a: '后期拿呀哈哈面具按声音补；或对照类型逐个区域扫。' },
      { q: '地底也有？', a: '有，地底与天空各分布一部分，别漏掉。' }
    ],
    next: { href: 'shrine-all-152.html', text: 'TOTK 全 152 神庙速查' }
  },
  {
    game: 'totk', slug: 'best-weapons-totk', read: '约 7 分钟',
    title: 'TOTK 强力武器与获取 · 王国之泪 TOTK', h1: 'TOTK 强力武器推荐与获取',
    eyebrow: 'TOTK · 装备',
    desc: 'TOTK 强力武器原创推荐：高攻底材、余料建造组合思路、耐久保全技巧，帮你打 BOSS 更轻松。',
    cover: IMG.vast,
    lead: 'TOTK 的武器靠「底材+附件」决定强度。会组合，比单纯找神兵更稳。',
    bodyHtml: `
        <h2 id="where">一、挑底材看攻击力</h2>
        <p>近战底材攻击高优先；想远程就挑弓。注意底材本身有耐久，附件不增加耐久只加伤害。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>近战高攻底材</strong>：如卫士系列。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>远程弓</strong>：应付飞行/高处目标。</div></div>

        <h2 id="how">二、余料建造组合思路</h2>
        <div class="steps">
          <div class="step"><div><h4>选底材</h4><p>攻击力高的近战武器作主体。</p></div></div>
          <div class="step"><div><h4>接附件</h4><p>岩石/金属加伤害，角类加属性。</p></div></div>
          <div class="step"><div><h4>试组合</h4><p>同底材换附件对比伤害，挑最高的一组固化。</p></div></div>
          <div class="step"><div><h4>留备份</h4><p>好底材稀缺，平时多囤几把备用。</p></div></div>
        </div>

        <h2 id="tips">三、耐久怎么保</h2>
        <p>战斗前先让同伴或载具吸引火力；贵重武器只在 BOSS 用，杂兵用普通武器。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>余料建造的附件断了武器还在，所以「好底材+可弃附件」是最优性价比。</p></div>
        </div>`,
    faqs: [
      { q: '最好的底材在哪？', a: '后期迷宫与精英怪掉落的高攻卫士系列最稳，前期用普通高攻替代。' },
      { q: '附件影响耐久吗？', a: '不影响，附件只改伤害/属性，耐久由底材决定。' },
      { q: '武器快坏了能修？', a: '不能修，但可重新余料建造换新附件续命一次。' }
    ],
    next: { href: 'sage-companions.html', text: '四位贤者同伴获取' }
  },
  {
    game: 'totk', slug: 'shrine-all-152', read: '约 8 分钟',
    title: 'TOTK 全 152 神庙速查 · 王国之泪 TOTK', h1: 'TOTK 全 152 神庙速查与分类',
    eyebrow: 'TOTK · 神庙',
    desc: 'TOTK 全 152 座神庙原创速查：按地形（地表/天空/地底）与类型（战斗/解谜/祝福）分类，附优先级。',
    cover: IMG.sky,
    lead: 'TOTK 神庙共 152 座，分布在地表、天空、地底三层。按层推进最高效。',
    bodyHtml: `
        <h2 id="where">一、三层分布</h2>
        <p>地表约 120 座，天空与地底各约 16 座。先清地表再上天入地，路线最顺。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-shrine.svg" alt="神庙" /></div><div><strong>地表神庙</strong>：主线沿途顺手清。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-shrine.svg" alt="神庙" /></div><div><strong>天空/地底神庙</strong>：需对应能力解锁。</div></div>

        <h2 id="how">二、按类型推进</h2>
        <div class="steps">
          <div class="step"><div><h4>战斗型</h4><p>怪固定，练手法顺手清。</p></div></div>
          <div class="step"><div><h4>解谜型</h4><p>多用通天术/余料建造，卡关就换思路。</p></div></div>
          <div class="step"><div><h4>祝福型</h4><p>无战斗，进殿领奖，优先做满容错。</p></div></div>
        </div>

        <h2 id="tips">三、优先级建议</h2>
        <p>BOSS 前先把祝福型神庙做掉，换取心/精力容错。解谜型留到后期能力全了再回头。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>用鸟望台点亮区域后，未解神庙会在地图标问号，按图索骥不漏。</p></div>
        </div>`,
    faqs: [
      { q: '必须全做？', a: '通关只需部分；全做为满血/精力与成就，按需。' },
      { q: '地图不显示？', a: '先登对应鸟望台；天空/地底需切层显示。' },
      { q: '解谜卡死？', a: '多数用通天术或余料建造破，换视角看顶面。' }
    ],
    next: { href: 'totk-korok-1000.html', text: '呀哈哈 1000 收集总览' }
  },
  {
    game: 'totk', slug: 'sage-companions', read: '约 6 分钟',
    title: '四位贤者同伴获取 · 王国之泪 TOTK', h1: 'TOTK 四位贤者同伴获取与运用',
    eyebrow: 'TOTK · 同伴',
    desc: 'TOTK 四位贤者原创攻略：各自所在地、解锁条件、战斗定位与召唤时机，组队打 BOSS 更稳。',
    cover: IMG.vast,
    lead: '四位贤者是你最稳的队友。逐个解锁后可在战斗中召唤，分担火力。',
    bodyHtml: `
        <h2 id="where">一、四位贤者概览</h2>
        <p>分别对应火/雷/风/水的眷属，每人有专属技能与所在地，沿主线逐步解锁。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>战斗型贤者</strong>：正面扛伤。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>远程型贤者</strong>：输出/控场。</div></div>

        <h2 id="how">二、解锁节奏</h2>
        <div class="steps">
          <div class="step"><div><h4>推进主线</h4><p>到对应区域，触发贤者剧情。</p></div></div>
          <div class="step"><div><h4>完成试炼</h4><p>多为解谜+小战，获得召唤能力。</p></div></div>
          <div class="step"><div><h4>绑定轮盘</h4><p>在轮盘绑定，战斗中随时呼叫。</p></div></div>
        </div>

        <h2 id="tips">三、怎么用最划算</h2>
        <p>BOSS 战先召唤扛伤型吸引仇恨，你绕后输出。远程型留作清小怪。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>贤者阵亡会暂时离场，等冷却再召唤；别一次性全压上。</p></div>
        </div>`,
    faqs: [
      { q: '能同时带几个？', a: '战斗可召唤一位在场，轮盘切换。' },
      { q: '贤者死了？', a: '会暂时退场并冷却，稍后重新召唤。' },
      { q: '必须先做主线？', a: '是，四位贤者随主线节点解锁。' }
    ],
    next: { href: 'sky-island-guide.html', text: '初始空岛与天空探索' }
  },
  // ===================== BOTW =====================
  {
    game: 'botw', slug: 'shrine-all-120', read: '约 8 分钟',
    title: 'BOTW 全 120 神庙速查 · 旷野之息 BOTW', h1: 'BOTW 全 120 神庙速查与分类',
    eyebrow: 'BOTW · 神庙',
    desc: 'BOTW 全 120 座神庙原创速查：按类型（战斗/解谜/试炼）分类、分布规律与优先做哪些换精力/心。',
    cover: IMG.plateau,
    lead: 'BOTW 共 120 座神庙，多藏在神庙试炼（shrine quest）后。按类型扫最高效。',
    bodyHtml: `
        <h2 id="where">一、类型分布</h2>
        <p>战斗型与解谜型各占约一半，另有少量「祝福/试炼」需先完成外部任务才显形。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-shrine.svg" alt="神庙" /></div><div><strong>战斗神庙</strong>：怪固定，练手。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-shrine.svg" alt="神庙" /></div><div><strong>解谜神庙</strong>：多用磁力/制冰/时停。</div></div>

        <h2 id="how">二、按能力推进</h2>
        <div class="steps">
          <div class="step"><div><h4>拿四项能力</h4><p>希卡石板能力到手后，解谜神庙基本都能破。</p></div></div>
          <div class="step"><div><h4>顺路清战斗</h4><p>战斗神庙沿主线顺手清，不绕路。</p></div></div>
          <div class="step"><div><h4>解隐藏神庙</h4><p>先做对应「神庙试炼」任务解锁。</p></div></div>
        </div>

        <h2 id="tips">三、精力还是心？</h2>
        <p>想爬塔/滑翔优先换精力；想硬刚 BOSS 优先换心。建议先满一轮精力再补心。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>高塔登顶后，未解神庙在地图标问号，按计划扫不漏。</p></div>
        </div>`,
    faqs: [
      { q: '必须全 120？', a: '通关无需全做；全做为满属性与成就。' },
      { q: '显形不了？', a: '多数为神庙试炼任务，去附近村子接任务。' },
      { q: '解谜用哪招？', a: '磁力/制冰/时停三件套覆盖绝大多数。' }
    ],
    next: { href: 'divine-beast-guide.html', text: '四神兽攻略顺序' }
  },
  {
    game: 'botw', slug: 'divine-beast-guide', read: '约 9 分钟',
    title: '四神兽攻略顺序 · 旷野之息 BOTW', h1: 'BOTW 四神兽攻略顺序与要点',
    eyebrow: 'BOTW · 流程',
    desc: 'BOTW 四神兽原创攻略：推荐挑战顺序、各自机制（火/水/雷/风）、击破后增益，帮你打最终 BOSS 更稳。',
    cover: IMG.plateau,
    lead: '四神兽是最终战前的核心准备。顺序对了，难度直线下降。',
    bodyHtml: `
        <h2 id="where">一、推荐顺序</h2>
        <p>一般建议：水兽→雷兽→风兽→火兽。水/雷机制简单先练手，火兽最难留最后。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>火兽</strong>：机制最复杂，留后。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>水兽</strong>：入门首选。</div></div>

        <h2 id="how">二、各兽要点</h2>
        <div class="steps">
          <div class="step"><div><h4>水兽</h4><p>控制水流冻结通路，解谜友好。</p></div></div>
          <div class="step"><div><h4>雷兽</h4><p>避雷，用非金属武器；高台机制。</p></div></div>
          <div class="step"><div><h4>风兽</h4><p>利用气流与滑翔，节奏快。</p></div></div>
          <div class="step"><div><h4>火兽</h4><p>高温区备防火/耐寒，机关最绕。</p></div></div>
        </div>

        <h2 id="tips">三、击破后的增益</h2>
        <p>每破一兽，最终战可获得对应贤者助攻一次。四兽全破收益最大。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>进兽前在附近存盘点好装备；火兽区带足防火药。</p></div>
        </div>`,
    faqs: [
      { q: '顺序重要吗？', a: '影响难度曲线；按水→雷→风→火最顺。' },
      { q: '打不过？', a: '先回去做神庙补心/精力，或刷装备。' },
      { q: '四兽必须全破？', a: '不必，但全破最终战最轻松。' }
    ],
    next: { href: 'korok-map-regions.html', text: '呀哈哈按区域分布' }
  },
  {
    game: 'botw', slug: 'korok-map-regions', read: '约 8 分钟',
    title: '呀哈哈按区域分布 · 旷野之息 BOTW', h1: 'BOTW 呀哈哈按区域分布与收集',
    eyebrow: 'BOTW · 全收集',
    desc: 'BOTW 全 900 个呀哈哈原创总览：按大区（平原/山地/沙漠等）分布、常见谜题与标记法，高效补齐。',
    cover: IMG.plateau,
    lead: 'BOTW 有 900 个呀哈哈。按大区批量扫，比随机找快得多。',
    bodyHtml: `
        <h2 id="where">一、先拿呀哈哈面具</h2>
        <p>完成相应神庙试炼拿到面具后，靠近呀哈哈会发声，是后期补齐的关键。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-seed.svg" alt="种子" /></div><div><strong>种子 ×20</strong>：投洞/土堆。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>弓</strong>：远距触发。</div></div>

        <h2 id="how">二、按大区扫</h2>
        <div class="steps">
          <div class="step"><div><h4>中央平原</h4><p>密度高，先清这块回本最快。</p></div></div>
          <div class="step"><div><h4>山地/森林</h4><p>多花环与石碑，用滑翔/磁力。</p></div></div>
          <div class="step"><div><h4>沙漠/火山</h4><p>注意环境伤害，备好对应药。</p></div></div>
          <div class="step"><div><h4>海岸/雪原</h4><p>稀有但奖励高，留后期。</p></div></div>
        </div>

        <h2 id="tips">三、标记防重复</h2>
        <p>地图上对每个已收点打✓，按区清零。搭配面具声音，漏网极少。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>同类谜题集中做：先全收「投种子」类，再收「花环」类，节奏更顺。</p></div>
        </div>`,
    faqs: [
      { q: '必须 900？', a: '不必；多为成就与扩容，按需。' },
      { q: '面具哪里拿？', a: '完成指定神庙试炼后获得。' },
      { q: '重复收？', a: '用地图标记避免；已收点会记录。' }
    ],
    next: { href: 'best-armor-botw.html', text: '强力防具套装推荐' }
  },
  {
    game: 'botw', slug: 'best-armor-botw', read: '约 7 分钟',
    title: '强力防具套装推荐 · 旷野之息 BOTW', h1: 'BOTW 强力防具套装与获取',
    eyebrow: 'BOTW · 装备',
    desc: 'BOTW 防具原创推荐：高防套装、环境抗性的耐火/防寒/防雷套、升级材料来源，按需搭配。',
    cover: IMG.vast,
    lead: '防具决定你能不能扛住环境伤害与 BOSS。按需成套，比散搭高效。',
    bodyHtml: `
        <h2 id="where">一、优先凑成套</h2>
        <p>同套装集齐 2 件触发套装效果（如防滑、静音），性价比最高。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-heart.svg" alt="心" /></div><div><strong>耐火套</strong>：火山必备。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>高防近战套</strong>：BOSS 战。</div></div>

        <h2 id="how">二、按环境选</h2>
        <div class="steps">
          <div class="step"><div><h4>火山</h4><p>耐火套+防火药双保险。</p></div></div>
          <div class="step"><div><h4>雪原</h4><p>防寒套或保暖料理。</p></div></div>
          <div class="step"><div><h4>雷区</h4><p>非金属装备避免引雷。</p></div></div>
          <div class="step"><div><h4>BOSS</h4><p>高防套+满血硬刚。</p></div></div>
        </div>

        <h2 id="tips">三、升级材料</h2>
        <p>套装可找 NPC 升级，材料多来自精英怪与呀哈哈奖励，平时顺手囤。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>静音套潜行射猎极好用；想偷袭先凑它。</p></div>
        </div>`,
    faqs: [
      { q: '先升哪套？', a: '先看你要去的环境；火山/雪原优先对应抗性套。' },
      { q: '套装效果怎么触发？', a: '同套装穿够件数自动生效。' },
      { q: '材料不够？', a: '来自精英怪与呀哈哈，边玩边攒。' }
    ],
    next: { href: 'recipe-cooking.html', text: '属性料理配方' }
  },
  {
    game: 'botw', slug: 'recipe-cooking', read: '约 7 分钟',
    title: '属性料理配方 · 旷野之息 BOTW', h1: 'BOTW 属性料理与 buff 配方',
    eyebrow: 'BOTW · 机制',
    desc: 'BOTW 料理原创教程：攻击/防御/耐火/防寒/滑翔等 buff 配方思路、关键食材与叠加规则，省钱省力。',
    cover: IMG.plateau,
    lead: '料理是低成本变强手段。懂「buff 叠加规则」比囤神装更划算。',
    bodyHtml: `
        <h2 id="where">一、buff 规则</h2>
        <p>同类效果取最高，不叠加数值；不同类可共存。食材星级决定时长/强度。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-heart.svg" alt="心" /></div><div><strong>生命食材</strong>：回血/黄心。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-seed.svg" alt="种子" /></div><div><strong>属性素材</strong>：怪角/辣椒等。</div></div>

        <h2 id="how">二、常用配方思路</h2>
        <div class="steps">
          <div class="step"><div><h4>攻击 buff</h4><p>高蛋白肉+攻击怪素材。</p></div></div>
          <div class="step"><div><h4>防御 buff</h4><p>坚甲虫+防御素材。</p></div></div>
          <div class="step"><div><h4>耐火/防寒</h4><p>辣椒类/暖蟹类各显神通。</p></div></div>
          <div class="step"><div><h4>滑翔/潜行</h4><p>对应怪物素材触发。</p></div></div>
        </div>

        <h2 id="tips">三、省钱做法</h2>
        <p>批量采基础食材，关键时刻再下锅。多用「单一属性+主食」组合控成本。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>错误组合会出「失败料理」只回 1 心，下锅前先确认素材属性。</p></div>
        </div>`,
    faqs: [
      { q: 'buff 能叠吗？', a: '同效果取最高不叠加；不同效果可共存。' },
      { q: '怎么延长时间？', a: '用高星食材或同属性多放，提升时长/强度。' },
      { q: '失败料理？', a: '属性冲突会失败，只回少量心。' }
    ],
    next: { href: 'speedrun-basics.html', text: '速通入门路线' }
  },
  {
    game: 'botw', slug: 'speedrun-basics', read: '约 7 分钟',
    title: '速通入门路线 · 旷野之息 BOTW', h1: 'BOTW 速通入门与高效路线',
    eyebrow: 'BOTW · 技巧',
    desc: 'BOTW 速通原创入门：必备能力顺序、跳过冗余、关键传送点与资源管理，普通玩家也能省数小时。',
    cover: IMG.vast,
    lead: '速通不是只给高手。掌握「能力优先 + 跳冗余」，普通通关也能快一大截。',
    bodyHtml: `
        <h2 id="where">一、能力优先</h2>
        <p>先拿时停/制冰/磁力，多数解谜与捷径都靠它们，比盲目推图快。</p>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-bow.svg" alt="弓" /></div><div><strong>时停</strong>：控场/破机关。</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../assets/img/item-sword.svg" alt="剑" /></div><div><strong>制冰</strong>：搭桥/垫脚。</div></div>

        <h2 id="how">二、高效推进</h2>
        <div class="steps">
          <div class="step"><div><h4>直奔高塔</h4><p>点亮地图，少走冤枉路。</p></div></div>
          <div class="step"><div><h4>顺路清神庙</h4><p>主线节点顺路做，不回头。</p></div></div>
          <div class="step"><div><h4>传送串联</h4><p>用传送点连任务，减少跑图。</p></div></div>
          <div class="step"><div><h4>BOSS 前补给</h4><p>只补必要心/精力，其余速通。</p></div></div>
        </div>

        <h2 id="tips">三、资源管理</h2>
        <p>武器随用随弃，贵重留 BOSS；料理按需做，不囤。</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>小技巧</h4><p>很多墙可制冰垫脚翻越，省下绕路时间。</p></div>
        </div>`,
    faqs: [
      { q: '新手能速通吗？', a: '能，重点是能力顺序与少跑图，不必极限操作。' },
      { q: '先拿哪能力？', a: '时停+制冰最通用，优先。' },
      { q: '会不会漏内容？', a: '会漏收集，但主线更快；收集可二周目。' }
    ],
    next: { href: 'shrine-all-120.html', text: '全 120 神庙速查' }
  }
];

/* ============ 英文版内容（与中文 slug 一一对应，结构对齐） ============ */
const EN = {
  'sky-island-guide': {
    title: 'Sky Island & Sky Exploration · TOTK', h1: 'Great Sky Island & Sky Exploration Route',
    eyebrow: 'TOTK · Walkthrough',
    desc: 'Original TOTK guide to the Great Sky Island: takeoff order, Ascend & Ultrahand in practice, and sky resource spots to leave the island steadily.',
    lead: 'The Great Sky Island is TOTK\'s starting area; its puzzles teach you the two core abilities—Ascend and Ultrahand. Follow the recommended order to clear it and depart safely.',
    bodyHtml: `
        <h2 id="where">1. Prep Before Takeoff</h2>
        <p>After arriving on the Great Sky Island, learn the controls: left stick to move, R for Ascend, hold L to open the Ultrahand menu. Practice both once in the tutorial corridor.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-heart.svg" alt="heart" /></div><div><strong>Hearty Fruit ×3</strong>: trees on the island; grab some.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>Training Stick ×1</strong>: found at the island edge; use it to practice Ultrahand.</div></div>

        <h2 id="how">2. Recommended Progression</h2>
        <div class="steps">
          <div class="step"><div><h4>Enter the Ultrahand tutorial</h4><p>Follow the prompt to fuse a stick onto a shield with Ultrahand and understand the combination logic.</p></div></div>
          <div class="step"><div><h4>Unlock Ascend</h4><p>Interact with the designated altar to gain the ability; afterward you can rise through any ceiling surface.</p></div></div>
          <div class="step"><div><h4>Collect sky materials</h4><p>Gather Zonai charges and battery parts along the floating slabs to seed your vehicles later.</p></div></div>
          <div class="step"><div><h4>Trigger departure</h4><p>After the main story node, glide off the island\'s edge from the launch point into Hyrule.</p></div></div>
        </div>

        <h2 id="tips">3. First Thing After Landing</h2>
        <p>Prioritize unlocking the nearest Skyview Tower to reveal the map. Save the sky charges for vehicles; don\'t spend them yet.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>If you drift off course, open the map after landing and fast-travel to the nearest tower instead of trekking.</p></div>
        </div>`,
    faqs: [
      { q: 'Ascend won\'t activate?', a: 'Make sure you unlocked it at the altar; the target ceiling must be "attachable"—pure water or special materials won\'t work.' },
      { q: 'Must I grab everything before leaving?', a: 'No, but grab at least one Zonai charge; you\'ll need it for vehicles.' },
      { q: 'Stuck in the tutorial corridor?', a: 'Most stalls come from a badly fused part—reopen the Ultrahand menu and confirm the part snapped before confirming.' }
    ],
    next: { href: 'vehicle-build-basics.html', text: 'Zonai Vehicle Building 101' }
  },
  'vehicle-build-basics': {
    title: 'Zonai Vehicle Building 101 · TOTK', h1: 'Zonai Device Vehicle Building 101',
    eyebrow: 'TOTK · Mechanics',
    desc: 'Original TOTK Ultrahand vehicle tutorial: wheel + steering stick combos, center-of-gravity tips, common rollover causes, and power-saving tricks.',
    lead: 'Vehicles are TOTK\'s signature play. Master the "wheel + steering stick + battery" triangle and you can build ground cars, boats, even flyers.',
    bodyHtml: `
        <h2 id="where">1. The Core Trio</h2>
        <p>Every vehicle rests on three parts: the Zonai battery that powers it, the steering stick that controls direction, and the wheels/fans/springs that move it.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>Steering Stick ×1</strong>: controls direction; required.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Zonai Battery ×1</strong>: supplies power and decides range.</div></div>

        <h2 id="how">2. Build a Ground Car (step by step)</h2>
        <div class="steps">
          <div class="step"><div><h4>Place a chassis</h4><p>Pick a flat slab as the body; long enough for two wheels.</p></div></div>
          <div class="step"><div><h4>Mount wheels</h4><p>Attach one wheel front and one back, symmetric or it veers.</p></div></div>
          <div class="step"><div><h4>Add steering stick</h4><p>Snap it to the body center; the system will prompt to bind controls.</p></div></div>
          <div class="step"><div><h4>Power and test</h4><p>Install the battery and drive; if it spins in place, the wheel is likely reversed.</p></div></div>
        </div>

        <h2 id="tips">3. Stability & Power Saving</h2>
        <p>Lower center of gravity is steadier: put the battery and steering stick below the body. For long trips, use "fan + spring" instead of wheels to save power.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>Most rollovers come from high center of gravity or asymmetric wheels. Test on flat ground before climbing hills.</p></div>
        </div>`,
    faqs: [
      { q: 'Vehicle won\'t move?', a: 'Check the battery is installed and charged, and the steering stick bound (a prompt confirms it).' },
      { q: 'How do I build a flyer?', a: 'Use springs + fan upward with battery power; control ascent and forward motion for brief flight.' },
      { q: 'Battery dead?', a: 'Zonai ore scatters the map; knock it off with Ultrahand and reattach, or refill at a shrine.' }
    ],
    next: { href: 'best-weapons-totk.html', text: 'Best TOTK Weapons' }
  },
  'totk-korok-1000': {
    title: '1000 Korok Seeds Overview · TOTK', h1: '1000 Korok Seeds Overview & Tools',
    eyebrow: 'TOTK · Collectibles',
    desc: 'Original TOTK guide to all 1000 Korok Seeds: type distribution, must-have items, map-marking method, and an efficient route to stop missing any.',
    lead: 'TOTK has 1000 Korok Seeds—the most in the series. Breaking collection down by "type" beats blind searching.',
    bodyHtml: `
        <h2 id="where">1. Two Things First</h2>
        <p>Most Koroks rely on pattern puzzles. Bringing these two speeds you up a lot:</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-seed.svg" alt="seed" /></div><div><strong>Seeds ×20</strong>: for statues/piles.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Bow ×1</strong>: trigger devices from range.</div></div>

        <h2 id="how">2. Common Types & Solutions</h2>
        <div class="steps">
          <div class="step"><div><h4>Piles / statues</h4><p>Drop the matching item (seed, fruit, weapon) into the gap.</p></div></div>
          <div class="step"><div><h4>Ring challenges</h4><p>Glide or run along the glowing line; don\'t break it.</p></div></div>
          <div class="step"><div><h4>Slab puzzles</h4><p>Push scattered slabs back into alignment.</p></div></div>
          <div class="step"><div><h4>Time trials</h4><p>Reach the goal within the limit; use a horse or vehicle.</p></div></div>
        </div>

        <h2 id="tips">3. Efficient Route</h2>
        <p>Clear one region fully before moving on, and mark the map (✓) to avoid repeats. The sky and depths each hold a batch—don\'t只看 the surface.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>The Korok Mask (unlock first) makes nearby Koroks sound off—a lifesaver for late cleanup.</p></div>
        </div>`,
    faqs: [
      { q: 'Must I collect all 1000?', a: 'No—you can finish the game without; full collection is for rewards and achievements.' },
      { q: 'Missed some?', a: 'Get the Korok Mask later and hunt by sound, or sweep region by region by type.' },
      { q: 'Are there in the depths?', a: 'Yes—the depths and sky each hold a portion; don\'t miss them.' }
    ],
    next: { href: 'shrine-all-152.html', text: 'All 152 TOTK Shrines' }
  },
  'best-weapons-totk': {
    title: 'Best TOTK Weapons & Where to Get · TOTK', h1: 'Best TOTK Weapons & How to Obtain',
    eyebrow: 'TOTK · Gear',
    desc: 'Original TOTK weapon guide: high-attack base materials, Ultrahand fusion ideas, and durability tips to beat bosses more easily.',
    lead: 'TOTK weapons derive strength from "base + attachment". Knowing how to fuse beats hunting for a single godly weapon.',
    bodyHtml: `
        <h2 id="where">1. Pick Base by Attack</h2>
        <p>Prioritize high-attack melee bases; pick a bow for ranged. Note the base has its own durability; attachments add damage, not durability.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>High-attack melee base</strong>: e.g. Guardian series.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Ranged bow</strong>: for flying/high targets.</div></div>

        <h2 id="how">2. Ultrahand Fusion Ideas</h2>
        <div class="steps">
          <div class="step"><div><h4>Choose base</h4><p>Use a high-attack melee weapon as the core.</p></div></div>
          <div class="step"><div><h4>Attach part</h4><p>Rock/metal adds damage; horns add element.</p></div></div>
          <div class="step"><div><h4>Test combos</h4><p>Swap attachments on the same base, compare damage, lock the best.</p></div></div>
          <div class="step"><div><h4>Keep spares</h4><p>Good bases are scarce; stock a few backups.</p></div></div>
        </div>

        <h2 id="tips">3. Preserving Durability</h2>
        <p>Let companions or vehicles draw fire before fighting; save prized weapons for bosses, use common ones on mobs.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>When a fused attachment breaks the weapon remains, so "good base + disposable attachment" is the best value.</p></div>
        </div>`,
    faqs: [
      { q: 'Where is the best base?', a: 'Late-game labs and elite drops of high-attack Guardian series are safest; use common high-attack early.' },
      { q: 'Do attachments affect durability?', a: 'No—attachments only change damage/element; durability comes from the base.' },
      { q: 'Can a broken weapon be repaired?', a: 'Not repaired, but re-fuse a new attachment to extend its life once.' }
    ],
    next: { href: 'sage-companions.html', text: 'Four Sage Companions' }
  },
  'shrine-all-152': {
    title: 'All 152 TOTK Shrines · TOTK', h1: 'All 152 TOTK Shrines Cheat Sheet',
    eyebrow: 'TOTK · Shrines',
    desc: 'Original TOTK guide to all 152 shrines: categorized by terrain (surface/sky/depth) and type (combat/puzzle/blessing), with priorities.',
    lead: 'TOTK has 152 shrines across the surface, sky, and depths. Clear by layer for the smoothest route.',
    bodyHtml: `
        <h2 id="where">1. Three-Layer Distribution</h2>
        <p>About 120 on the surface, ~16 each in the sky and depths. Clear the surface first, then go up and down.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-shrine.svg" alt="shrine" /></div><div><strong>Surface shrines</strong>: clear along the main path.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-shrine.svg" alt="shrine" /></div><div><strong>Sky/depth shrines</strong>: need corresponding abilities unlocked.</div></div>

        <h2 id="how">2. Progress by Type</h2>
        <div class="steps">
          <div class="step"><div><h4>Combat</h4><p>Fixed enemies; good to practice.</p></div></div>
          <div class="step"><div><h4>Puzzle</h4><p>Use Ascend/Ultrahand; switch approach if stuck.</p></div></div>
          <div class="step"><div><h4>Blessing</h4><p>No combat; walk in for the reward—do these for tolerance.</p></div></div>
        </div>

        <h2 id="tips">3. Priority Advice</h2>
        <p>Before the boss, finish blessing shrines for heart/stamina buffer. Save puzzles for when all abilities are unlocked.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>After lighting a region via a Skyview Tower, unsolved shrines show as "?" on the map—hunt by the map.</p></div>
        </div>`,
    faqs: [
      { q: 'Must I do all?', a: 'Only some for the story; all for full health/stamina and achievements.' },
      { q: 'Not showing on map?', a: 'Climb the matching Skyview Tower; sky/depth need layer switch.' },
      { q: 'Puzzle stuck?', a: 'Most break with Ascend or Ultrahand; change the viewing angle for the ceiling.' }
    ],
    next: { href: 'totk-korok-1000.html', text: '1000 Korok Seeds Overview' }
  },
  'sage-companions': {
    title: 'Four Sage Companions · TOTK', h1: 'TOTK Four Sage Companions & Usage',
    eyebrow: 'TOTK · Companions',
    desc: 'Original TOTK guide to the four sages: where each is, unlock conditions, combat role, and when to summon—team up to beat bosses steadily.',
    lead: 'The four sages are your steadiest allies. Unlock them one by one and summon in battle to share the heat.',
    bodyHtml: `
        <h2 id="where">1. Sage Overview</h2>
        <p>They correspond to fire/lightning/wind/water attendants, each with a unique skill and location, unlocked along the main story.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>Combat sage</strong>: tanks damage up front.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Ranged sage</strong>: output / crowd control.</div></div>

        <h2 id="how">2. Unlock Pace</h2>
        <div class="steps">
          <div class="step"><div><h4>Advance the story</h4><p>Reach the region, trigger the sage cutscene.</p></div></div>
          <div class="step"><div><h4>Finish the trial</h4><p>Mostly puzzle + small fight; gain the summon ability.</p></div></div>
          <div class="step"><div><h4>Bind to wheel</h4><p>Bind on the wheel; call anytime in battle.</p></div></div>
        </div>

        <h2 id="tips">3. Best Usage</h2>
        <p>In boss fights, summon the tank first to draw aggro while you flank. Save ranged for mobs.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>A fallen sage temporarily leaves and cools down; don\'t dump all at once.</p></div>
        </div>`,
    faqs: [
      { q: 'How many at once?', a: 'One can be summoned in battle; switch via the wheel.' },
      { q: 'Sage died?', a: 'It temporarily leaves and cools down; re-summon shortly after.' },
      { q: 'Must I do the main story?', a: 'Yes—the four sages unlock at main-story nodes.' }
    ],
    next: { href: 'sky-island-guide.html', text: 'Great Sky Island & Sky Exploration' }
  },
  'shrine-all-120': {
    title: 'All 120 BOTW Shrines · BOTW', h1: 'All 120 BOTW Shrines Cheat Sheet',
    eyebrow: 'BOTW · Shrines',
    desc: 'Original BOTW guide to all 120 shrines: categorized by type (combat/puzzle/trial), distribution patterns, and which to prioritize for stamina/heart.',
    lead: 'BOTW has 120 shrines, many hidden behind shrine quests. Sweeping by type is fastest.',
    bodyHtml: `
        <h2 id="where">1. Type Distribution</h2>
        <p>Combat and puzzle each about half, plus a few "blessing/trial" that only appear after an external task.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-shrine.svg" alt="shrine" /></div><div><strong>Combat shrines</strong>: fixed enemies; practice.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-shrine.svg" alt="shrine" /></div><div><strong>Puzzle shrines</strong>: use magnesis/cryonis/stasis.</div></div>

        <h2 id="how">2. Progress by Ability</h2>
        <div class="steps">
          <div class="step"><div><h4>Get the four abilities</h4><p>Once you have the Sheikah Slate abilities, most puzzle shrines break.</p></div></div>
          <div class="step"><div><h4>Clear combat along the way</h4><p>Combat shrines on the main path; no detour.</p></div></div>
          <div class="step"><div><h4>Solve hidden shrines</h4><p>Do the matching "shrine quest" first to reveal them.</p></div></div>
        </div>

        <h2 id="tips">3. Stamina or Heart?</h2>
        <p>Want to climb towers/glide? Prioritize stamina. Want to bash the boss? Prioritize heart. Suggest a full stamina round first, then heart.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>From a tall tower summit, unsolved shrines show as "?"—sweep by plan, miss none.</p></div>
        </div>`,
    faqs: [
      { q: 'Must I do all 120?', a: 'No for the story; all for full stats and achievements.' },
      { q: 'Won\'t reveal?', a: 'Most are shrine quests—pick them up in nearby villages.' },
      { q: 'Which trick for puzzles?', a: 'Magnesis/cryonis/stasis cover the vast majority.' }
    ],
    next: { href: 'divine-beast-guide.html', text: 'Divine Beast Order' }
  },
  'divine-beast-guide': {
    title: 'Divine Beast Order · BOTW', h1: 'BOTW Divine Beast Order & Tips',
    eyebrow: 'BOTW · Walkthrough',
    desc: 'Original BOTW Divine Beast guide: recommended challenge order, each mechanic (fire/water/lightning/wind), and post-clear buffs to beat the final boss steadily.',
    lead: 'The four Divine Beasts are core prep before the final fight. Right order drops the difficulty sharply.',
    bodyHtml: `
        <h2 id="where">1. Recommended Order</h2>
        <p>Generally: Water → Lightning → Wind → Fire. Water/Lightning are simple to learn; Fire is hardest, save for last.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>Fire beast</strong>: most complex mechanic; save.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Water beast</strong>: best starter.</div></div>

        <h2 id="how">2. Each Beast\'s Points</h2>
        <div class="steps">
          <div class="step"><div><h4>Water</h4><p>Freeze water flow to open paths; puzzle-friendly.</p></div></div>
          <div class="step"><div><h4>Lightning</h4><p>Avoid lightning, use non-metal weapons; high-ground mechanic.</p></div></div>
          <div class="step"><div><h4>Wind</h4><p>Use updrafts and gliding; fast pace.</p></div></div>
          <div class="step"><div><h4>Fire</h4><p>Heat zone needs fire/resist prep; most winding mechanisms.</p></div></div>
        </div>

        <h2 id="tips">3. Post-Clear Buffs</h2>
        <p>Each beast cleared grants one sage assist in the final fight. All four cleared gives the biggest payoff.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>Save at the nearby point and prep gear before entering; bring fire-resist elixirs for the Fire beast.</p></div>
        </div>`,
    faqs: [
      { q: 'Does order matter?', a: 'It shapes the difficulty curve; Water → Lightning → Wind → Fire is smoothest.' },
      { q: 'Can\'t beat it?', a: 'Go do shrines for heart/stamina, or grind gear first.' },
      { q: 'Must I clear all four?', a: 'No, but all four makes the final fight easiest.' }
    ],
    next: { href: 'korok-map-regions.html', text: 'Koroks by Region' }
  },
  'korok-map-regions': {
    title: 'Koroks by Region · BOTW', h1: 'BOTW Korok Seeds by Region',
    eyebrow: 'BOTW · Collectibles',
    desc: 'Original BOTW guide to all 900 Korok Seeds: distribution by major region (plains/mountains/desert), common puzzles, and marking method for efficient cleanup.',
    lead: 'BOTW has 900 Korok Seeds. Sweeping by major region beats random searching.',
    bodyHtml: `
        <h2 id="where">1. Get the Korok Mask First</h2>
        <p>After the matching shrine quest, the mask makes nearby Koroks sound off—key for late cleanup.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-seed.svg" alt="seed" /></div><div><strong>Seeds ×20</strong>: for holes/piles.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Bow</strong>: trigger from range.</div></div>

        <h2 id="how">2. Sweep by Region</h2>
        <div class="steps">
          <div class="step"><div><h4>Central Plains</h4><p>High density; clear first for fastest payback.</p></div></div>
          <div class="step"><div><h4>Mountains/Forest</h4><p>Many rings and slabs; use gliding/magnesis.</p></div></div>
          <div class="step"><div><h4>Desert/Volcano</h4><p>Watch environmental damage; prep the right elixir.</p></div></div>
          <div class="step"><div><h4>Coast/Snowfield</h4><p>Rare but high reward; leave for later.</p></div></div>
        </div>

        <h2 id="tips">3. Mark to Avoid Repeats</h2>
        <p>Check (✓) every collected point on the map; zero each region. With the mask\'s sound, few slip through.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>Batch by puzzle type: collect all "seed-drop" first, then "rings"—smoother rhythm.</p></div>
        </div>`,
    faqs: [
      { q: 'Must I get 900?', a: 'No; mostly for achievements and inventory expansion.' },
      { q: 'Where is the mask?', a: 'Obtained after a specific shrine quest.' },
      { q: 'Duplicate collection?', a: 'Avoid with map marks; collected points are recorded.' }
    ],
    next: { href: 'best-armor-botw.html', text: 'Best Armor Sets' }
  },
  'best-armor-botw': {
    title: 'Best Armor Sets · BOTW', h1: 'BOTW Best Armor Sets & How to Get',
    eyebrow: 'BOTW · Gear',
    desc: 'Original BOTW armor guide: high-defense sets, environmental resist (fire/cold/lightning) sets, and upgrade material sources—mix as needed.',
    lead: 'Armor decides whether you survive environmental damage and bosses. Match by set, better than mixing.',
    bodyHtml: `
        <h2 id="where">1. Prioritize Complete Sets</h2>
        <p>Two pieces of the same set trigger a set bonus (e.g. slip-resist, stealth)—best value.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-heart.svg" alt="heart" /></div><div><strong>Flamebreaker set</strong>: essential for volcano.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>High-defense melee set</strong>: boss fights.</div></div>

        <h2 id="how">2. Pick by Environment</h2>
        <div class="steps">
          <div class="step"><div><h4>Volcano</h4><p>Flamebreaker set + fire-resist elixir, double safety.</p></div></div>
          <div class="step"><div><h4>Snowfield</h4><p>Cold-resist set or warm meals.</p></div></div>
          <div class="step"><div><h4>Lightning zone</h4><p>Non-metal gear avoids attracting lightning.</p></div></div>
          <div class="step"><div><h4>Boss</h4><p>High-defense set + full heart, trade blows.</p></div></div>
        </div>

        <h2 id="tips">3. Upgrade Materials</h2>
        <p>Sets can be upgraded by an NPC; materials mostly come from elite enemies and Korok rewards—stock up casually.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>The stealth set is great for sneak-hunting; build it first if you ambush.</p></div>
        </div>`,
    faqs: [
      { q: 'Which set first?', a: 'Depends on where you go; volcano/snowfield prioritize the matching resist set.' },
      { q: 'How to trigger set bonus?', a: 'Wear enough pieces of the same set; auto-activates.' },
      { q: 'Not enough materials?', a: 'From elite enemies and Koroks; accumulate as you play.' }
    ],
    next: { href: 'recipe-cooking.html', text: 'Buff Recipe Guide' }
  },
  'recipe-cooking': {
    title: 'Buff Recipe Guide · BOTW', h1: 'BOTW Buff Recipes & Effects',
    eyebrow: 'BOTW · Mechanics',
    desc: 'Original BOTW cooking tutorial: attack/defense/fire-resist/cold-resist/glide buff ideas, key ingredients, and stacking rules—save money and effort.',
    lead: 'Cooking is a low-cost power-up. Knowing "buff stacking rules" beats hoarding god gear.',
    bodyHtml: `
        <h2 id="where">1. Buff Rules</h2>
        <p>Same effect takes the highest value, not summed; different effects can coexist. Ingredient star level sets duration/strength.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-heart.svg" alt="heart" /></div><div><strong>Hearty ingredients</strong>: heal / yellow hearts.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-seed.svg" alt="seed" /></div><div><strong>Element materials</strong>: monster horns/chilis etc.</div></div>

        <h2 id="how">2. Common Recipe Ideas</h2>
        <div class="steps">
          <div class="step"><div><h4>Attack buff</h4><p>High-protein meat + attack monster part.</p></div></div>
          <div class="step"><div><h4>Defense buff</h4><p>Hard-shell cricket + defense material.</p></div></div>
          <div class="step"><div><h4>Fire/cold resist</h4><p>Chili / warm-drake classes each shine.</p></div></div>
          <div class="step"><div><h4>Glide/stealth</h4><p>Trigger with the matching monster part.</p></div></div>
        </div>

        <h2 id="tips">3. Money-Saving Tips</h2>
        <p>Batch-gather base ingredients, cook only when needed. Use "single attribute + staple" combos to control cost.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>Clashing attributes yield "failed food" that only heals 1 heart—confirm ingredients before cooking.</p></div>
        </div>`,
    faqs: [
      { q: 'Do buffs stack?', a: 'Same effect takes the highest, not summed; different effects coexist.' },
      { q: 'How to extend duration?', a: 'Use high-star ingredients or stack same attribute for longer/stronger.' },
      { q: 'Failed food?', a: 'Attribute conflict fails; only heals a little.' }
    ],
    next: { href: 'speedrun-basics.html', text: 'Speedrun Basics' }
  },
  'speedrun-basics': {
    title: 'Speedrun Basics · BOTW', h1: 'BOTW Speedrun Basics & Efficient Route',
    eyebrow: 'BOTW · Tips',
    desc: 'Original BOTW speedrun intro: required ability order, skip the redundant, key warp points, and resource management—save hours even as a normal player.',
    lead: 'Speedrunning isn\'t only for pros. Master "abilities first + skip the redundant" and even a normal clear gets much faster.',
    bodyHtml: `
        <h2 id="where">1. Abilities First</h2>
        <p>Grab stasis/cryonis/magnesis early; most puzzles and shortcuts rely on them, faster than blind map-pushing.</p>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-bow.svg" alt="bow" /></div><div><strong>Stasis</strong>: control / break mechanisms.</div></div>
        <div class="item-row"><div class="item-ic"><img src="../../../assets/img/item-sword.svg" alt="sword" /></div><div><strong>Cryonis</strong>: bridge / step stool.</div></div>

        <h2 id="how">2. Efficient Progress</h2>
        <div class="steps">
          <div class="step"><div><h4>Head to tall towers</h4><p>Reveal the map; fewer wrong turns.</p></div></div>
          <div class="step"><div><h4>Clear shrines en route</h4><p>Do them at main-story nodes; no backtrack.</p></div></div>
          <div class="step"><div><h4>Chain warps</h4><p>Use warp points to link quests; less running.</p></div></div>
          <div class="step"><div><h4>Prep before boss</h4><p>Only refill needed heart/stamina; speedrun the rest.</p></div></div>
        </div>

        <h2 id="tips">3. Resource Management</h2>
        <p>Weapons are use-and-discard; save prized ones for bosses. Cook as needed, don\'t stockpile.</p>
        <div class="callout">
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <div><h4>Tip</h4><p>Many walls can be stepped over with a cryonis block—saves the detour.</p></div>
        </div>`,
    faqs: [
      { q: 'Can a beginner speedrun?', a: 'Yes—focus on ability order and less running, not extreme inputs.' },
      { q: 'Which ability first?', a: 'Stasis + cryonis are most versatile; prioritize.' },
      { q: 'Will I miss content?', a: 'You\'ll miss collectibles, but the main story is faster; collect in a second run.' }
    ],
    next: { href: 'shrine-all-120.html', text: 'All 120 Shrines' }
  }
};

/* ============ 文案字典 ============ */
const UI = {
  zh: {
    siteName: '塞尔达攻略站', home: '首页', popular: '热门攻略', about: '关于',
    toc: '本篇目录', faqTitle: '常见问题', next: '下一篇',
    footerDesc: '覆盖 TOTK 与 BOTW 的图文攻略聚合站。',
    gameH: '游戏', noteH: '说明',
    copyright: '© 2026 塞尔达攻略站 · 攻略内容为原创整理，游戏名称/元素版权归 Nintendo 所有',
    aboutLink: '内容来源与版权', updateLink: '自动更新机制'
  },
  en: {
    siteName: 'Zelda Guide', home: 'Home', popular: 'Popular Guides', about: 'About',
    toc: 'On this page', faqTitle: 'FAQ', next: 'Next:',
    footerDesc: 'Illustration-rich guides for TOTK & BOTW.',
    gameH: 'Games', noteH: 'Notes',
    copyright: '© 2026 Zelda Guide · Original guides; game names & elements © Nintendo',
    aboutLink: 'Sources & Copyright', updateLink: 'Auto-update'
  }
};
const GAME_LABEL = {
  totk: { zh: ['王国之泪', '王国之泪 TOTK'], en: ['Tears of the Kingdom', 'TOTK'] },
  botw: { zh: ['旷野之息', '旷野之息 BOTW'], en: ['Breath of the Wild', 'BOTW'] }
};

function zhUrl(g) { return `${BASE}/${g.game}/guides/${g.slug}.html`; }
function enUrl(g) { return `${BASE}/en/${g.game}/guides/${g.slug}.html`; }

function navFor(game, lang) {
  const other = game === 'totk' ? 'botw' : 'totk';
  const hub = lang === 'en' ? '../../index.html' : '../index.html';
  const otherHub = lang === 'en' ? `../../../${other}/index.html` : `../../${other}/index.html`;
  return {
    activeName: GAME_LABEL[game][lang][0],
    activeFull: GAME_LABEL[game][lang][1],
    otherName: GAME_LABEL[other][lang][0],
    otherFull: GAME_LABEL[other][lang][1],
    hubHref: hub,
    otherHref: otherHub
  };
}

function pick(g, lang) {
  if (lang === 'zh') return g;
  const e = EN[g.slug];
  return Object.assign({}, g, {
    title: e.title, h1: e.h1, eyebrow: e.eyebrow, desc: e.desc, lead: e.lead,
    bodyHtml: e.bodyHtml, faqs: e.faqs, next: e.next
  });
}

function renderHead(f, url, lang, g) {
  const faqJson = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: f.faqs.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }))
  });
  const z = zhUrl(g), e = enUrl(g);
  const altZh = lang === 'zh' ? url : z;
  const altEn = lang === 'en' ? url : e;
  const code = lang === 'en' ? 'en' : 'zh-CN';
  return `<!DOCTYPE html>
<html lang="${code}" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${f.title} | ${UI[lang].siteName}</title>
  <meta name="description" content="${f.desc}" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" hreflang="zh-CN" href="${altZh}" />
  <link rel="alternate" hreflang="en" href="${altEn}" />
  <meta property="og:title" content="${f.h1}" />
  <meta property="og:description" content="${f.desc}" />
  <link rel="stylesheet" href="${lang === 'en' ? '../../../assets/css/main.css' : '../../assets/css/main.css'}" />
  <script>(function(){var t='light';try{t=localStorage.getItem('theme')||'light';}catch(e){}document.documentElement.setAttribute('data-theme',t);})();</script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(f.h1)},"author":{"@type":"Organization","name":"${UI[lang].siteName}"},"publisher":{"@type":"Organization","name":"${UI[lang].siteName}"},"datePublished":"${DATE}","dateModified":"${DATE}"}
  </script>
  <script type="application/ld+json">
  ${faqJson}
  </script>
</head>`;
}

function renderBody(f, nav, lang, g) {
  const rel = lang === 'en' ? '../../../' : '../../';
  const altUrl = lang === 'en' ? zhUrl(g) : enUrl(g);
  const tocLinks = TOC.map(t => `          <a href="#${t.id}">${t.text}</a>`).join('\n');
  const faqDetails = f.faqs.map((x, i) =>
    `          <details${i === 0 ? ' open' : ''}><summary>${x.q}<span class="plus">+</span></summary><div class="ans">${x.a}</div></details>`
  ).join('\n');
  return `<body>
  <header class="site-header">
    <nav class="nav">
      <a class="brand" href="${rel}index.html"><img src="${rel}assets/img/logo.svg" alt="logo" />${UI[lang].siteName}</a>
      <button class="icon-btn" data-menu-toggle aria-label="菜单">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="nav-spacer"></div>
      <div class="nav-links">
        <a href="${nav.hubHref}" class="active">${nav.activeName}</a>
        <a href="${nav.otherHref}">${nav.otherName}</a>
        <a href="${rel}index.html#guides">${UI[lang].popular}</a>
        <a href="${rel}index.html#about">${UI[lang].about}</a>
      </div>
      <a class="icon-btn" data-lang-toggle data-lang-href="${altUrl}" aria-label="语言切换">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
      </a>
      <button class="icon-btn" data-theme-toggle aria-label="主题切换">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>
      </button>
    </nav>
  </header>

  <div class="container">
    <div class="breadcrumb"><a href="${rel}index.html">${UI[lang].home}</a> / <a href="${nav.hubHref}">${nav.activeName}</a> / <span>${f.h1}</span></div>
    <div class="doc-layout">
      <main class="doc-main">
        <div class="cover-banner"><img src="${rel}assets/img/${g.cover}" alt="${f.h1} cover (original)" /></div>
        <span class="eyebrow">${f.eyebrow}</span>
        <h1>${f.h1}</h1>
        <p class="lead">${f.lead}</p>

        <div class="ad-slot inline" data-label="文中信息流广告" data-size="728×90"><span class="ad-label">广告</span></div>
${f.bodyHtml}
        <h2 id="faq">${UI[lang].faqTitle}</h2>
        <div class="faq">
${faqDetails}
        </div>

        <div class="ad-slot inline" data-label="文末信息流广告" data-size="728×90"><span class="ad-label">广告</span></div>
        <p class="muted" style="font-size:.85rem">${UI[lang].next}<a href="${g.next.href}">${g.next.text} →</a></p>
      </main>

      <aside class="doc-side">
        <div class="toc">
          <h4>${UI[lang].toc}</h4>
${tocLinks}
        </div>
        <div class="ad-slot sidebar" data-label="侧边矩形广告" data-size="300×250" style="margin-top:16px"><span class="ad-label">广告</span></div>
      </aside>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div><h4>${UI[lang].siteName}</h4><p class="muted" style="font-size:.9rem;max-width:34ch">${UI[lang].footerDesc}</p></div>
      <div><h4>${UI[lang].gameH}</h4><a href="${nav.hubHref}">${nav.activeFull}</a><a href="${nav.otherHref}">${nav.otherFull}</a></div>
      <div><h4>${UI[lang].noteH}</h4><a href="${rel}index.html#about">${UI[lang].aboutLink}</a><a href="${rel}index.html#about">${UI[lang].updateLink}</a></div>
    </div>
    <div class="container footer-bottom">${UI[lang].copyright}</div>
  </footer>
  <script src="${rel}assets/js/main.js"></script>
</body>`;
}

function buildSitemap() {
  const urls = [];
  urls.push({ loc: '/index.html', pc: 1.0, cf: 'daily' });
  urls.push({ loc: '/totk/index.html', pc: 0.9, cf: 'daily' });
  urls.push({ loc: '/botw/index.html', pc: 0.9, cf: 'daily' });
  urls.push({ loc: '/en/index.html', pc: 1.0, cf: 'daily' });
  urls.push({ loc: '/en/totk/index.html', pc: 0.9, cf: 'daily' });
  urls.push({ loc: '/en/botw/index.html', pc: 0.9, cf: 'daily' });
  for (const e of EXISTING) urls.push({ loc: `/${e.game}/guides/${e.slug}.html`, pc: e.pc, cf: 'weekly' });
  for (const g of GUIDES) {
    urls.push({ loc: `/${g.game}/guides/${g.slug}.html`, pc: 0.8, cf: 'weekly' });
    urls.push({ loc: `/en/${g.game}/guides/${g.slug}.html`, pc: 0.8, cf: 'weekly' });
  }
  const items = urls.map(u =>
    `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <lastmod>${DATE}</lastmod>\n    <changefreq>${u.cf}</changefreq>\n    <priority>${u.pc}</priority>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>\n`;
}

// ===== 执行 =====
let count = 0;
for (const g of GUIDES) {
  for (const lang of ['zh', 'en']) {
    const f = pick(g, lang);
    const url = lang === 'zh' ? zhUrl(g) : enUrl(g);
    const html = renderHead(f, url, lang, g) + renderBody(f, navFor(g.game, lang), lang, g);
    const dir = path.join(ROOT, lang === 'zh' ? g.game : 'en/' + g.game, 'guides');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${g.slug}.html`), html, 'utf8');
    count++;
  }
}
fs.writeFileSync(path.join(ROOT, 'sitemap-0.xml'), buildSitemap(), 'utf8');
console.log(`✓ 生成 ${count} 篇攻略（中/英各 ${GUIDES.length}），已更新 sitemap-0.xml（共 ${urls_count()} 条 URL）`);

function urls_count() {
  return 6 + EXISTING.length + GUIDES.length * 2;
}
