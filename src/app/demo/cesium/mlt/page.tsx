'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';

function MltDemo() {
  useEffect(() => {
    const VectorTileExtension = (window as any).VectorTileExtension;

    (async () => {
      const viewer = await initViewer();

      // MLT：新的矢量瓦片格式（类 MVT），由 VectorTileExtension 解析
      const primitive = new VectorTileExtension.VectorTilePrimitive({
        viewer,
        style: 'https://demotiles.maplibre.org/tiles-mlt/plain.json',
        geoway: false,
      });
      await primitive.readyPromise;
    })();
  }, []);

  return <DemoNav current="/demo/cesium/mlt" />;
}

export default function Page() {
  return (
    <CesiumLoader>
      <MltDemo />
    </CesiumLoader>
  );
}
