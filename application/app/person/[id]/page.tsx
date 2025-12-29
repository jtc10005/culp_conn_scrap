import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BackButton, SuggestEditButton, Timeline } from '@/components';
import { getEditPersonRecordEnabled, getCulpepperConnectionLinkEnabled } from '@/lib';
import type { LifeEvent, Family } from '@/lib/types';

type RelatedPerson = {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};

type Person = {
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
  burial?: string;
  burialPlace?: string;
  marriageDate?: string;
  father?: RelatedPerson;
  mother?: RelatedPerson;
  spouses: RelatedPerson[];
  children: RelatedPerson[];
  dnaProven?: boolean;
  hasPicture?: boolean;
  hasFamilyBible?: boolean;
  militaryService?: string[];
  page?: string;
  events: LifeEvent[];
  families: Family[];
};

function formatPersonName(person: RelatedPerson): string {
  if (person.firstName && person.lastName) {
    return `${person.firstName}${person.middleName ? ` ${person.middleName}` : ''} ${person.lastName}`;
  }
  return person.name;
}

async function getPerson(id: string): Promise<Person | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/person/${id}`,
      {
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.person;
  } catch {
    return null;
  }
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);
  const editEnabled = await getEditPersonRecordEnabled();
  const culpepperLinkEnabled = await getCulpepperConnectionLinkEnabled();

  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-screen theme-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton fallbackHref="/people" fallbackText="Back to Search" />

        <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 mt-4 theme-border border">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold theme-text-primary">
              {person.firstName && person.lastName
                ? `${person.firstName}${person.middleName ? ` ${person.middleName}` : ''} ${person.lastName}`
                : person.name}
            </h1>
            <div className="flex gap-2">
              {culpepperLinkEnabled && person.page && (
                <a
                  href={`https://www.culpepperconnections.com/ss/g0/${person.page}#i${person.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <span>🔗</span>
                  <span>View on CulpepperConnections</span>
                </a>
              )}
              {editEnabled && <SuggestEditButton person={person} />}
            </div>
          </div>

          {/* Badge Section */}
          {(person.dnaProven ||
            person.hasPicture ||
            person.hasFamilyBible ||
            (person.militaryService && person.militaryService.length > 0)) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {person.dnaProven && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                  🧬 DNA Proven
                </span>
              )}
              {person.hasPicture && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                  📷 Picture Available
                </span>
              )}
              {person.hasFamilyBible && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                  📖 Family Bible Record
                </span>
              )}
              {person.militaryService &&
                person.militaryService.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300"
                  >
                    🎖️ {service}
                  </span>
                ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 theme-text-primary">
                Personal Information
              </h2>
              <dl className="space-y-2">
                {person.gender && (
                  <div>
                    <dt className="font-medium theme-text-secondary">Gender:</dt>
                    <dd className="theme-text-primary">{person.gender}</dd>
                  </div>
                )}
                {person.birth && (
                  <div>
                    <dt className="font-medium theme-text-secondary">Birth:</dt>
                    <dd className="theme-text-primary">
                      {person.birth}
                      {person.birthPlace && ` at ${person.birthPlace}`}
                    </dd>
                  </div>
                )}
                {person.death && (
                  <div>
                    <dt className="font-medium theme-text-secondary">Death:</dt>
                    <dd className="theme-text-primary">
                      {person.death}
                      {person.deathPlace && ` at ${person.deathPlace}`}
                    </dd>
                  </div>
                )}
                {person.burial && (
                  <div>
                    <dt className="font-medium theme-text-secondary">Burial:</dt>
                    <dd className="theme-text-primary">
                      {person.burial}
                      {person.burialPlace && ` at ${person.burialPlace}`}
                    </dd>
                  </div>
                )}
                {person.marriageDate && (
                  <div>
                    <dt className="font-medium theme-text-secondary">Marriage:</dt>
                    <dd className="theme-text-primary">{person.marriageDate}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 theme-text-primary">Relationships</h2>

              {(person.father || person.mother) && (
                <div className="mb-4">
                  <h3 className="font-medium theme-text-secondary mb-2">Parents:</h3>
                  <ul className="space-y-1">
                    {person.father && (
                      <li>
                        <Link
                          href={`/person/${person.father.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Father: {formatPersonName(person.father)}
                        </Link>
                      </li>
                    )}
                    {person.mother && (
                      <li>
                        <Link
                          href={`/person/${person.mother.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Mother: {formatPersonName(person.mother)}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {person.spouses.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium theme-text-secondary mb-2">
                    Spouse{person.spouses.length > 1 ? 's' : ''}:
                  </h3>
                  <ul className="space-y-1">
                    {person.spouses.map((spouse) => (
                      <li key={spouse.id}>
                        <Link
                          href={`/person/${spouse.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {formatPersonName(spouse)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {person.children.length > 0 && (
                <div>
                  <h3 className="font-medium theme-text-secondary mb-2">
                    Children ({person.children.length}):
                  </h3>
                  <ul className="space-y-1">
                    {person.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/person/${child.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {formatPersonName(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section - Events and Families */}
          <Timeline events={person.events} families={person.families} />
        </div>
      </div>
    </div>
  );
}
