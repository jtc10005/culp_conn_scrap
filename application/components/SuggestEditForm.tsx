'use client';

import { useState } from 'react';
import type { PersonWithRelations, PersonChanges } from '@/lib/types';

type SuggestEditFormProps = {
  person: PersonWithRelations;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SuggestEditForm({ person, onClose, onSuccess }: SuggestEditFormProps) {
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [changes, setChanges] = useState<PersonChanges>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: keyof PersonChanges, value: string) => {
    setChanges((prev) => ({
      ...prev,
      [field]: value.trim() || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if there are any changes
    const hasChanges = Object.values(changes).some((val) => val !== undefined);
    if (!hasChanges) {
      setError('Please make at least one change');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/edits/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_id: person.id,
          submitted_by: email,
          changes,
          submitter_notes: notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit edit');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit edit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto theme-border border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold theme-text-primary">Suggest Edit</h2>
          <button
            onClick={onClose}
            className="theme-text-secondary hover:theme-text-primary text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="theme-text-secondary mb-4">
          Suggest corrections or additions to this person&apos;s information. Your submission will
          be reviewed before being applied.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block font-medium theme-text-primary mb-1">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Editable Fields */}
          <div className="space-y-3">
            <h3 className="font-semibold theme-text-primary">Edit Information:</h3>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm theme-text-secondary mb-1">First Name</label>
                <input
                  type="text"
                  defaultValue={person.firstName || ''}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                />
              </div>
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Middle Name</label>
                <input
                  type="text"
                  defaultValue={person.middleName || ''}
                  onChange={(e) => handleFieldChange('middleName', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                />
              </div>
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Last Name</label>
                <input
                  type="text"
                  defaultValue={person.lastName || ''}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Birth Date</label>
                <input
                  type="text"
                  defaultValue={person.birth || ''}
                  onChange={(e) => handleFieldChange('birth', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                  placeholder="e.g., 15 Jan 1850"
                />
              </div>
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Birth Place</label>
                <input
                  type="text"
                  defaultValue={person.birthPlace || ''}
                  onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                  placeholder="e.g., Virginia, USA"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Death Date</label>
                <input
                  type="text"
                  defaultValue={person.death || ''}
                  onChange={(e) => handleFieldChange('death', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                  placeholder="e.g., 20 Mar 1920"
                />
              </div>
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Death Place</label>
                <input
                  type="text"
                  defaultValue={person.deathPlace || ''}
                  onChange={(e) => handleFieldChange('deathPlace', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                  placeholder="e.g., Texas, USA"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Burial Date</label>
                <input
                  type="text"
                  defaultValue={person.burial || ''}
                  onChange={(e) => handleFieldChange('burial', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                />
              </div>
              <div>
                <label className="block text-sm theme-text-secondary mb-1">Burial Place</label>
                <input
                  type="text"
                  defaultValue={person.burialPlace || ''}
                  onChange={(e) => handleFieldChange('burialPlace', e.target.value)}
                  className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
                />
              </div>
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <label htmlFor="notes" className="block font-medium theme-text-primary mb-1">
              Explanation (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded theme-bg-primary theme-text-primary theme-border"
              placeholder="Why are you suggesting these changes? Include sources if available."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded theme-text-secondary hover:theme-bg-primary theme-border"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: 'var(--heritage-primary)', color: 'white' }}
              className="px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
