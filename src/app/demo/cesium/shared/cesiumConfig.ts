// 集中管理 Cesium 相关常量，方便统一替换（如 Ion token 失效时只需改这里）

// Cesium 版本（与现有 symbol-test 页保持一致）
export const CESIUM_VERSION = '1.143';

// Cesium 官方 CDN（脚本 + 样式 + 资源目录）
export const CESIUM_BASE_URL = `https://cesium.com/downloads/cesiumjs/releases/${CESIUM_VERSION}/Build/Cesium/`;
export const CESIUM_CDN_CSS = `${CESIUM_BASE_URL}Widgets/widgets.css`;
export const CESIUM_CDN_JS = `${CESIUM_BASE_URL}Cesium.js`;

// 项目自带的 VectorTileExtension 库（提供 SymbolStyleCollection / VectorTilePrimitive / TerrainRGBProvider）
export const VECTOR_TILE_EXTENSION_JS = '/libs/VectorTileExtension-min.js';

// dat.gui（部分示例的交互面板，按需加载）
export const DAT_GUI_CDN = 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.min.js';

// Cesium Ion token（公开 demo token；若地形/世界影像加载失败，请替换为自己的 token）
export const ION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NzI3MDQ0MS1kMTc3LTRmMDEtYWQzOS04MmU2ZGQyZmY3MGYiLCJpZCI6Mjk5MjQsImlhdCI6MTcyNjcyNjc5MH0.qvFPIHN8Nu61zlfxD8aHRTZG0BzLRqexZclJjl5GBHQ';
