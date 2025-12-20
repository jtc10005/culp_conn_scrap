import Image from 'next/image';
import Link from 'next/link';
import { checkRouteAccess, getNavigationConfig } from '@lib';

export const metadata = {
  title: 'Culpepper Family History - Culpepper.Info',
  description:
    'Explore the Culpepper family history from medieval England to colonial America and beyond',
};

export default async function HistoryPage() {
  await checkRouteAccess('history');
  const navConfig = await getNavigationConfig();

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/culpepper_crest_no_bg.png"
              alt="Culpepper Family Crest"
              width={200}
              height={200}
              priority
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">The Culpepper Family</h1>
          <p className="text-xl theme-text-secondary">
            A Legacy Spanning Centuries: From Ancient Origins to Modern America
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Overview Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-4 text-heritage-primary">Family Overview</h2>
            <div className="prose max-w-none theme-text-primary">
              <p className="text-lg leading-relaxed mb-4">
                The Culpepper family name carries a rich heritage that spans from prehistoric
                migrations through medieval England to colonial Virginia and across modern America.
                Through DNA testing and meticulous genealogical research, we can trace our ancestral
                journey back 60,000 years through genetic markers, and our documented family history
                back over 800 years through written records.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Approximately <strong>80% of American Culpeppers</strong> share a common ancestor:
                Henry Culpeper of Lower Norfolk County, Virginia (circa 1633-after 1675). His
                arrival in colonial America in 1653 marked the beginning of the American Culpepper
                story—a story that would eventually spread to all 50 states.
              </p>
              <p className="text-lg leading-relaxed">
                The name has various spellings throughout history, including Culpepper, Culpeper,
                and Colepeper, reflecting the fluid nature of spelling in early historical records.
              </p>
            </div>
          </section>

          {/* Two Main History Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* English Origins Section */}
            <Link
              href="/history/pre-immigration"
              className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2 hover:border-heritage-primary transition-all group"
            >
              <div className="text-center mb-6">
                <span className="text-6xl mb-4 block">🏰</span>
                <h2 className="text-3xl font-bold mb-4 text-heritage-primary group-hover:text-heritage-secondary transition-colors">
                  English Origins
                </h2>
                <p className="text-xl font-semibold theme-text-secondary mb-2">
                  Pre-1653: Ancient Ancestry to Medieval England
                </p>
              </div>
              <div className="space-y-3 theme-text-secondary">
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>60,000 years</strong> of ancestral journey from Africa to Europe
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Haplogroup I1</strong> &ldquo;Viking&rdquo; genetic heritage
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Medieval England</strong> from the 1100s onward
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Thomas de Colepeper</strong> and the First Four Generations
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Earl of Lancaster Rebellion</strong> and Leeds Castle incident
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Major family branches</strong> in Sussex, Kent, and beyond
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Virginia Company</strong> connections and colonial ventures
                  </span>
                </p>
              </div>
              <div className="mt-6 text-center">
                <span className="inline-block px-6 py-3 bg-heritage-primary group-hover:bg-heritage-secondary text-white rounded-lg font-semibold transition-colors">
                  Explore English Origins →
                </span>
              </div>
            </Link>

            {/* American History Section */}
            <Link
              href="/history/american"
              className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2 hover:border-heritage-primary transition-all group"
            >
              <div className="text-center mb-6">
                <span className="text-6xl mb-4 block">🇺🇸</span>
                <h2 className="text-3xl font-bold mb-4 text-heritage-primary group-hover:text-heritage-secondary transition-colors">
                  American Culpeppers
                </h2>
                <p className="text-xl font-semibold theme-text-secondary mb-2">
                  1653-Present: Colonial Virginia to Modern America
                </p>
              </div>
              <div className="space-y-3 theme-text-secondary">
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Henry Culpeper</strong> of Lower Norfolk County, Virginia
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>1653 arrival</strong> in colonial Virginia
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>80% of American Culpeppers</strong> proven descended from Henry
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>DNA Project</strong> with 117 tested males
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>English origins mystery</strong> and ongoing research
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>Westward expansion</strong> across America
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    <strong>All 50 states</strong> representation today
                  </span>
                </p>
              </div>
              <div className="mt-6 text-center">
                <span className="inline-block px-6 py-3 bg-heritage-primary group-hover:bg-heritage-secondary text-white rounded-lg font-semibold transition-colors">
                  Explore American History →
                </span>
              </div>
            </Link>
          </div>

          {/* Crest Section */}
          <section className="text-center theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">Family Crest & Motto</h2>
            <p className="text-lg theme-text-secondary mb-6 max-w-3xl mx-auto">
              The Culpeper coat of arms has been used by various branches of the family since
              medieval times. Explore the heraldic symbolism, three documented family mottos, and
              the history of the Culpepper crest.
            </p>
            <Link
              href="/history/crest"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg theme-bg-accent hover:opacity-90 theme-text-on-accent rounded-lg font-semibold transition-opacity theme-shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Explore Family Crest & Motto
            </Link>
          </section>

          {/* Quick Facts Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary text-center">
              Culpepper Family at a Glance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 theme-bg-tertiary rounded theme-border border">
                <div className="text-4xl mb-3">🧬</div>
                <h3 className="text-2xl font-bold text-heritage-secondary mb-2">117</h3>
                <p className="theme-text-secondary">Males DNA tested</p>
                <p className="text-sm theme-text-tertiary mt-2">80% share common ancestry</p>
              </div>
              <div className="text-center p-6 theme-bg-tertiary rounded theme-border border">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-2xl font-bold text-heritage-secondary mb-2">370+</h3>
                <p className="theme-text-secondary">Years in America</p>
                <p className="text-sm theme-text-tertiary mt-2">Since Henry&apos;s 1653 arrival</p>
              </div>
              <div className="text-center p-6 theme-bg-tertiary rounded theme-border border">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="text-2xl font-bold text-heritage-secondary mb-2">50</h3>
                <p className="theme-text-secondary">States represented</p>
                <p className="text-sm theme-text-tertiary mt-2">From Virginia to nationwide</p>
              </div>
            </div>
          </section>

          {/* Name Variations Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary text-center">
              The Culpepper Name: Spelling Variations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl font-serif mb-2 text-heritage-secondary">Culpeper</div>
                <p className="text-sm theme-text-tertiary">
                  English spelling, used by the noble families
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-serif mb-2 text-heritage-secondary">Culpepper</div>
                <p className="text-sm theme-text-tertiary">Common American spelling variant</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-serif mb-2 text-heritage-secondary">Colepeper</div>
                <p className="text-sm theme-text-tertiary">Early colonial spelling variant</p>
              </div>
            </div>
            <p className="mt-6 text-center theme-text-secondary italic">
              All three spellings appear in historical documents, sometimes for the same individual.
              Modern descendants use various spellings, with Culpepper being most common in America.
            </p>
          </section>

          {/* Genealogy Resources Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary text-center">
              Research Your Culpepper Ancestry
            </h2>
            <p className="text-lg theme-text-secondary text-center mb-8 max-w-3xl mx-auto">
              Discover your place in the Culpepper family tree using these free, open-source
              genealogy resources with thousands of documented Culpepper profiles.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* WikiTree */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border hover:border-heritage-primary transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-8 h-8 text-heritage-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                  <h3 className="text-xl font-bold theme-text-primary">WikiTree</h3>
                </div>
                <p className="text-sm theme-text-secondary mb-4">
                  <strong>1,370+ Culpepper profiles</strong> in a collaborative family tree. Free
                  forever with active genealogists fact-checking entries.
                </p>
                <ul className="text-sm theme-text-tertiary space-y-2 mb-4">
                  <li>• Source-documented profiles</li>
                  <li>• DNA connections available</li>
                  <li>• Active discussion forum</li>
                  <li>• 31 Culpepper genealogists</li>
                </ul>
                <a
                  href="https://www.wikitree.com/genealogy/CULPEPPER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 bg-heritage-primary hover:bg-heritage-secondary text-white rounded font-semibold transition-colors"
                >
                  Browse WikiTree →
                </a>
              </div>

              {/* FamilySearch */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border hover:border-heritage-primary transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-8 h-8 text-heritage-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  <h3 className="text-xl font-bold theme-text-primary">FamilySearch</h3>
                </div>
                <p className="text-sm theme-text-secondary mb-4">
                  <strong>Billions of historical records</strong> including census data, church
                  records, and court documents.
                </p>
                <ul className="text-sm theme-text-tertiary space-y-2 mb-4">
                  <li>• Original source documents</li>
                  <li>• Virginia colonial records</li>
                  <li>• Census & vital records</li>
                  <li>• Digitized archives</li>
                </ul>
                <a
                  href="https://www.familysearch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 bg-heritage-primary hover:bg-heritage-secondary text-white rounded font-semibold transition-colors"
                >
                  Search FamilySearch →
                </a>
              </div>

              {/* Geni */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border hover:border-heritage-primary transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-8 h-8 text-heritage-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <h3 className="text-xl font-bold theme-text-primary">Geni</h3>
                </div>
                <p className="text-sm theme-text-secondary mb-4">
                  <strong>World Family Tree</strong> connecting 205+ million profiles with
                  collaborative family history.
                </p>
                <ul className="text-sm theme-text-tertiary space-y-2 mb-4">
                  <li>• Connect with living relatives</li>
                  <li>• Share photos & documents</li>
                  <li>• Collaborative projects</li>
                  <li>• Free basic account</li>
                </ul>
                <a
                  href="https://www.geni.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 bg-heritage-primary hover:bg-heritage-secondary text-white rounded font-semibold transition-colors"
                >
                  Explore Geni →
                </a>
              </div>
            </div>

            <div className="theme-bg-tertiary p-6 rounded-lg theme-border border">
              <h3 className="text-lg font-bold theme-text-primary mb-3">
                💡 Research Tips for Finding Your Culpepper Ancestors:
              </h3>
              <ul className="space-y-2 theme-text-secondary text-sm">
                <li>
                  <strong>Search all spelling variations:</strong> Culpepper, Culpeper, Colepeper,
                  Colepepper, Colpepper
                </li>
                <li>
                  <strong>Start with Henry Culpeper (c.1633-1675):</strong> 80% of American
                  Culpeppers descend from him
                </li>
                <li>
                  <strong>Key locations:</strong> Lower Norfolk/Norfolk County VA, Lancaster County
                  VA, North Carolina, Georgia
                </li>
                <li>
                  <strong>DNA testing:</strong> Consider Y-DNA testing to confirm your connection to
                  the main Culpepper line (Haplogroup I1)
                </li>
                <li>
                  <strong>Connect with researchers:</strong> Join WikiTree discussions and Geni
                  projects to collaborate with other Culpepper genealogists
                </li>
              </ul>
            </div>
          </section>

          {/* References Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">Primary Sources</h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed mb-4">
                All historical information, genealogical data, and family research presented is
                compiled from verified sources:
              </p>

              <div className="theme-bg-tertiary p-4 rounded theme-border border">
                <h3 className="font-semibold theme-text-primary mb-2">Primary Source:</h3>
                <p className="text-sm">
                  <a
                    href="https://www.culpepperconnections.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heritage-primary hover:text-heritage-secondary underline font-semibold"
                  >
                    Culpepper Connections
                  </a>{' '}
                  - The premier genealogical resource for the Culpepper family, maintained by Lewis
                  Wyman Griffin, Jr. Includes comprehensive DNA project data and historical
                  documentation.
                </p>
              </div>

              <div className="theme-bg-tertiary p-4 rounded theme-border border">
                <h3 className="font-semibold theme-text-primary mb-2">
                  Supporting Genealogy Resources:
                </h3>
                <ul className="text-sm space-y-2">
                  <li>
                    <a
                      href="https://www.wikitree.com/genealogy/CULPEPPER"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heritage-primary hover:text-heritage-secondary underline"
                    >
                      WikiTree Culpepper Family Project
                    </a>{' '}
                    - 1,370+ documented profiles with source citations
                  </li>
                  <li>
                    <a
                      href="https://www.familysearch.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heritage-primary hover:text-heritage-secondary underline"
                    >
                      FamilySearch
                    </a>{' '}
                    - Historical records including Virginia colonial documents
                  </li>
                  <li>
                    <a
                      href="https://www.geni.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heritage-primary hover:text-heritage-secondary underline"
                    >
                      Geni World Family Tree
                    </a>{' '}
                    - Collaborative genealogy platform
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-opacity-50 theme-bg-tertiary rounded theme-border border">
                <p className="text-xs italic theme-text-tertiary">
                  <strong>Note:</strong> For complete source documents, additional research, and
                  ongoing updates, visit{' '}
                  <a
                    href="https://www.culpepperconnections.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heritage-primary hover:text-heritage-secondary underline"
                  >
                    www.culpepperconnections.com
                  </a>
                  . Each subpage contains detailed citations to specific sources.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold theme-text-primary">Explore Your Heritage</h2>
            <p className="text-lg theme-text-secondary max-w-2xl mx-auto">
              Discover your place in the Culpepper family tree and connect with relatives spanning
              centuries of history across two continents.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {navConfig.tree && (
                <Link
                  href="/tree"
                  className="px-8 py-3 bg-heritage-primary hover:bg-heritage-secondary text-white rounded-lg font-semibold transition-colors theme-shadow-md"
                >
                  View Family Tree
                </Link>
              )}
              <Link
                href="/"
                className="px-8 py-3 theme-bg-secondary hover:theme-bg-tertiary theme-text-primary rounded-lg font-semibold transition-colors theme-shadow-md theme-border border-2"
              >
                Return Home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
