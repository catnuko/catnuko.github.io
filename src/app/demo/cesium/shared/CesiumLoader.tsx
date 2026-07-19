'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  CESIUM_CDN_CSS,
  CESIUM_CDN_JS,
  CESIUM_BASE_URL,
  ION_TOKEN,
  VECTOR_TILE_EXTENSION_JS,
  DAT_GUI_CDN,
} from './cesiumConfig';

interface CesiumLoaderProps {
  children?: ReactNode;
  /** 是否需要 dat.gui（heatmap / terrain-rgb / baimo 用到） */
  withGui?: boolean;
}

/**
 * 可复用：从 CDN 加载 Cesium + VectorTileExtension（可选 dat.gui）。
 * 所有资源就绪后才渲染 children；children 内部可安全使用
 * window.Cesium / window.VectorTileExtension / window.dat 等全局变量。
 */
export default function CesiumLoader({ children, withGui = false }: CesiumLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 热更新等场景下若已加载则直接复用，避免重复注入脚本
    if ((window as any).Cesium && (window as any).VectorTileExtension) {
      (window as any).CESIUM_BASE_URL = CESIUM_BASE_URL;
      (window as any).Cesium.Ion.defaultAccessToken = ION_TOKEN;
      setReady(true);
      return;
    }

    const resources: { type: 'css' | 'js'; src: string }[] = [
      { type: 'css', src: CESIUM_CDN_CSS },
      { type: 'js', src: CESIUM_CDN_JS },
      { type: 'js', src: VECTOR_TILE_EXTENSION_JS },
    ];
    if (withGui) resources.push({ type: 'js', src: DAT_GUI_CDN });

    let loaded = 0;
    const total = resources.length;

    const onLoaded = () => {
      loaded += 1;
      if (loaded === total) {
        (window as any).CESIUM_BASE_URL = CESIUM_BASE_URL;
        (window as any).Cesium.Ion.defaultAccessToken = ION_TOKEN;
        setReady(true);
      }
    };

    resources.forEach(({ type, src }) => {
      if (type === 'css') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        link.onload = onLoaded;
        link.onerror = onLoaded;
        document.head.appendChild(link);
      } else {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = onLoaded;
        script.onerror = onLoaded;
        document.body.appendChild(script);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withGui]);

  return (
    <>
      <div
        id="cesiumContainer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          zIndex: 1,
        }}
      />
      {ready ? children : null}
    </>
  );
}
