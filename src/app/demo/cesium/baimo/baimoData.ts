// 白模样式：加载 OpenFreeMap 矢量瓦片，渲染 3D 建筑为彩色 extrusion。
// 数据来源：https://tiles.openfreemap.org/planet（building 图层）

export const baimoStyle = {
  version: 8,
  sources: {
    openfreemap: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
    },
  },
  layers: [
    {
      id: '3d-buildings',
      source: 'openfreemap',
      'source-layer': 'building',
      type: 'fill-extrusion',
      minzoom: 11,
      filter: ['!=', ['get', 'hide_3d'], true],
      paint: {
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['get', 'render_height'],
          0,
          'lightgray',
          200,
          'royalblue',
          400,
          'lightblue',
        ],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          16,
          ['get', 'render_height'],
        ],
        'fill-extrusion-base': [
          'case',
          ['>=', ['get', 'zoom'], 16],
          ['get', 'render_min_height'],
          0,
        ],
      },
    },
  ],
};
