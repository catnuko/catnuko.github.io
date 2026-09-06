'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const Cesium: any;
declare const VectorTileExtension: any;

/* ─────────────────────────── 内联图标 ─────────────────────────── */

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </svg>
);

const IconPalette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 21a9 9 0 1 1 9-9c0 2.2-1.5 3.4-3.2 3.4h-2.1a2 2 0 0 0-1.5 3.3c.5.6.3 1.5-.5 1.9-.5.3-1.1.4-1.7.4Z" />
    <circle cx="7.8" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="11" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="8.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const IconFlame = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22c4.4 0 7-2.8 7-6.6 0-2.5-1.2-4.7-2.7-6.6-.9-1.1-2-2.3-2.8-3.8-.5-1-.8-2-.8-3 0 0-6.7 4.4-6.7 9.5-.9-1-1.3-2.5-1.3-3.9C3.2 9.4 5 12.6 5 15.4 5 19.2 7.6 22 12 22Z" />
  </svg>
);

const IconMountain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 19 6.5-11L14 15l2.5-4L21 19H3Z" />
    <path d="m9.5 8 1.6-2.7a1 1 0 0 1 1.8 0L14 7.3" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
  </svg>
);

const IconTerrain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 17.5 7 11l4 5 3.5-6L22 17.5" />
    <path d="M2 21h20" />
    <circle cx="17.5" cy="5.5" r="2" />
  </svg>
);

const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14m-6-7 7 7-7 7" />
  </svg>
);

const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden>
    <defs>
      <linearGradient id="cgLogo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5eead4" />
        <stop offset="0.55" stopColor="#38bdf8" />
        <stop offset="1" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="9" stroke="url(#cgLogo)" strokeWidth="1.8" />
    <ellipse cx="16" cy="16" rx="14.5" ry="5.4" stroke="url(#cgLogo)" strokeWidth="1.3" opacity="0.85" transform="rotate(20 16 16)" />
    <circle cx="24.6" cy="8.2" r="1.8" fill="url(#cgLogo)" />
  </svg>
);

/* ─────────────────────────── 内容数据 ─────────────────────────── */

const FEATURES = [
  {
    icon: <IconLayers />,
    title: '矢量瓦片渲染',
    desc: 'MVT / PBF 一路支持到新一代 MLT 格式，瓦片解析、几何三角化、符号化全流程内置，任意矢量瓦片服务一行接入。',
    tags: ['MVT', 'PBF', 'MLT'],
  },
  {
    icon: <IconPalette />,
    title: 'MapLibre Style 符号化',
    desc: '兼容 MapLibre Style 规范与表达式语法（interpolate / get / zoom），fill、line、circle、symbol 图层逐像素还原在球面上。',
    tags: ['MapLibre Style', '表达式', 'setPaintProperty'],
  },
  {
    icon: <IconFlame />,
    title: '热力图',
    desc: 'heatmap-density 核心实时聚算，全球地震、人口、轨迹数据在球面上自然晕染成形，密度一目了然。',
    tags: ['Heatmap', '实时渲染'],
  },
  {
    icon: <IconMountain />,
    title: '山体阴影',
    desc: 'raster-dem 高程瓦片在线生成 hillshade，光照方向与夸张系数皆可调，山脉肌理跃然球上。',
    tags: ['Raster-DEM', 'Hillshade'],
  },
  {
    icon: <IconBuilding />,
    title: '3D 建筑',
    desc: 'fill-extrusion 把城市白模从瓦片中拉伸出来，配合 pick() 点击拾取，建筑属性一触即得。',
    tags: ['Fill-Extrusion', 'Pick'],
  },
  {
    icon: <IconTerrain />,
    title: '实时地形',
    desc: 'TerrainRGBProvider 将 Terrain-RGB 高程瓦片接入 Cesium 地形系统，海拔即刻起伏，山川有了骨架。',
    tags: ['Terrain-RGB', 'Provider'],
  },
];

