import Link from 'next/link';
import { getNavigationConfig } from '@/lib';
import { DarkModeToggle } from '@/components';

export default async function Header() {
  // Get navigation config from ConfigCat
  const navConfig = await getNavigationConfig();

  return (
    <header className="w-full theme-banner-bg theme-banner-border border-b shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <h1 className="text-6xl font-bold theme-banner-text font-[family-name:var(--font-tangerine)] [font-weight:700] [-webkit-text-stroke:0.5px_currentColor]">
            Culpepper.info
          </h1>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            {navConfig.tree && (
              <Link
                href="/tree"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
              >
                Family Tree
              </Link>
            )}
            {navConfig.history && (
              <Link
                href="/history"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
              >
                History
              </Link>
            )}
            {navConfig.people && (
              <Link
                href="/people"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
              >
                People
              </Link>
            )}
            {navConfig.acknowledgements && (
              <Link
                href="/acknowledgements"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
              >
                Credits
              </Link>
            )}
            {navConfig.about && (
              <Link
                href="/about"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
              >
                About
              </Link>
            )}
            {navConfig.practice && (
              <Link
                href="/practice"
                className="theme-banner-text theme-banner-text-hover transition-colors font-medium hidden lg:block"
              >
                Practice
              </Link>
            )}
          </nav>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
