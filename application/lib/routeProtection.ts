import { notFound } from 'next/navigation';
import { getNavigationConfig, NavigationConfig } from './featureFlags';
import { ReactElement } from 'react';

/**
 * Check if a route is enabled via feature flags
 * Throws notFound() if the route is disabled
 */
export async function checkRouteAccess(routeKey: keyof NavigationConfig): Promise<void> {
  const navConfig = await getNavigationConfig();
  
  if (!navConfig[routeKey]) {
    notFound();
  }
}

/**
 * Higher-order function to protect a page component with feature flag check
 */
export function withRouteProtection<P extends object>(
  routeKey: keyof NavigationConfig,
  PageComponent: (props: P) => Promise<ReactElement> | ReactElement
) {
  return async function ProtectedPage(props: P) {
    await checkRouteAccess(routeKey);
    return PageComponent(props);
  };
}
