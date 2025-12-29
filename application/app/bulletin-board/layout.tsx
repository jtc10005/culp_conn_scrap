import { checkRouteAccess } from '@/lib/routeProtection';

export default async function BulletinBoardLayout({ children }: { children: React.ReactNode }) {
  await checkRouteAccess('bulletinBoard');

  return <>{children}</>;
}
