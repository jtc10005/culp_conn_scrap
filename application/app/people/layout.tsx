import { checkRouteAccess } from '@lib';

export default async function PeopleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkRouteAccess('people');
  return <>{children}</>;
}
