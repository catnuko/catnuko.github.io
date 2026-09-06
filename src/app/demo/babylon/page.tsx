'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const BABYLON: any;
declare const BabylonVectorTile: any;

/* ─────────────────────────── 内联图标 ─────────────────────────── */

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 2.6 4.2 5.6 4.2 9S14.8 18.4 12 21M12 3C9.2 5.6 7.8 8.6 7.8 12s1.4 6.4 4.2 9" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
  </svg>
);

const IconMountain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 19 6.5-11L14 15l2.5-4L21 19H3Z" />
    <path d="m9.5 8 1.6-2.7a1 1 0 0 1 1.8 0L14 7.3" />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </svg>
);

const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
  </svg>
);

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
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
      <linearGradient id="lgLogo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.55" stopColor="#818cf8" />
        <stop offset="1" stopColor="#e879f9" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="8.5" stroke="url(#lgLogo)" strokeWidth="1.8" />
    <ellipse cx="16" cy="16" rx="14" ry="5.2" stroke="url(#lgLogo)" strokeWidth="1.4" opacity="0.85" transform="rotate(-24 16 16)" />
    <circle cx="27.4" cy="9.4" r="1.9" fill="url(#lgLogo)" />
  </svg>
);

/* ─────────────────────────── 内容数据 ─────────────────────────── */

const FEATURES = [
  {
    icon: <IconGlobe />,
    title: '矢量瓦片渲染',
    desc: '完整解析 MVT/PBF 矢量瓦片，兼容 MapLibre Style 规范 —— 图层样式、面填充、线描边、Glyph 文字标注全部在 GPU 上完成符号化。',
    tags: ['MVT', 'MapLibre Style', 'Glyph 标注'],
  },
  {
    icon: <IconBuilding />,
    title: '3D 建筑白模',
    desc: 'Fill-Extrusion 图层直接拉伸为立体建筑群，与地形、道路无缝贴合，让城市数据在地球上"生长"出来。',
    tags: ['Fill-Extrusion', '城市白模'],
  },
  {
    icon: <IconMountain />,
    title: '全球地形',
    desc: '加载 Terrain-RGB 高程瓦片生成真实起伏的地形网格，配合雾效与地表融合，山脉、峡谷一览无余。',
    tags: ['Terrain-RGB', '高程网格'],
  },
  {
    icon: <IconLayers />,
    title: '影像图层',
    desc: 'Raster 影像与矢量图层混合叠加，支持多来源卫星影像服务，遥感底图与矢量要素同屏渲染。',
    tags: ['Raster', '混合叠加'],
  },
  {
    icon: <IconCamera />,
    title: '地理空间相机',
    desc: '基于 Babylon.js 的 GeospatialCamera：WGS84 椭球、大世界坐标渲染、贴地裁剪与碰撞检测，自由环绕这颗星球。',
    tags: ['WGS84', 'GeospatialCamera'],
  },
  {
    icon: <IconBolt />,
    title: '为性能而生',
    desc: 'Worker 解码瓦片、几何缓冲复用、meshopt 压缩与性能优先级调度，海量要素依旧保持实时帧率。',
    tags: ['Worker 解码', 'meshopt', 'LOD 调度'],
  },
];

const ARCH_NODES = [
  { name: 'Style / 瓦片源', sub: 'MapLibre Style JSON · MVT PBF · Terrain-RGB' },
  { name: 'Worker 解析', sub: '异步解码 · 几何三角化 · Glyph 排版' },
  { name: '瓦片调度', sub: 'LOD 选取 · 缓存复用 · 优先级加载' },
  { name: 'GPU 渲染', sub: 'Babylon.js Scene · 实例化 · 雾效融合' },
];

const API_CARDS = [
  {
    name: 'BabylonTerrainPrimitive',
    kind: '核心图元',
    desc: '一行代码把整个地球接入场景。传入 MapLibre Style 即自动完成瓦片请求、解析与渲染，readyPromise 就绪后即可交互。',
    code: "const globe = new BabylonVectorTile.\n  BabylonTerrainPrimitive({\n    scene,\n    style: 'https://tiles.openfreemap.org/styles/bright',\n  });\nawait globe.readyPromise;",
  },
  {
    name: 'GeospatialCamera',
    kind: '地理相机',
    desc: '专为行星尺度设计的相机：支持 yaw / pitch / 缩放、大世界渲染精度、贴地裁剪（GeospatialClippingBehavior）与地形碰撞。',
    code: "const camera = new BABYLON.GeospatialCamera(\n  'geo', scene, { planetRadius: 6378137 }\n);\ncamera.fovMode =\n  BABYLON.Camera.FOVMODE_VERTICAL_FIXED;\ncamera.attachControl(canvas, true);",
  },
  {
    name: 'VectorTileExtension',
    kind: '调试扩展',
    desc: '内置可视化调试工具集：矢量 / 影像 / 地形瓦片坐标叠加、图层顺序管理、高度纹理检查，调优体验一目了然。',
    code: "// 瓦片坐标调试\nprimitive.showVectorCoords = true;\nprimitive.showTerrainCoords = true;\n\n// 图层顺序\nmap.getLayersOrder();",
  },
];

