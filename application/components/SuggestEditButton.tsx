'use client';

import { useState } from 'react';
import { SuggestEditForm } from '@/components';
import type { PersonWithRelations } from '@/lib/types';

type SuggestEditButtonProps = {
  person: PersonWithRelations;
};

export default function SuggestEditButton({ person }: SuggestEditButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 rounded theme-border border theme-text-primary hover:opacity-80"
        style={{ backgroundColor: 'var(--heritage-primary)', color: 'white', border: 'none' }}
      >
        📝 Suggest Edit
      </button>

      {showSuccess && (
        <div className="fixed top-4 right-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded theme-shadow-lg z-50">
          ✅ Edit submitted successfully! It will be reviewed shortly.
        </div>
      )}

      {showForm && (
        <SuggestEditForm
          person={person}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