const DEMOS = [
  {
    tag: 'heatmap',
    title: '全球地震热力图',
    desc: 'MapLibre heatmap 图层渲染全球地震事件，滑块实时调节透明度。',
    href: '/demo/cesium/heatmap/',
  },
  {
    tag: 'hillshade',
    title: '阿尔卑斯山体阴影',
    desc: 'raster-dem 高程瓦片在线生成 hillshade，纯白地表上的光影浮雕。',
    href: '/demo/cesium/hillshade/',
  },
  {
    tag: 'fill-extrusion',
    title: '曼哈顿 3D 建筑',
    desc: '城市白模自瓦片拔地而起，点击建筑即刻在控制台拾取要素。',
    href: '/demo/cesium/baimo/',
  },
  {
    tag: 'mlt',
    title: 'MLT 矢量瓦片',
    desc: '新一代类 MVT 的 MLT 瓦片格式，无需转换直接渲染于球面。',
    href: '/demo/cesium/mlt/',
  },
  {
    tag: 'terrain-rgb',
    title: 'Terrain-RGB 地形',
    desc: 'TerrainRGBProvider 驱动真实高程，瓦片级地形即刻起伏。',
    href: '/demo/cesium/terrain-rgb/',
  },
  {
    tag: 'playground',
    title: '在线体验',
    desc: '样式热切换试验场，亲手转动这颗由矢量瓦片构成的地球。',
    href: '/demo/cesium/playground/',
  },
];

const ARCH_NODES = [
  { name: '数据源', sub: 'MapLibre Style · MVT / PBF / MLT · GeoJSON · Terrain-RGB' },
  { name: '异步解析', sub: '瓦片调度 · 几何三角化 · Glyph 排版' },
  { name: '样式引擎', sub: '表达式求值 · paint / layout · 热更新' },
  { name: 'Cesium 图元', sub: 'Primitive 批渲染 · 深度融合 · 椭球坐标' },
];

const API_CARDS = [
  {
    name: 'SymbolStyleCollection',
    kind: '样式集合',
    desc: '多套 MapLibre Style 的总管：addStyleUrl 热加载、随时切换底图，配合 dat.gui 一类的面板即可实时调参。',
    code: "const collection =\n  new VectorTileExtension.SymbolStyleCollection({\n    viewer,\n  });\nawait collection.readyPromise;\nawait collection.addStyleUrl(\n  'https://tiles.openfreemap.org/styles/bright'\n);",
  },
  {
    name: 'VectorTilePrimitive',
    kind: '矢量图元',
    desc: '把一份 Style 直接渲染为 Cesium 图元：pick() 点击拾取要素、debugSymbol 调试开关、clampTo3DTile 贴合 3D Tiles。',
    code: "const primitive =\n  new VectorTileExtension.VectorTilePrimitive({\n    viewer,\n    style: 'https://…/style.json',\n  });\nawait primitive.readyPromise;\n\n// 点击拾取要素\nprimitive.pick(movement.position);",
  },
  {
    name: 'TerrainRGBProvider',
    kind: '地形提供器',
    desc: '把 Terrain-RGB 高程瓦片接入 Cesium 地形系统：WebMercator 切片，tileSize 与 zOffset 皆可配置。',
    code: "const provider = await\n  VectorTileExtension.TerrainRGBProvider.fromUrl(\n    'https://…/tiles.json',\n    { tileSize: 512 },\n  );\nviewer.terrainProvider = provider;",
  },
];

const QUICKSTART_HTML = `<link rel="stylesheet"
  href="https://cesium.com/downloads/cesiumjs/releases/1.143/Build/Cesium/Widgets/widgets.css" />
<script src="https://cesium.com/downloads/cesiumjs/releases/1.143/Build/Cesium/Cesium.js"></script>
<script src="/libs/VectorTileExtension-min.js"></script>`;

const QUICKSTART_JS = `const viewer = new Cesium.Viewer('cesiumContainer');

// 一行接入全球矢量底图
const globe = new VectorTileExtension.SymbolStyleCollection({
  viewer,
});
await globe.readyPromise;
await globe.addStyleUrl(
  'https://tiles.openfreemap.org/styles/bright'
);`;

