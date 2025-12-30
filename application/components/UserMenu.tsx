'use client';

import { useAuth } from '@/lib/auth';

export default function UserMenu() {
  const { user, signOut } = useAuth();

  // Always show the button, but disable if not logged in
  return (
    <button
      onClick={async () => {
        if (!user) return;
        try {
          await signOut();
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }}
      className="w-full px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-left text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
      disabled={!user}
    >
      Sign Out
    </button>
  );
}
