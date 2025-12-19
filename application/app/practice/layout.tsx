import { checkRouteAccess } from '@lib';

export default async function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkRouteAccess('practice');
  return <>{children}</>;
}
