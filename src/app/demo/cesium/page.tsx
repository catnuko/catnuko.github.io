'use client';

import { useEffect } from 'react';
import CesiumLoader from './shared/CesiumLoader';
import { initViewer } from './shared/initViewer';
import DemoNav from './shared/DemoNav';

function SymbolTestDemo() {
  useEffect(() => {
    const VectorTileExtension = (window as any).VectorTileExtension;

    (async () => {
      const viewer = await initViewer();

      const collection = new VectorTileExtension.SymbolStyleCollection({
        viewer,
        clampTo3DTile: false,
        geoway: false,
      });
      await collection.readyPromise;

      await collection.addStyleUrl('https://tiles.openfreemap.org/styles/bright');
    })();
  }, []);

  return <DemoNav current="/demo/cesium" />;
}

export default function Page() {
  return (
    <CesiumLoader>
      <SymbolTestDemo />
    </CesiumLoader>
  );
}
