import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BabylonVectorTile — 让 Babylon.js 拥有真实的地球',
  },
  description:
    'Babylon.js 原生矢量瓦片渲染插件：MVT 矢量底图、3D 建筑、全球地形与影像图层，基于 WGS84 地理空间相机实时渲染。',
};

export default function BabylonHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
