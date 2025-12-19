import { FamilyTree } from '@/components';
import { checkRouteAccess } from '@lib';

export default async function TreePage() {
  await checkRouteAccess('tree');
  return <FamilyTree />;
}