const QUICKSTART_HTML = `<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="/libs/BabylonVectorTile-min.js"></script>`;

const QUICKSTART_JS = `const canvas = document.getElementById('globe');
const engine = new BABYLON.Engine(canvas, true, {
  useLargeWorldRendering: true,
});
const scene = new BABYLON.Scene(engine);
scene.useRightHandedSystem = true;

// 地理空间相机 —— WGS84 椭球
const camera = new BABYLON.GeospatialCamera('geo', scene, {
  planetRadius: 6378137,
});
camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
camera.attachControl(canvas, true);

// 一行接入全球矢量底图
const globe = new BabylonVectorTile.BabylonTerrainPrimitive({
  scene,
  style: 'https://tiles.openfreemap.org/styles/bright',
});
await globe.readyPromise;

engine.runRenderLoop(() => scene.render());`;

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
      // 在普通片段中继续切分关键字 / 数字 / 调用
      const re = /(\b(?:const|let|await|async|new|function|return|true|false)\b|\b\d+(?:\.\d+)?\b|\.\w+(?=\()|\w+(?=\())/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        if (m.index > last) tokens.push({ t: text.slice(last, m.index) });
        const w = m[0];
        if (/^\d/.test(w)) tokens.push({ t: w, c: 'n' });
        else if (KEYWORDS.has(w)) tokens.push({ t: w, c: 'k' });
        else if (w.startsWith('.')) tokens.push({ t: w, c: 'f' });
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

/* ─────────────────────────── 页面组件 ─────────────────────────── */

export default function BabylonHomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [navSolid, setNavSolid] = useState(false);
  const [sceneState, setSceneState] = useState<'loading' | 'ready' | 'failed'>('loading');

  /* ── Hero 实时地球 ── */
  useEffect(() => {
    if (sceneState !== 'loading') return;
    let disposed = false;
    let engine: any = null;

    const scripts = [
      'https://cdn.babylonjs.com/babylon.js',
      'https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js',
      'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js',
      'https://cdn.babylonjs.com/addons/babylonjs.addons.min.js',
      '/libs/BabylonVectorTile-min.js',
    ];

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === scripts.length) requestAnimationFrame(initHero);
    };

    const tag = (src: string) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = onLoad;
      s.onerror = onLoad;
      document.head.appendChild(s);
    };

    async function initHero() {
      if (disposed) return;
      const canvas = canvasRef.current;
      if (!canvas || typeof BABYLON === 'undefined' || typeof BabylonVectorTile === 'undefined') {
        setSceneState('failed');
        return;
      }
      try {
        engine = new BABYLON.Engine(canvas, true, {
          useLargeWorldRendering: true,
          alpha: true,
          stencil: false,
        });
        const scene = new BABYLON.Scene(engine, {
          useGeometryUniqueIdsMap: true,
          useMaterialMeshMap: true,
        });
        scene.useRightHandedSystem = true;
        // 透明底 —— 让 CSS 星空透出来
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        scene.performancePriority = BABYLON.ScenePerformancePriority.Intermediate;

        const pickPredicate = (mesh: any) => BABYLON.Tags.HasTags(mesh, 'pickable');
        const camera = new BABYLON.GeospatialCamera('heroGeo', scene, {
          planetRadius: 6378137,
          pickPredicate,
        });
        camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
        camera.attachControl(canvas, true);
        const clipping = new BABYLON.GeospatialClippingBehavior();
        camera.addBehavior(clipping);

        // ── 首页展示模式：仅允许左右旋转，禁止一切缩放 ──
        // 半径上下限锁为当前值，滚轮 / 双指捏合 / 双击定位都无法缩放，
        // 避免拉近后瓦片换级加载造成"瓦片消失"的观感问题
        try {
          const displayRadius = camera.radius;
          camera.limits.radiusMin = displayRadius;
          camera.limits.radiusMax = displayRadius;
        } catch { /* limits 不可用时退化为默认行为 */ }
        // 彻底移除内建指针/滚轮/键盘输入：其拖拽、双击、捏合语义与
        // "绕自转轴左右转"不符，且内部会重算 center 导致视角漂移。
        // 拖拽由下方自行映射为 center 经度旋转，滚轮则滚动页面。
        try {
          Object.values(camera.inputs.attached).forEach((inp: any) => {
            const cls = inp?.getClassName?.() ?? '';
            if (/PointersInput|MouseWheel|Keyboard/i.test(cls)) {
              camera.inputs.remove(inp);
            }
          });
        } catch { /* noop */ }
        try { camera.yaw = 0; camera.pitch = 0; } catch { /* noop */ }

        // 初始注视点：东经 105°、赤道（本相机约定 Z 轴为极轴，赤道面为 XY）
        try {
          const lon0 = (105 * Math.PI) / 180;
          camera.center = {
            x: 6378137 * Math.cos(lon0),
            y: 6378137 * Math.sin(lon0),
            z: 0,
          };
        } catch { /* noop */ }

        // ── 绕地球自转轴的经度旋转（真正的"左右转"）──
        // center 沿赤道（z=0 平面）绕 Z 极轴转动：经度连续变化、极轴恒定朝上，
        // 也不会触发 wb() 的 ±85.05° 纬度钳制（内部 _setOrientation 会调用它）
        const scratch = new BABYLON.Vector3();
        const rotateCenterLon = (angle: number) => {
          const c = camera.center;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          // 注意:center getter 返回内部向量,须先读完再经 setter 写回
          scratch.set(
            c.x * cos - c.y * sin,
            c.x * sin + c.y * cos,
            c.z,
          );
          camera.center = scratch;
        };

        // 自动巡航：拖拽进行中暂停，松手约 3 秒后恢复
        let pointerDown = false;
        let lastX = 0;
        let resumeAt = 0;
        const onPointerDown = (e: PointerEvent) => {
          pointerDown = true;
          lastX = e.clientX;
        };
        const onPointerMove = (e: PointerEvent) => {
          if (!pointerDown) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          // 右拖 → 表面跟手向右 → 注视点向西
          if (dx) rotateCenterLon(-dx * 0.004);
        };
        const onPointerUp = () => {
          pointerDown = false;
          resumeAt = performance.now() + 3000;
        };
        canvas.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        // 离屏暂停渲染
        let heroVisible = true;
        const io = new IntersectionObserver((entries) => {
          heroVisible = entries[0]?.isIntersecting ?? true;
        }, { threshold: 0.02 });
        io.observe(canvas);

        const onResize = () => engine.resize();
        window.addEventListener('resize', onResize);

        engine.runRenderLoop(() => {
          if (!heroVisible) return;
          if (!pointerDown && performance.now() > resumeAt) {
            try {
              // 基于时间的自转：0.14 rad/s ≈ 8°/秒（约 45 秒一圈），与帧率无关；
              // dt 上限 0.25s 防止标签页挂起后跳变；负号 = 表面向右流动（地球自转方向）
              const dt = Math.min(engine.getDeltaTime() / 1000, 0.25);
              rotateCenterLon(-0.14 * dt);
            } catch { /* 忽略巡航失败 */ }
          }
          scene.render();
        });

        const globe = new BabylonVectorTile.BabylonTerrainPrimitive({
          scene,
          style: 'https://tiles.openfreemap.org/styles/bright',
        });
        await globe.readyPromise;
        if (!disposed) setSceneState('ready');
      } catch {
        if (!disposed) setSceneState('failed');
      }
    }

    scripts.forEach(tag);
    return () => {
      disposed = true;
      try { engine?.dispose?.(); } catch { /* noop */ }
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
          <Link href="/demo/babylon/" className={styles.brand}>
            <LogoMark />
            <span>Babylon<b>VectorTile</b></span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#features">特性</a>
            <a href="#architecture">架构</a>
            <a href="#quickstart">快速开始</a>
            <a href="#api">API</a>
          </div>
          <Link href="/demo/babylon/playground/" className={styles.navCta}>
            在线体验
            <IconArrow />
          </Link>
        </div>
      </nav>

      {/* ══════════ Hero：实时地球 ══════════ */}
      <header className={styles.hero}>
        <canvas ref={canvasRef} className={styles.heroCanvas} />
        <div className={styles.heroScrim} aria-hidden />

        {sceneState === 'loading' && (
          <div className={styles.heroLoading} aria-hidden>
            <span className={styles.loaderRing} />
            <span>正在初始化渲染引擎…</span>
          </div>
        )}

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.pulseDot} aria-hidden />
            Babylon.js 原生插件 · 开放瓦片生态
          </div>
          <h1 className={styles.heroTitle}>
            让 Babylon.js
            <br />
            拥有<span className={styles.gradText}>真实的地球</span>
          </h1>
          <p className={styles.heroSub}>
            BabylonVectorTile 将完整的矢量瓦片渲染管线带入 WebGL 世界 ——
            矢量底图、3D 建筑、全球地形与影像，在你的场景里实时旋转。
          </p>
          <div className={styles.heroActions}>
            <a href="#quickstart" className={styles.btnPrimary}>
              快速开始
              <IconArrow />
            </a>
            <Link href="/demo/babylon/playground/" className={styles.btnGhost}>
              进入在线体验
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statChip}><b>WGS84</b><span>椭球坐标系</span></div>
            <div className={styles.statChip}><b>MVT</b><span>矢量瓦片</span></div>
            <div className={styles.statChip}><b>Terrain</b><span>全球高程</span></div>
            <div className={styles.statChip}><b>WebGL</b><span>实时渲染</span></div>
          </div>
        </div>

        <div className={styles.dragHint} aria-hidden>
          <span className={styles.pulseDot} />按住左右拖动 · 环游地球
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
            {['OpenFreeMap', 'OpenStreetMap', 'MapTiler', 'Protomaps', 'Mapbox Style', '自定义瓦片服务'].map((n) => (
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
            <h2 className={styles.secTitle}>一个图元，装下整个星球</h2>
            <p className={styles.secDesc}>
              从瓦片请求到像素上屏的完整管线，全部封装为一个 Babylon.js 图元。
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

      {/* ══════════ 渲染架构 ══════════ */}
      <section className={styles.section} id="architecture">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>ARCHITECTURE</span>
            <h2 className={styles.secTitle}>从一条 PBF，到一颗星球</h2>
            <p className={styles.secDesc}>
              数据与渲染彻底解耦：解析在 Worker 中异步完成，主线程只负责把几何体送上 GPU。
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
            <b>为什么快？</b>
            <span>
              瓦片解码不阻塞渲染线程；几何缓冲按唯一 ID 复用；配合 Babylon.js 场景性能优先级，
              在中端设备上也能流畅滚动整个地球。
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ 快速开始 ══════════ */}
      <section className={styles.section} id="quickstart">
        <div className={styles.container}>
          <div className={`${styles.secHead} revealItem`}>
            <span className={styles.eyebrow}>QUICK START</span>
            <h2 className={styles.secTitle}>三分钟，点亮你的第一颗地球</h2>
            <p className={styles.secDesc}>
              无需构建配置，引入脚本即可运行；也完全兼容 npm 工程与打包器。
            </p>
          </div>
          <div className={styles.codeGrid}>
            <div className="revealItem">
              <p className={styles.codeStep}><b>01</b> 引入渲染引擎与插件</p>
              <CodeBlock code={QUICKSTART_HTML} lang="html" filename="index.html" />
            </div>
            <div className="revealItem">
              <p className={styles.codeStep}><b>02</b> 创建场景与地球</p>
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
            <h2 className={styles.secTitle}>克制而完整的接口面</h2>
            <p className={styles.secDesc}>
              三个核心对象覆盖绝大多数场景，深入定制也留有余地。
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
            <h2>现在，就在浏览器里转动地球</h2>
            <p>打开在线体验，亲手拖拽一颗由矢量瓦片构成的星球。</p>
            <div className={styles.ctaActions}>
              <Link href="/demo/babylon/playground/" className={styles.btnPrimary}>
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
              <span>Babylon<b>VectorTile</b></span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#features">特性</a>
              <a href="#quickstart">快速开始</a>
              <Link href="/demo/babylon/playground/">在线体验</Link>
              <a href="https://github.com/catnuko" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <p className={styles.footerNote}>
            © {new Date().getFullYear()} catnuko · 基于 Babylon.js 构建 · 瓦片服务由 OpenFreeMap 提供
          </p>
        </div>
      </footer>
    </div>
  );
}
