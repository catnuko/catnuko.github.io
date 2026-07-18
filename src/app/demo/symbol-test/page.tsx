'use client';

import { useEffect } from 'react';

export default function SymbolTestPage() {
  useEffect(() => {
    // ─── 2-5. 全局脚本 ───
    const scripts = [
      'https://cesium.com/downloads/cesiumjs/releases/1.143/Build/Cesium/Cesium.js',
      // 'https://cdn.bootcdn.net/ajax/libs/Turf.js/6.5.0/turf.min.js',
      // 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.min.js',
      '/libs/VectorTileExtension-min.js',
    ];

    // ─── 资源加载计数器 ───
    let loadedCount = 0;
    const total = scripts.length + 1; // 1 CSS + 4 JS

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === total) {
        initApp();
      }
    };

    // ─── 1. Cesium CSS ───
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cesium.com/downloads/cesiumjs/releases/1.143/Build/Cesium/Widgets/widgets.css';
    link.onload = onLoad;
    link.onerror = onLoad;
    document.head.appendChild(link);


    scripts.forEach((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = onLoad;
      s.onerror = onLoad;
      document.body.appendChild(s);
    });

    // ─── 初始化（所有资源就绪后执行） ───
    async function initApp() {
      const Cesium = (window as any).Cesium;
      const dat = (window as any).dat;
      const VectorTileExtension = (window as any).VectorTileExtension;

      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NzI3MDQ0MS1kMTc3LTRmMDEtYWQzOS04MmU2ZGQyZmY3MGYiLCJpZCI6Mjk5MjQsImlhdCI6MTcyNjcyNjc5MH0.qvFPIHN8Nu61zlfxD8aHRTZG0BzLRqexZclJjl5GBHQ';
      const viewer = new Cesium.Viewer('cesiumContainer', {
        useBrowserRecommendedResolution: false,
      });
      viewer.scene.globe.depthTestAgainstTerrain = true;
      (window as any).viewer = viewer;
      viewer.imageryLayers.removeAll();

      // https://server.arcgisonline.com/arcgis/rest/services?f=pjson
      const arcgisImage = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
      )
      viewer.imageryLayers.addImageryProvider(arcgisImage)

      const collection = new VectorTileExtension.SymbolStyleCollection({
        viewer,
        clampTo3DTile: false,
        geoway: false,
      });
      await collection.readyPromise;

      const style = await collection.addStyleUrl(
        'https://tiles.openfreemap.org/styles/bright'
      );

      // // ─── 点击交互 ───
      // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      // handler.setInputAction((movement: any) => {
      //   const picked = viewer.scene.pick(movement.position);
      //   console.log('Picked:', picked);

      //   if (picked?.primitive?.tile?.buckets) {
      //     const keys = Object.keys(picked.primitive.tile.buckets);
      //     if (keys.length > 0) {
      //       const bucketName = keys[0];
      //       const instance =
      //         picked.primitive.tile.buckets[bucketName].symbolInstances.get(
      //           picked.primitive.instanceIndex
      //         );
      //       console.log('Cross Tile ID:', instance?.crossTileID);
      //     }
      //   }
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // // ─── dat.GUI ───
      // const gui = new dat.GUI({ width: 260 });
      // const params = { 显隐: true };
      // gui.add(params, '显隐').name('注记显隐').onChange((v: boolean) => {
      //   style.show = v;
      // });

      // // ─── 飞到一个位置 ───
      // viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 150000),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0),
      //     pitch: Cesium.Math.toRadians(-60),
      //     roll: 0,
      //   },
      //   duration: 2,
      // });
    }
  }, []);

  return (
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
  );
}
