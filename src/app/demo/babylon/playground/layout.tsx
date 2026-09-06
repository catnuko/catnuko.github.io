import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BabylonVectorTile · 在线体验',
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
