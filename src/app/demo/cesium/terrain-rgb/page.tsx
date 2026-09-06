'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';

function TerrainRgbDemo() {
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    const VectorTileExtension = (window as any).VectorTileExtension;
    const dat = (window as any).dat;

    (async () => {
      const viewer = await initViewer();

      const maplibre = "https://demotiles.maplibre.org/terrain-tiles/tiles.json"
      const provider = await VectorTileExtension.TerrainRGBProvider.fromUrl(maplibre, {
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        zOffset: 0,
        tileSize: 512
      })
      viewer.terrainProvider = provider;
      viewer.camera.setView({
        destination: new Cesium.Cartesian3(4360666.73559397, 877857.4340475124, 4767788.51804),
        orientation: new Cesium.HeadingPitchRoll(0.03406336073690763, -1.4201912416000768, 0.0004336366412127646)
      })
    })();
  }, []);

  return <DemoNav current="/demo/cesium/terrain-rgb" />;
}

export default function Page() {
  return (
    <CesiumLoader withGui>
      <TerrainRgbDemo />
    </CesiumLoader>
  );
}
