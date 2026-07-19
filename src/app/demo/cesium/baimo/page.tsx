'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';
import { baimoStyle } from './baimoData';

function BaimoDemo() {
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    const VectorTileExtension = (window as any).VectorTileExtension;

    (async () => {
      const viewer = await initViewer();

      // OpenFreeMap 矢量瓦片 + 3D 建筑 fill-extrusion
      const primitive = new VectorTileExtension.VectorTilePrimitive({
        viewer,
        style: baimoStyle,
        geoway: false,
        debugSymbol: false,
        clampTo3DTile: false,
      });
      await primitive.readyPromise;

      // 定位到纽约曼哈顿，观察 3D 建筑
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-73.985, 40.748, 800),
        orientation: new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(-45),
          0,
        ),
      });

      // 点击拾取：在控制台打印被点中的建筑要素
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(
        (movement: any) => {
          const picked = primitive.pick(movement.position);
          if (!picked) return;
          console.log('picked', picked);
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK,
      );
    })();
  }, []);

  return <DemoNav current="/demo/cesium/baimo" />;
}

export default function Page() {
  return (
    <CesiumLoader>
      <BaimoDemo />
    </CesiumLoader>
  );
}
