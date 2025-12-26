'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackHref?: string;
  fallbackText?: string;
}

export function BackButton({ fallbackHref = '/', fallbackText = 'Back' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check history length at click time - if > 2, there's a page to go back to
    // (1 is the current page, 2+ means there's previous pages)
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 hover:underline mb-4 inline-block theme-text-primary hover:opacity-80"
    >
      ← {fallbackText}
    </button>
  );
}