/* ─────────────────────────── 代码高亮 ─────────────────────────── */

type Token = { t: string; c?: 'k' | 's' | 'c' | 'n' | 'f' | 'p' };

const KEYWORDS = new Set([
  'const', 'let', 'await', 'async', 'new', 'function', 'return', 'true', 'false',
]);

/** 极简逐行高亮：字符串 / 注释 / 关键字 / 数字 / 方法调用 */
function highlight(code: string): Token[][] {
  return code.split('\n').map((line) => {
    const tokens: Token[] = [];
    let rest = line;
    const pushPlain = (text: string) => {
      if (!text) return;
      const re = /(\b(?:const|let|await|async|new|function|return|true|false)\b|\b\d+(?:\.\d+)?\b|\.\w+(?=\()|\w+(?=\())/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        if (m.index > last) tokens.push({ t: text.slice(last, m.index) });
        const w = m[0];
        if (/^\d/.test(w)) tokens.push({ t: w, c: 'n' });
        else if (KEYWORDS.has(w)) tokens.push({ t: w, c: 'k' });
        else tokens.push({ t: w, c: 'f' });
        last = m.index + w.length;
      }
      if (last < text.length) tokens.push({ t: text.slice(last) });
    };
    while (rest.length) {
      const strM = rest.match(/(['"])(?:(?!\1).)*\1/);
      const comIdx = rest.indexOf('//');
      if (comIdx !== -1 && (strM === null || comIdx < (strM.index as number))) {
        pushPlain(rest.slice(0, comIdx));
        tokens.push({ t: rest.slice(comIdx), c: 'c' });
        break;
      }
      if (strM) {
        pushPlain(rest.slice(0, strM.index));
        tokens.push({ t: strM[0], c: 's' });
        rest = rest.slice((strM.index as number) + strM[0].length);
      } else {
        pushPlain(rest);
        break;
      }
    }
    return tokens;
  });
}

function CodeBlock({ code, lang, filename }: { code: string; lang: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => undefined,
    );
  }, [code]);

  return (
    <div className={styles.codePanel}>
      <div className={styles.codeHead}>
        <span className={styles.dots} aria-hidden>
          <i /><i /><i />
        </span>
        <span className={styles.fileName}>{filename}</span>
        <span className={styles.langTag}>{lang}</span>
        <button type="button" className={styles.copyBtn} onClick={copy} aria-label="复制代码">
          {copied ? <IconCheck /> : <IconCopy />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className={styles.codeBody}>
        {highlight(code).map((lineTokens, i) => (
          <div className={styles.codeLine} key={i}>
            <span className={styles.lineNo}>{i + 1}</span>
            <code>
              {lineTokens.length === 0 ? ' ' : lineTokens.map((tk, j) => (
                <span key={j} className={tk.c ? styles[`tk_${tk.c}`] : undefined}>{tk.t}</span>
              ))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ─────────────────────────── 资源加载（跨渲染去重） ─────────────────────────── */

const CESIUM_VERSION = '1.143';
const CESIUM_BASE = `https://cesium.com/downloads/cesiumjs/releases/${CESIUM_VERSION}/Build/Cesium/`;

const cssPromises = new Map<string, Promise<void>>();
const jsPromises = new Map<string, Promise<void>>();

function loadCss(href: string): Promise<void> {
  let p = cssPromises.get(href);
  if (!p) {
    p = new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
    cssPromises.set(href, p);
  }
  return p;
}

function loadScript(src: string): Promise<void> {
  let p = jsPromises.get(src);
  if (!p) {
    p = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.body.appendChild(s);
    });
    jsPromises.set(src, p);
  }
  return p;
}

/* ─────────────────────────── 页面组件 ─────────────────────────── */

export default function CesiumHomePage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [navSolid, setNavSolid] = useState(false);
  const [sceneState, setSceneState] = useState<'loading' | 'ready' | 'failed'>('loading');

  /* ── Hero：由插件实时渲染的矢量瓦片地球 ── */
  useEffect(() => {
    if (sceneState !== 'loading') return;
    let disposed = false;
    let viewer: any = null;

    async function initHero() {
      // Cesium 需要在脚本执行前知道资源根目录（Workers / Assets）
      (window as any).CESIUM_BASE_URL = CESIUM_BASE;
      await Promise.all([
        loadCss(`${CESIUM_BASE}Widgets/widgets.css`),
        loadScript(`${CESIUM_BASE}Cesium.js`),
        loadScript('/libs/VectorTileExtension-min.js'),
      ]);
      if (disposed) return;

      const Cesium = (window as any).Cesium;
      const VTE = (window as any).VectorTileExtension;
      const el = hostRef.current;
      if (!Cesium || !VTE || !el) {
        setSceneState('failed');
        return;
      }

      try {
        viewer = new Cesium.Viewer(el, {
          useBrowserRecommendedResolution: false,
          baseLayer: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          // 透明画布 —— 让 CSS 星空透出来
          contextOptions: { webgl: { alpha: true } },
          creditContainer: document.createElement('div'),
        });

        const scene = viewer.scene;
        scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
        scene.skyBox.show = false;
        scene.sun.show = false;
        scene.moon.show = false;
        scene.skyAtmosphere.show = true; // 保留地球边缘的蓝色大气辉光
        scene.globe.showGroundAtmosphere = false;
        scene.globe.baseColor = Cesium.Color.fromCssColorString('#08131f');
        try { scene.msaaSamples = 4; } catch { /* 旧版不支持 */ }

        // 首页展示模式：仅保留拖拽环绕，禁用缩放 / 倾斜 / 平移，
        // 避免拉近后瓦片换级加载破坏观感，滚轮留给页面滚动
        const ctrl = scene.screenSpaceCameraController;
        ctrl.enableZoom = false;
        ctrl.enableTilt = false;
        ctrl.enableTranslate = false;
        ctrl.enableLook = false;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(105, 15, 24000000),
        });

        // 拖拽进行中暂停自动巡航，松手约 2.6 秒后恢复
        let pointerDown = false;
        let resumeAt = 0;
        const onDown = () => { pointerDown = true; };
        const onUp = () => {
          pointerDown = false;
          resumeAt = performance.now() + 2600;
        };
        viewer.canvas.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);

        // 离屏暂停自转（Cesium 自身仍在渲染，但相机静止时开销极低）
        let heroVisible = true;
        const io = new IntersectionObserver((entries) => {
          heroVisible = entries[0]?.isIntersecting ?? true;
        }, { threshold: 0.02 });
        io.observe(viewer.canvas);

        // 基于时间的自转：约 0.05 rad/s ≈ 2.9°/秒，与帧率无关；
        // dt 上限 0.25s 防止标签页挂起后跳变
        let last = performance.now();
        viewer.clock.onTick.addEventListener(() => {
          const now = performance.now();
          const dt = Math.min((now - last) / 1000, 0.25);
          last = now;
          if (!heroVisible || pointerDown || now < resumeAt) return;
          try {
            scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.05 * dt);
          } catch { /* 忽略巡航失败 */ }
        });

        // ── 官方页的地球本身就用插件渲染 —— 即最好的 Demo ──
        const collection = new VTE.SymbolStyleCollection({
          viewer,
          clampTo3DTile: false,
          geoway: false,
        });
        await collection.readyPromise;
        await collection.addStyleUrl('https://tiles.openfreemap.org/styles/bright');
        if (!disposed) setSceneState('ready');
      } catch {
        if (!disposed) setSceneState('failed');
      }
    }

    initHero();
    return () => {
      disposed = true;
      try { viewer?.destroy?.(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 导航栏滚动状态 ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setNavSolid(el.scrollTop > 12);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  /* ── 滚动渐显 ── */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.revealItem'));
    items.forEach((el) => el.classList.add(styles.reveal));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add(styles.revealIn);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.page} ref={scrollRef}>
      {/* ══════════ 顶部导航 ══════════ */}
      <nav className={`${styles.nav} ${navSolid ? styles.navSolid : ''}`}>
        <div className={styles.navInner}>
          <Link href="/demo/cesium/" className={styles.brand}>
            <LogoMark />
            <span>Cesium<b>VectorTile</b></span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#features">特性</a>
            <a href="#demos">示例</a>
            <a href="#architecture">架构</a>
            <a href="#quickstart">快速开始</a>
            <a href="#api">API</a>
          </div>
          <Link href="/demo/cesium/playground/" className={styles.navCta}>
            在线体验
            <IconArrow />
          </Link>
        </div>
      </nav>

      {/* ══════════ Hero：插件实时渲染的矢量瓦片地球 ══════════ */}
      <header className={styles.hero}>
        <div ref={hostRef} className={styles.heroGlobe} aria-hidden={sceneState !== 'ready'} />
        {sceneState === 'failed' && <div className={styles.heroFallback} aria-hidden />}
        <div className={styles.heroScrim} aria-hidden />

        {sceneState === 'loading' && (
          <div className={styles.heroLoading} aria-hidden>
            <span className={styles.loaderRing} />
            <span>正在点亮矢量瓦片地球…</span>
          </div>
        )}

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.pulseDot} aria-hidden />
            Cesium 原生插件 · 你眼前的地球正由它渲染
          </div>
          <h1 className={styles.heroTitle}>
            让 Cesium
            <br />
            拥有<span className={styles.gradText}>MapLibre 的灵魂</span>
          </h1>
          <p className={styles.heroSub}>
            CesiumVectorTile 把完整的矢量瓦片渲染管线带入 Cesium ——
            矢量底图、热力图、山体阴影、3D 建筑与实时地形，全部生长在这颗星球上。
          </p>
          <div className={styles.heroActions}>
            <a href="#quickstart" className={styles.btnPrimary}>
              快速开始
              <IconArrow />
            </a>
            <Link href="/demo/cesium/playground/" className={styles.btnGhost}>
              进入在线体验
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statChip}><b>MVT·MLT</b><span>矢量瓦片</span></div>
            <div className={styles.statChip}><b>Style</b><span>MapLibre 规范</span></div>
            <div className={styles.statChip}><b>Pick</b><span>要素拾取</span></div>
            <div className={styles.statChip}><b>Terrain</b><span>实时高程</span></div>
          </div>
        </div>

        <div className={styles.dragHint} aria-hidden>
          <span className={styles.pulseDot} />按住拖动 · 环游地球
        </div>

        <a href="#features" className={styles.scrollHint} aria-label="向下滚动">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </header>

      {/* ══════════ 生态兼容 ══════════ */}
      <section className={styles.ecoBar}>
        <div className={styles.container}>
          <p className={styles.ecoLabel}>兼容开放瓦片生态 · 开箱即用</p>
          <div className={styles.ecoRow}>
            {['OpenFreeMap', 'OpenStreetMap', 'MapTiler', 'Protomaps', 'MapLibre Style', '自定义瓦片服务'].map((n) => (
              <span className={styles.ecoChip} key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 核心特性 ══════════ */}
      <section className={styles.section} id="features">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>FEATURES</span>
            <h2 className={styles.secTitle}>把 MapLibre 生态，装进 Cesium</h2>
            <p className={styles.secDesc}>
              从瓦片请求到像素上屏的完整管线，全部封装为三个开箱即用的对象。
            </p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <article className={`${styles.featureCard} revealItem`} key={f.title} style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className={styles.tagRow}>
                  {f.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 在线示例 ══════════ */}
      <section className={styles.section} id="demos">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>DEMOS</span>
            <h2 className={styles.secTitle}>每一个特性，都有活着的示例</h2>
            <p className={styles.secDesc}>
              全部示例开箱即用，均由本插件驱动 —— 点开即所见。
            </p>
          </div>
          <div className={styles.demoGrid}>
            {DEMOS.map((d, i) => (
              <Link
                href={d.href}
                className={`${styles.demoCard} revealItem`}
                key={d.href}
                style={{ transitionDelay: `${(i % 3) * 90}ms` }}
              >
                <div className={styles.demoTop}>
                  <span className={styles.demoTag}>{d.tag}</span>
                  <span className={styles.demoArrow} aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
                <span className={styles.demoGo}>
                  查看示例
                  <IconArrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 渲染架构 ══════════ */}
      <section className={styles.section} id="architecture">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>ARCHITECTURE</span>
            <h2 className={styles.secTitle}>从一份 Style，到一颗星球</h2>
            <p className={styles.secDesc}>
              数据与渲染彻底解耦：解析异步完成，Cesium 主线程只负责把几何体送上 GPU。
            </p>
          </div>
          <div className={`${styles.archFlow} revealItem`}>
            {ARCH_NODES.map((n, i) => (
              <div className={styles.archItem} key={n.name}>
                <div className={styles.archNode}>
                  <span className={styles.archIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <b>{n.name}</b>
                  <small>{n.sub}</small>
                </div>
                {i < ARCH_NODES.length - 1 && (
                  <div className={styles.archArrow} aria-hidden>
                    <svg viewBox="0 0 40 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M0 6h34" strokeDasharray="4 4" />
                      <path d="m30 1.5 5 4.5-5 4.5" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={`${styles.archNote} revealItem`}>
            <b>为什么丝滑？</b>
            <span>
              瓦片解码不阻塞渲染线程，样式引擎与 Cesium 场景深度融合 ——
              拖拽、倾斜、飞行全程保持原生帧率，海量要素依旧稳如磐石。
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ 快速开始 ══════════ */}
      <section className={styles.section} id="quickstart">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>QUICK START</span>
            <h2 className={styles.secTitle}>三分钟，点亮第一张矢量底图</h2>
            <p className={styles.secDesc}>
              无需构建配置，引入脚本即可运行；也完全兼容 npm 工程与打包器。
            </p>
          </div>
          <div className={styles.codeGrid}>
            <div className="revealItem">
              <p className={styles.codeStep}><b>01</b> 引入 Cesium 与插件</p>
              <CodeBlock code={QUICKSTART_HTML} lang="html" filename="index.html" />
            </div>
            <div className="revealItem">
              <p className={styles.codeStep}><b>02</b> 创建地球并加载样式</p>
              <CodeBlock code={QUICKSTART_JS} lang="javascript" filename="main.js" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ API ══════════ */}
      <section className={styles.section} id="api">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>API</span>
            <h2 className={styles.secTitle}>三个对象，覆盖整条管线</h2>
            <p className={styles.secDesc}>
              样式集合、矢量图元与地形提供器各司其职，深入定制也留有余地。
            </p>
          </div>
          <div className={styles.apiGrid}>
            {API_CARDS.map((c, i) => (
              <article className={`${styles.apiCard} revealItem`} key={c.name} style={{ transitionDelay: `${i * 90}ms` }}>
                <div className={styles.apiCardHead}>
                  <span className={styles.apiKind}>{c.kind}</span>
                  <code className={styles.apiName}>{c.name}</code>
                </div>
                <p>{c.desc}</p>
                <pre className={styles.apiCode}><code>{c.code}</code></pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 底部 CTA ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.ctaBand} revealItem`}>
            <div className={styles.ctaGlow} aria-hidden />
            <h2>现在，就在浏览器里转动它</h2>
            <p>打开在线体验，亲手切换每一套 MapLibre 样式。</p>
            <div className={styles.ctaActions}>
              <Link href="/demo/cesium/playground/" className={styles.btnPrimary}>
                进入在线体验
                <IconArrow />
              </Link>
              <a href="#quickstart" className={styles.btnGhost}>查看接入指南</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 页脚 ══════════ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <div className={styles.brand}>
              <LogoMark />
              <span>Cesium<b>VectorTile</b></span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#features">特性</a>
              <a href="#demos">示例</a>
              <a href="#quickstart">快速开始</a>
              <Link href="/demo/cesium/playground/">在线体验</Link>
              <a href="https://github.com/catnuko" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <p className={styles.footerNote}>
            © {new Date().getFullYear()} catnuko · 基于 CesiumJS 构建 · 矢量瓦片由 OpenFreeMap 提供
          </p>
        </div>
      </footer>
    </div>
  );
}
