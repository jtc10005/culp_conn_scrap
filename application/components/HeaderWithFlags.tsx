'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getNavigationConfig, getCalligraphicFontEnabled } from '@/lib';
import { DarkModeToggle } from '@/components';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [navConfig, setNavConfig] = useState({
    tree: true,
    history: true,
    people: true,
    bulletinBoard: true,
    acknowledgements: true,
    practice: true,
    about: false,
  });
  const [useCalligraphicFont, setUseCalligraphicFont] = useState(false);

  useEffect(() => {
    getNavigationConfig().then(setNavConfig);
    getCalligraphicFontEnabled().then(setUseCalligraphicFont);
  }, []);

  const titleFontClasses = useCalligraphicFont
    ? 'font-[family-name:var(--font-tangerine)] [font-weight:700] [-webkit-text-stroke:0.5px_currentColor]'
    : 'font-bold';

  const navLinkFontClasses = useCalligraphicFont
    ? 'font-[family-name:var(--font-tangerine)] text-4xl [font-weight:700]'
    : 'font-medium';

  function SettingsDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="theme-banner-text theme-banner-text-hover transition-colors p-2 rounded-lg hover:bg-black/20"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 theme-bg-secondary rounded-lg theme-shadow-lg theme-border border py-2 z-50">
            <div className="px-4 py-2">
              <DarkModeToggle />
            </div>
            <div className="my-2 theme-border-dark border-t"></div>
            <div className="px-4 py-2">
              <UserMenu />
            </div>
          </div>
        )}
      </div>
    );
  }

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

          {/* Desktop Settings Dropdown */}
          <div className="hidden lg:block">
            <SettingsDropdown />
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
