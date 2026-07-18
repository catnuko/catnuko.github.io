'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

const DEMO_ROUTES = ['/demo'];

const isDemoPath = (path: string | null): boolean => {
  if (!path) return false;
  return DEMO_ROUTES.some((route) => path.startsWith(route));
};

export const ConditionalHeader = () => {
  const pathname = usePathname();
  if (isDemoPath(pathname)) return null;
  return <Header />;
};

export const ConditionalFooter = () => {
  const pathname = usePathname();
  if (isDemoPath(pathname)) return null;
  return <Footer />;
};
