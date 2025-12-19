import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  father?: string;
  mother?: string;
  spouses: string[];
  children: string[];
};

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

  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-screen theme-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block theme-text-primary hover:opacity-80"
        >
          ← Back to Family Tree
        </Link>

        <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 mt-4 theme-border border">
          <h1 className="text-4xl font-bold mb-2 theme-text-primary">{person.name}</h1>
          {person.firstName && (
            <p className="theme-text-secondary mb-6">
              {person.firstName} {person.middleName && `${person.middleName} `}
              {person.lastName}
            </p>
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
                          href={`/person/${person.father}`}
                          className="text-blue-600 hover:underline"
                        >
                          Father (ID: {person.father})
                        </Link>
                      </li>
                    )}
                    {person.mother && (
                      <li>
                        <Link
                          href={`/person/${person.mother}`}
                          className="text-blue-600 hover:underline"
                        >
                          Mother (ID: {person.mother})
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
                    {person.spouses.map((spouseId) => (
                      <li key={spouseId}>
                        <Link
                          href={`/person/${spouseId}`}
                          className="text-blue-600 hover:underline"
                        >
                          Spouse (ID: {spouseId})
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
                    {person.children.map((childId) => (
                      <li key={childId}>
                        <Link href={`/person/${childId}`} className="text-blue-600 hover:underline">
                          Child (ID: {childId})
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
