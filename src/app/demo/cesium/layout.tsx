import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'CesiumVectorTileExtension',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
