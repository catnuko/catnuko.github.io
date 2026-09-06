'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './playground.module.scss';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const BABYLON: any;
declare const BabylonVectorTile: any;

export default function BabylonPlaygroundPage() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ─── Babylon CDN 脚本 + 本地 BabylonVectorTile ───
    const scripts = [
      'https://cdn.babylonjs.com/babylon.js',
      'https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js',
      'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js',
      'https://cdn.babylonjs.com/inspector/babylon.inspector-v2.bundle.js',
      'https://cdn.babylonjs.com/addons/babylonjs.addons.min.js',
      '/libs/BabylonVectorTile-min.js',
    ];

    // ─── 资源加载计数器 ───
    let loadedCount = 0;
    const total = scripts.length;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === total) {
        // 延迟一帧确保所有模块完成初始化
        requestAnimationFrame(() => initApp());
      }
    };

    scripts.forEach((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = onLoad;
      s.onerror = onLoad;
      document.head.appendChild(s);
    });

    // ─── 初始化（所有脚本就绪后执行） ───
    async function initApp() {
      const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
      if (!canvas) return;

      const engine = new BABYLON.Engine(canvas, true, {
        useLargeWorldRendering: true,
      });

      const scene = new BABYLON.Scene(engine, {
        useGeometryUniqueIdsMap: true,
        useMaterialMeshMap: true,
        useClonedMeshMap: true,
      });
      scene.useRightHandedSystem = true;
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
      scene.performancePriority = BABYLON.ScenePerformancePriority.Intermediate;

      // ─── 摄像机 ───
      const pickPredicate = (mesh: any) =>
        BABYLON.Tags.HasTags(mesh, 'pickable');
      pickPredicate._userName = 'pick-position-from-depth';

      const camera = new BABYLON.GeospatialCamera('geo', scene, {
        planetRadius: 6378137,
        pickPredicate: pickPredicate,
      });
      camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
      camera.attachControl(canvas, true);

      const clippingBehavior = new BABYLON.GeospatialClippingBehavior();
      camera.addBehavior(clippingBehavior);
      camera.checkCollisions = true;

      // ─── 渲染循环 ───
      engine.runRenderLoop(() => scene.render());
      const onResize = () => engine.resize();
      window.addEventListener('resize', onResize);

      const terrain = new BabylonVectorTile.BabylonTerrainPrimitive({
        scene: scene,
        style: 'https://tiles.openfreemap.org/styles/bright',
      });
      await terrain.readyPromise;
    }
  }, []);

  return (
    <>
      <canvas
        id="renderCanvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          touchAction: 'none',
        }}
      />
      <Link href="/demo/babylon/" className={styles.backLink}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        返回介绍页
      </Link>
    </>
  );
}
