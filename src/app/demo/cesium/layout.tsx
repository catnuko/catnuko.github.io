import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'CesiumVectorTile — 让 Cesium 拥有 MapLibre 的灵魂',
  },
  description:
    'Cesium 原生矢量瓦片渲染插件：MVT/MLT 矢量底图、热力图、山体阴影、3D 建筑与 Terrain-RGB 实时地形，完整兼容 MapLibre Style 规范。',
};

export default function CesiumHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
