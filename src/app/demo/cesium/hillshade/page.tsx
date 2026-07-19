'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';

function HillshadeDemo() {
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    const VectorTileExtension = (window as any).VectorTileExtension;

    (async () => {
      const viewer = await initViewer({ skipBase: true });
      viewer.scene.globe.baseColor = Cesium.Color.WHITE;

      // 构建包含 hillshade 的 MapLibre 风格样式
      const hillshadeStyle = {
        version: 8,
        sources: {
          hillshadeSource: {
            type: 'raster-dem',
            url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'hills-basic',
            type: 'hillshade',
            source: 'hillshadeSource',
            layout: { visibility: 'visible' },
            paint: {
              'hillshade-illumination-direction': 315,
              'hillshade-shadow-color': '#000000',
              'hillshade-highlight-color': '#FFFFFF',
              'hillshade-accent-color': '#000000',
              'hillshade-exaggeration': 0.5,
            },
          },
        ],
      };

      const collection = new VectorTileExtension.SymbolStyleCollection({
        viewer,
        geoway: false,
        style: hillshadeStyle,
      });
      await collection.readyPromise;

      // 定位到阿尔卑斯山区（同 hillshade-methods.html）
      viewer.camera.setView({
        destination: new Cesium.Cartesian3(
          4331994.7571711885,
          866135.7699682236,
          4786978.496548241,
        ),
        orientation: new Cesium.HeadingPitchRoll(
          0.002058620861252969,
          -1.5698832900257282,
          0,
        ),
      });
    })();
  }, []);

  return <DemoNav current="/demo/cesium/hillshade" />;
}

export default function Page() {
  return (
    <CesiumLoader>
      <HillshadeDemo />
    </CesiumLoader>
  );
}
