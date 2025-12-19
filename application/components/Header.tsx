'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply dark mode class on mount and changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Close menu when clicking outside
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

  return (
    <header className="w-full theme-banner-bg theme-banner-border border-b shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <h1 className="text-3xl font-bold theme-banner-text">Culpepper.info</h1>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            <Link
              href="/tree"
              className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
            >
              Family Tree
            </Link>
            <Link
              href="/history"
              className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
            >
              History
            </Link>
            <Link
              href="/people"
              className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
            >
              People
            </Link>
            <Link
              href="/acknowledgements"
              className="theme-banner-text theme-banner-text-hover transition-colors font-medium"
            >
              Credits
            </Link>
          </nav>

          {/* Settings Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 theme-bg-secondary rounded-lg theme-shadow-lg theme-border border py-2 z-50">
                <div className="px-4 py-2 theme-border-dark border-b">
                  <p className="text-sm font-semibold theme-text-primary">Settings</p>
                </div>

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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
