'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';

function CircleDemo() {
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    const VectorTileExtension = (window as any).VectorTileExtension;

    (async () => {
      const viewer = await initViewer();

      const collection = new VectorTileExtension.SymbolStyleCollection({
        viewer,
        geoway: false,
        style: {
          version: 8,
          layers: [
            {
              id: 'earthquakes-layer',
              type: 'circle',
              source: 'earthquakes',
              paint: {
                'circle-radius': 4,
                'circle-stroke-width': 2,
                'circle-color': 'red',
                'circle-stroke-color': 'white',
              },
            },
          ],
          sources: {
            earthquakes: {
              type: 'geojson',
              data: 'https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson',
            },
          },
        },
      });
      await collection.readyPromise;

      viewer.camera.setView({
        destination: new Cesium.Cartesian3(
          -2841982.232442901,
          -5327634.30373213,
          4228335.474604643,
        ),
        orientation: new Cesium.HeadingPitchRoll(
          0.16538490664104977,
          -1.5687932091981316,
          0,
        ),
      });
    })();
  }, []);

  return <DemoNav current="/demo/cesium/circle" />;
}

export default function Page() {
  return (
    <CesiumLoader>
      <CircleDemo />
    </CesiumLoader>
  );
}
