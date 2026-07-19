'use client';

import { useEffect } from 'react';
import CesiumLoader from '../shared/CesiumLoader';
import { initViewer } from '../shared/initViewer';
import DemoNav from '../shared/DemoNav';

function HeatmapDemo() {
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    const VectorTileExtension = (window as any).VectorTileExtension;
    const dat = (window as any).dat;

    (async () => {
      const viewer = await initViewer();

      const collection = new VectorTileExtension.SymbolStyleCollection({
        viewer,
        geoway: false,
        style: {
          version: 8,
          layers: [
            {
              id: 'earthquakes-heat',
              type: 'heatmap',
              source: 'earthquakes',
              paint: {
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                'heatmap-color': [
                  'interpolate', ['linear'], ['heatmap-density'],
                  0, 'rgba(33,102,172,0)',
                  0.2, 'rgb(103,169,207)',
                  0.4, 'rgb(209,229,240)',
                  0.6, 'rgb(253,219,199)',
                  0.8, 'rgb(239,138,98)',
                  1, 'rgb(178,24,43)',
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
              },
            },
            {
              id: 'earthquakes-point',
              type: 'circle',
              source: 'earthquakes',
              minzoom: 7,
              paint: {
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  7, ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                  16, ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50],
                ],
                'circle-color': [
                  'interpolate', ['linear'], ['get', 'mag'],
                  1, 'rgba(33,102,172,0)',
                  2, 'rgb(103,169,207)',
                  3, 'rgb(209,229,240)',
                  4, 'rgb(253,219,199)',
                  5, 'rgb(239,138,98)',
                  6, 'rgb(178,24,43)',
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
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

      // dat.gui 滑块：实时控制热力图透明度（作用于底层的 mapbox 样式）
      const gui = new dat.GUI();
      const params = { heatmapOpacity: 1 };
      gui
        .add(params, 'heatmapOpacity', 0, 1)
        .name('热力图透明度')
        .onChange((v: number) => {
          const map = collection.vectorTilePrimitive.map;
          map.setPaintProperty('earthquakes-heat', 'heatmap-opacity', v);
        });

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

  return <DemoNav current="/demo/cesium/heatmap" />;
}

export default function Page() {
  return (
    <CesiumLoader withGui>
      <HeatmapDemo />
    </CesiumLoader>
  );
}
