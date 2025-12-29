import Link from 'next/link';
import { getNavigationConfig, getCalligraphicFontEnabled } from '@/lib';
import { DarkModeToggle } from '@/components';
import MobileMenu from './MobileMenu';

export default async function Header() {
  // Get navigation config and font setting from ConfigCat
  const navConfig = await getNavigationConfig();
  const useCalligraphicFont = await getCalligraphicFontEnabled();

  // Define font classes based on feature flag
  const titleFontClasses = useCalligraphicFont
    ? 'font-[family-name:var(--font-tangerine)] [font-weight:700] [-webkit-text-stroke:0.5px_currentColor]'
    : 'font-bold';

  const navLinkFontClasses = useCalligraphicFont
    ? 'font-[family-name:var(--font-tangerine)] text-4xl [font-weight:700]'
    : 'font-medium';

  return (
    <header className="w-full theme-banner-bg theme-banner-border border-b shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <h1 className={`text-4xl md:text-6xl theme-banner-text ${titleFontClasses}`}>
            Culpepper.info
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6">
            {navConfig.tree && (
              <Link
                href="/tree"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                Family Tree
              </Link>
            )}
            {navConfig.history && (
              <Link
                href="/history"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                History
              </Link>
            )}
            {navConfig.people && (
              <Link
                href="/people"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                People
              </Link>
            )}
            {navConfig.bulletinBoard && (
              <Link
                href="/bulletin-board"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                Bulletin Board
              </Link>
            )}
            {navConfig.acknowledgements && (
              <Link
                href="/acknowledgements"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                Credits
              </Link>
            )}
            {navConfig.about && (
              <Link
                href="/about"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                About
              </Link>
            )}
            {navConfig.practice && (
              <Link
                href="/practice"
                className={`theme-banner-text theme-banner-text-hover transition-colors ${navLinkFontClasses}`}
              >
                Practice
              </Link>
            )}
          </nav>

          {/* Desktop Dark Mode Toggle */}
          <div className="hidden lg:block">
            <DarkModeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu navConfig={navConfig} navLinkFontClasses={navLinkFontClasses} />
          </div>
        </div>
      </div>
    </header>
  );
}
