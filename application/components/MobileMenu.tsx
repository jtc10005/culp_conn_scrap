'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';

interface MobileMenuProps {
  navConfig: {
    tree?: boolean;
    history?: boolean;
    people?: boolean;
    bulletinBoard?: boolean;
    acknowledgements?: boolean;
    about?: boolean;
    practice?: boolean;
  };
  navLinkFontClasses: string;
}

export default function MobileMenu({ navConfig, navLinkFontClasses }: MobileMenuProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="theme-banner-text theme-banner-text-hover transition-colors p-2 rounded-lg hover:bg-black/20"
        aria-label="Menu"
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 theme-bg-secondary rounded-lg theme-shadow-lg theme-border border py-2 z-50">
          {/* Navigation Links */}
          <div className="px-2">
            {navConfig.tree && (
              <Link
                href="/tree"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                Family Tree
              </Link>
            )}
            {navConfig.history && (
              <Link
                href="/history"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                History
              </Link>
            )}
            {navConfig.people && (
              <Link
                href="/people"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                People
              </Link>
            )}
            {navConfig.bulletinBoard && (
              <Link
                href="/bulletin-board"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                Bulletin Board
              </Link>
            )}
            {navConfig.acknowledgements && (
              <Link
                href="/acknowledgements"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                Credits
              </Link>
            )}
            {navConfig.about && (
              <Link
                href="/about"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                About
              </Link>
            )}
            {navConfig.practice && (
              <Link
                href="/practice"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg theme-text-primary hover:theme-bg-tertiary transition-colors ${navLinkFontClasses}`}
              >
                Practice
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="my-2 theme-border-dark border-t"></div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full px-4 py-3 flex items-center justify-between hover:theme-bg-tertiary transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 theme-text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 theme-text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              )}
              <span className="text-sm theme-text-primary">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            {/* Toggle Switch */}
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'transform translate-x-5' : ''
                }`}
              />
            </div>
          </button>

          {/* Sign Out (if user is logged in) */}
          {user && (
            <>
              <div className="my-2 theme-border-dark border-t"></div>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    closeMenu();
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:theme-bg-tertiary transition-colors text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 theme-text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <span className="text-sm theme-text-primary">Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
