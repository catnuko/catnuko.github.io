// 可复用：创建并配置 Cesium Viewer（对应参考 demos 的 other.js initViewer）。
// 公开 CDN 适配：默认底图使用 ArcGIS World Imagery（公开可用），
// 去掉了参考里失效的内网 WMTS 地址。

export interface InitViewerOptions {
  /** 跳过默认底图（hillshade 需要纯白地形 + 着色器，不能盖底图） */
  skipBase?: boolean;
  /** 挂载 Cesium Inspector 调试面板 */
  inspector?: boolean;
  /** 透传给 Cesium.Viewer 的额外选项 */
  viewerOptions?: Record<string, unknown>;
}

export async function initViewer(options: InitViewerOptions = {}) {
  const Cesium = (window as any).Cesium;

  const viewer = new Cesium.Viewer('cesiumContainer', {
    useBrowserRecommendedResolution: false,
    ...(options.viewerOptions || {}),
  });

  viewer.imageryLayers.removeAll();

  if (!options.skipBase) {
    const provider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
    );
    viewer.imageryLayers.addImageryProvider(provider);
  }

  if (options.inspector) {
    viewer.extend(Cesium.viewerCesiumInspectorMixin);
  }

  viewer.scene.globe.depthTestAgainstTerrain = true;
  (window as any).viewer = viewer;
  return viewer;
}
