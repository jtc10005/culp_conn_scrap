'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Person {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  birth?: string;
  birthPlace?: string;
  death?: string;
  deathPlace?: string;
}

function PeoplePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [firstName, setFirstName] = useState(searchParams.get('firstName') || '');
  const [middleName, setMiddleName] = useState(searchParams.get('middleName') || '');
  const [lastName, setLastName] = useState(searchParams.get('lastName') || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all people on mount for client-side filtering
  useEffect(() => {
    async function fetchPeople() {
      try {
        setLoading(true);
        // Fetch all people (no limit) for client-side filtering
        const response = await fetch('/api/people?limit=10000');
        if (!response.ok) {
          throw new Error('Failed to fetch people');
        }
        const data = await response.json();
        // API returns {people, count}
        const peopleList = data.people || [];
        setPeople(peopleList);
        // Don't set filteredPeople initially - require search first
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPeople();
  }, []);

  // Extracted search logic
  const performSearch = useCallback(
    (firstNameTerm: string, middleNameTerm: string, lastNameTerm: string) => {
      const firstLower = firstNameTerm.trim().toLowerCase();
      const middleLower = middleNameTerm.trim().toLowerCase();
      const lastLower = lastNameTerm.trim().toLowerCase();

      // Check if at least one field has input
      if (!firstLower && !middleLower && !lastLower) {
        setFilteredPeople([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      const filtered = people.filter((person) => {
        const personFirstName = person.firstName?.toLowerCase() || '';
        const personMiddleName = person.middleName?.toLowerCase() || '';
        const personLastName = person.lastName?.toLowerCase() || '';

        // All specified fields must match (AND logic)
        const firstNameMatch = !firstLower || personFirstName.includes(firstLower);
        const middleNameMatch = !middleLower || personMiddleName.includes(middleLower);
        const lastNameMatch = !lastLower || personLastName.includes(lastLower);

        return firstNameMatch && middleNameMatch && lastNameMatch;
      });

      setFilteredPeople(filtered);
      setIsSearching(false);
    },
    [people]
  );

  // Perform search on mount if URL params exist
  useEffect(() => {
    if (people.length > 0) {
      const firstNameParam = searchParams.get('firstName') || '';
      const middleNameParam = searchParams.get('middleName') || '';
      const lastNameParam = searchParams.get('lastName') || '';

      if (firstNameParam || middleNameParam || lastNameParam) {
        performSearch(firstNameParam, middleNameParam, lastNameParam);
      }
    }
  }, [people, searchParams, performSearch]);

  // Handle search when button is clicked
  const handleSearch = () => {
    // Update URL with search params
    const params = new URLSearchParams();
    if (firstName.trim()) params.set('firstName', firstName.trim());
    if (middleName.trim()) params.set('middleName', middleName.trim());
    if (lastName.trim()) params.set('lastName', lastName.trim());

    router.push(`/people${params.toString() ? `?${params.toString()}` : ''}`);

    // Perform the search
    performSearch(firstName, middleName, lastName);
  };

  // Handle clear all fields
  const handleClear = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setFilteredPeople([]);
    setHasSearched(false);
    router.push('/people'); // Clear URL params
  };

  // Handle Enter key press in any input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary theme-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-heritage-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading people...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen theme-bg-primary theme-text-primary flex items-center justify-center">
        <div className="text-center theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p className="theme-text-secondary">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2 bg-heritage-primary text-white rounded-lg hover:bg-heritage-secondary transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse People</h1>
          <p className="theme-text-secondary text-lg">
            Search and explore {people.length} individuals in the Culpepper family tree
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <div className="max-w-4xl theme-bg-secondary theme-border border-2 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium theme-text-primary mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="e.g., Henry"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 theme-bg-tertiary theme-text-primary theme-border border rounded-lg focus:outline-none focus:border-heritage-primary transition-colors"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium theme-text-primary mb-2"
                >
                  Middle Name
                </label>
                <input
                  id="middleName"
                  type="text"
                  placeholder="e.g., James"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 theme-bg-tertiary theme-text-primary theme-border border rounded-lg focus:outline-none focus:border-heritage-primary transition-colors"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium theme-text-primary mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="e.g., Culpepper"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 theme-bg-tertiary theme-text-primary theme-border border rounded-lg focus:outline-none focus:border-heritage-primary transition-colors"
                />
              </div>
            </div>

            {/* Search Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                style={{ backgroundColor: 'var(--heritage-primary)', color: 'white' }}
                className="px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                    Search
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="px-6 py-2 theme-bg-tertiary theme-text-primary theme-border border rounded-lg hover:theme-bg-primary transition-colors font-medium shadow-md"
              >
                Clear
              </button>
            </div>

            {/* Search Instructions */}
            <div className="mt-4 pt-4 border-t theme-border">
              <p className="text-sm theme-text-secondary">
                💡 <strong>Search Tips:</strong> Fill in one or more fields to narrow your search.
                All specified fields must match (e.g., searching for &ldquo;Henry&rdquo; +
                &ldquo;Culpepper&rdquo; will only show people with both names). Press Enter or click
                Search to find results.
              </p>
            </div>
          </div>

          {/* Results Count */}
          {hasSearched && (
            <div className="mt-4 text-center">
              <p className="theme-text-primary text-lg font-medium">
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-heritage-primary"></div>
                    Searching...
                  </span>
                ) : (
                  <span>
                    Found {filteredPeople.length}{' '}
                    {filteredPeople.length === 1 ? 'person' : 'people'}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="theme-bg-secondary rounded-lg theme-shadow-lg theme-border border overflow-hidden">
          {filteredPeople.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 theme-text-tertiary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              {!hasSearched ? (
                <>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">Ready to Search</h3>
                  <p className="theme-text-secondary mb-4">
                    Use the search form above to find people by first name, middle name, or last
                    name.
                  </p>
                  <div className="max-w-md mx-auto theme-bg-tertiary p-4 rounded-lg theme-border border">
                    <p className="text-sm theme-text-secondary text-left mb-2">
                      <strong className="theme-text-primary">How to search:</strong>
                    </p>
                    <ul className="text-sm theme-text-secondary text-left space-y-1">
                      <li>• Enter one or more name fields</li>
                      <li>• All specified fields must match</li>
                      <li>• Partial matches are supported</li>
                      <li>• Click Search or press Enter</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">
                    No results found
                  </h3>
                  <p className="theme-text-secondary">
                    Try adjusting your search terms or try a different keyword.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="theme-bg-tertiary theme-border-dark border-b-2">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary hidden md:table-cell">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary hidden lg:table-cell">
                      Birth
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary hidden lg:table-cell">
                      Death
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary hidden xl:table-cell">
                      Birth Place
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border">
                  {filteredPeople.map((person) => (
                    <tr
                      key={person.id}
                      className="hover:theme-bg-tertiary cursor-pointer transition-colors"
                      onClick={() => (window.location.href = `/person/${person.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/person/${person.id}`}
                            className="font-medium theme-text-primary hover:text-heritage-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {person.firstName && person.lastName
                              ? `${person.firstName}${person.middleName ? ` ${person.middleName}` : ''} ${person.lastName}`
                              : person.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 theme-text-secondary hidden md:table-cell">
                        {person.gender ? (
                          <span className="inline-flex items-center">
                            {person.gender === 'M' ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4 mr-1 text-blue-500"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                                Male
                              </>
                            ) : person.gender === 'F' ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4 mr-1 text-pink-500"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                                Female
                              </>
                            ) : (
                              person.gender
                            )}
                          </span>
                        ) : (
                          <span className="theme-text-tertiary">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 theme-text-secondary hidden lg:table-cell">
                        {person.birth ? (
                          <span className="whitespace-nowrap">{person.birth}</span>
                        ) : (
                          <span className="theme-text-tertiary">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 theme-text-secondary hidden lg:table-cell">
                        {person.death ? (
                          <span className="whitespace-nowrap">{person.death}</span>
                        ) : (
                          <span className="theme-text-tertiary">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 theme-text-secondary hidden xl:table-cell">
                        {person.birthPlace ? (
                          <span className="text-sm">{person.birthPlace}</span>
                        ) : (
                          <span className="theme-text-tertiary">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredPeople.length > 0 && (
          <div className="mt-6 text-center theme-text-tertiary text-sm">
            <p>Click on any row to view detailed information about that person</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen theme-bg-primary theme-text-primary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-heritage-primary mx-auto mb-4"></div>
            <p className="text-xl">Loading search...</p>
          </div>
        </div>
      }
    >
      <PeoplePageContent />
    </Suspense>
  );
}
