'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    if (searchTerm === '') {
      setDebouncedSearchTerm('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setFilteredPeople([]);
      setHasSearched(false);
    } else {
      setHasSearched(true);
      const term = debouncedSearchTerm.toLowerCase();
      const filtered = people.filter((person) => {
        const fullName = person.name.toLowerCase();
        const firstName = person.firstName?.toLowerCase() || '';
        const middleName = person.middleName?.toLowerCase() || '';
        const lastName = person.lastName?.toLowerCase() || '';
        const birthPlace = person.birthPlace?.toLowerCase() || '';
        const deathPlace = person.deathPlace?.toLowerCase() || '';
        const id = person.id.toLowerCase();

        return (
          fullName.includes(term) ||
          firstName.includes(term) ||
          middleName.includes(term) ||
          lastName.includes(term) ||
          birthPlace.includes(term) ||
          deathPlace.includes(term) ||
          id.includes(term)
        );
      });
      setFilteredPeople(filtered);
    }
  }, [debouncedSearchTerm, people]);

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by name, ID, place, or any keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 theme-bg-secondary theme-text-primary theme-border border-2 rounded-lg focus:outline-none focus:border-heritage-primary transition-colors"
            />
            {isSearching ? (
              <div className="absolute left-3 top-3.5">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-heritage-primary"></div>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 absolute left-3 top-3.5 theme-text-tertiary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 theme-text-tertiary hover:theme-text-primary transition-colors"
              >
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
              </button>
            )}
          </div>
          {hasSearched ? (
            <p className="mt-2 theme-text-tertiary text-sm">
              {isSearching ? (
                <span>Searching...</span>
              ) : (
                <span>
                  {filteredPeople.length} {filteredPeople.length === 1 ? 'person' : 'people'} found
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 theme-text-secondary text-sm">
              💡 Enter a name, ID number, or location to search. Try searching for
              &ldquo;Henry&rdquo;, &ldquo;1&rdquo;, or &ldquo;Virginia&rdquo;
            </p>
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
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">Start Searching</h3>
                  <p className="theme-text-secondary mb-4">
                    Enter a search term above to find people in the family tree.
                  </p>
                  <div className="max-w-md mx-auto theme-bg-tertiary p-4 rounded-lg theme-border border">
                    <p className="text-sm theme-text-secondary text-left mb-2">
                      <strong className="theme-text-primary">Search by:</strong>
                    </p>
                    <ul className="text-sm theme-text-secondary text-left space-y-1">
                      <li>• First name, last name, or full name</li>
                      <li>• ID number (e.g., &ldquo;1&rdquo;, &ldquo;834&rdquo;)</li>
                      <li>• Birth or death location</li>
                      <li>• Any keyword</li>
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
                            {person.name}
                          </Link>
                          {(person.firstName || person.lastName) && (
                            <div className="text-sm theme-text-tertiary mt-1">
                              {person.firstName && person.firstName !== person.name && (
                                <span>
                                  {person.firstName}
                                  {person.middleName && ` ${person.middleName}`}
                                  {person.lastName && ` ${person.lastName}`}
                                </span>
                              )}
                            </div>
                          )}
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
