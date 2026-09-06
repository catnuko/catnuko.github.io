'use client';

import Link from 'next/link';

const DEMOS = [
  { href: '/demo/cesium/', label: '官方页' },
  { href: '/demo/cesium/playground/', label: 'Playground' },
  { href: '/demo/cesium/heatmap/', label: 'Heatmap' },
  { href: '/demo/cesium/circle/', label: 'Circle' },
  { href: '/demo/cesium/mlt/', label: 'MLT' },
  { href: '/demo/cesium/terrain-rgb/', label: 'Terrain-RGB' },
  { href: '/demo/cesium/hillshade/', label: 'Hillshade' },
  { href: '/demo/cesium/baimo/', label: 'fill-extrusion' },
];

/** 轻量悬浮导航：回首页 + 兄弟示例互链，方便在演示间切换 */
export default function DemoNav({ current }: { current: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 10,
        background: 'rgba(20,20,20,0.72)',
        color: '#fff',
        padding: '8px 10px',
        borderRadius: 8,
        font: '12px/1.6 system-ui, sans-serif',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ opacity: 0.6, marginBottom: 4 }}>Cesium Demos</div>
      {DEMOS.map((d) => (
        <div key={d.href}>
          {d.href === current ? (
            <span style={{ color: '#4dd0e1', fontWeight: 600 }}>● {d.label}</span>
          ) : (
            <Link href={d.href} style={{ color: '#fff', textDecoration: 'none' }}>
              {d.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
