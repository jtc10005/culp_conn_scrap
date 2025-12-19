import Image from 'next/image';
import Link from 'next/link';
import { checkRouteAccess } from '@lib';

export const metadata = {
  title: 'Culpepper Family History - Culpepper.Info',
  description:
    'The history of the Culpepper family in America, tracing back to Henry Culpeper of Lower Norfolk County, Virginia (circa 1633)',
};

export default async function HistoryPage() {
  await checkRouteAccess('history');
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
            A Legacy Spanning Centuries: From England to Colonial Virginia
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Overview Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-4 text-heritage-primary">Family Overview</h2>
            <div className="prose max-w-none theme-text-primary">
              <p className="text-lg leading-relaxed mb-4">
                The Culpepper family name has a rich history dating back to medieval England, with
                significant presence in colonial Virginia. Through DNA testing and genealogical
                research, we have traced approximately 80% of American Culpeppers to a common
                ancestor: <strong>Henry Culpeper of Lower Norfolk County, Virginia</strong>.
              </p>
              <p className="text-lg leading-relaxed">
                The name has various spellings throughout history, including Culpepper, Culpeper,
                and Colepeper, reflecting the fluid nature of spelling in early colonial records.
              </p>
            </div>
          </section>

          {/* Progenitor Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              Henry Culpeper of Lower Norfolk County
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  Life Timeline
                </h3>
                <ul className="space-y-3 theme-text-secondary">
                  <li>
                    <strong className="theme-text-primary">Born:</strong> circa 1633, England
                  </li>
                  <li>
                    <strong className="theme-text-primary">Arrived in Virginia:</strong> May 1653 or
                    earlier
                  </li>
                  <li>
                    <strong className="theme-text-primary">First Record:</strong> 1658, listed as
                    &ldquo;Planter&rdquo; in Lancaster County, VA
                  </li>
                  <li>
                    <strong className="theme-text-primary">Settled:</strong> Lower Norfolk County,
                    VA by 1667
                  </li>
                  <li>
                    <strong className="theme-text-primary">Marriage:</strong> circa 1660 to
                    Elizabeth Green
                  </li>
                  <li>
                    <strong className="theme-text-primary">Last Record:</strong> August 1675
                  </li>
                  <li>
                    <strong className="theme-text-primary">Death:</strong> after 1675, Lower Norfolk
                    County, VA
                  </li>
                </ul>
              </div>

              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  Historical Significance
                </h3>
                <ul className="space-y-3 theme-text-secondary">
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2">•</span>
                    <span>
                      Proven through Y-DNA testing to be the progenitor of approximately 80% of
                      American Culpeppers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2">•</span>
                    <span>Property owner and cattle farmer, suggesting a person of means</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2">•</span>
                    <span>
                      Literate and educated, signed deeds with a distinctive script &ldquo;H&rdquo;
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2">•</span>
                    <span>
                      Known children: Robert Culpepper (b. 1664) and Henry Culpepper Jr. (b. 1669)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* English Origins Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              English Origins: The Mystery Continues
            </h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                While Henry Culpeper&apos;s life in Virginia is well-documented through land deeds
                and court records, his exact English ancestry remains a subject of ongoing research.
                Several theories have been proposed:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-opacity-50 theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">
                    Theory 1: Son of John Culpeper &ldquo;the Merchant&rdquo;
                  </h4>
                  <p className="text-sm">
                    Possibly the son of John Culpeper of Astwood in Feckenham and Ursula Woodcock.
                    John was the right age, known to have been abroad, and from a family with
                    Virginia connections.
                  </p>
                </div>

                <div className="bg-opacity-50 theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">
                    Theory 2: Son of Thomas Culpeper of the Middle Temple
                  </h4>
                  <p className="text-sm">
                    Could be a son of Thomas, brother of John the Merchant. While several of
                    Thomas&apos;s children are known, the list may not be complete as neither parent
                    left a will.
                  </p>
                </div>

                <div className="bg-opacity-50 theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">
                    Theory 3: Related to Sir Edward Culpeper of Wakehurst
                  </h4>
                  <p className="text-sm">
                    Possible connection to Sir Edward Culpeper, Knight, who signed the Third
                    Virginia Charter in 1612, indicating early family ties to Virginia.
                  </p>
                </div>

                <div className="bg-opacity-50 theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">
                    Theory 4: Henry Culpeper of London
                  </h4>
                  <p className="text-sm">
                    May be the Henry baptized at St. Margaret&apos;s Church, Westminster, London
                    (February 20, 1632), son of William Culpeper of London.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 rounded theme-border border border-blue-700">
                <h4 className="font-semibold theme-text-primary mb-2">DNA Evidence</h4>
                <p className="text-sm leading-relaxed">
                  DNA testing has shown that while American Culpeppers descend from Henry of Lower
                  Norfolk, they are not closely related to Culpepers of Barbados, Puerto Rico, South
                  Africa, India, or Australia. The Barbados line has been proven to descend from
                  William Culpeper of Hunton and Wigsell, suggesting either false paternity in
                  Henry&apos;s line, descent from an unidentified English Culpeper branch, or that
                  William of London was not connected to the famous Bedgebury Culpepers.
                </p>
              </div>
            </div>
          </section>

          {/* Virginia Settlement Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              Life in Colonial Virginia
            </h2>
            <div className="space-y-6">
              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  Early Years (1653-1667)
                </h3>
                <p className="theme-text-secondary leading-relaxed mb-4">
                  Henry likely arrived in Virginia in May 1653 or earlier, paying for his own
                  passage rather than arriving as an indentured servant. He sold his headright
                  (claim to 50 acres) to Captain Nathaniel Hurd, suggesting he had other means of
                  establishing himself.
                </p>
                <p className="theme-text-secondary leading-relaxed">
                  By December 1658, records show &ldquo;Henry Colepepper, Planter&rdquo; selling
                  cattle in Lancaster County, indicating he had established himself as a property
                  owner and livestock farmer within five years of arrival.
                </p>
              </div>

              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  Lower Norfolk County Period (1667-1675)
                </h3>
                <p className="theme-text-secondary leading-relaxed mb-4">
                  By 1667, Henry had relocated to Lower Norfolk County, where he remained for the
                  rest of his documented life. Court records show him as an active member of the
                  community, involved in numerous land transactions, serving as an appraiser for
                  estates, and witnessing legal documents.
                </p>
                <p className="theme-text-secondary leading-relaxed">
                  His land holdings included property along Little Creek and the Western Branch of
                  the Elizabeth River. The deeds reveal a man of business acumen who bought, sold,
                  and managed significant properties and livestock.
                </p>
              </div>

              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">Family Life</h3>
                <p className="theme-text-secondary leading-relaxed mb-4">
                  Henry married Elizabeth, whose maiden name was likely Green, around 1660. Several
                  land transactions required Elizabeth&apos;s consent, suggesting she may have
                  brought property to the marriage from a previous union or inheritance.
                </p>
                <p className="theme-text-secondary leading-relaxed">
                  Two sons are documented: Robert (born circa 1664) and Henry Jr. (born circa 1669).
                  Both would go on to establish their own families in Norfolk County, continuing the
                  Culpepper presence in Virginia.
                </p>
              </div>
            </div>
          </section>

          {/* Name Variations Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
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

          {/* DNA Project Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              The Culpepper DNA Project
            </h2>
            <div className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed theme-text-secondary">
                  The Culpepper Y-DNA Project at FamilyTreeDNA has revolutionized our understanding
                  of family connections. As of recent testing:
                </p>
                <ul className="space-y-3 ml-6 theme-text-secondary">
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2 text-xl">✓</span>
                    <span>
                      <strong className="theme-text-primary">117 Culpepper males</strong> have been
                      tested
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2 text-xl">✓</span>
                    <span>
                      <strong className="theme-text-primary">80% share close DNA</strong>{' '}
                      relationships
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2 text-xl">✓</span>
                    <span>
                      All closely-related participants trace back to{' '}
                      <strong className="theme-text-primary">
                        Henry Culpeper of Lower Norfolk County
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-heritage-primary mr-2 text-xl">✓</span>
                    <span>
                      DNA has{' '}
                      <strong className="theme-text-primary">proven Henry as the progenitor</strong>{' '}
                      of most American Culpeppers
                    </span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-green-900 bg-opacity-20 rounded theme-border border border-green-700">
                  <p className="text-sm leading-relaxed theme-text-secondary">
                    This DNA evidence, combined with traditional genealogical research, has provided
                    unprecedented clarity about family relationships and confirmed connections that
                    were previously only suspected through documentary evidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Geographic Distribution Section */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              From Virginia to America
            </h2>
            <p className="theme-text-secondary leading-relaxed mb-6">
              From Henry&apos;s settlement in Lower Norfolk County, the Culpepper family spread
              throughout Virginia and eventually across the United States. Descendants can now be
              found in all 50 states, with particularly strong concentrations in:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'Virginia',
                'North Carolina',
                'South Carolina',
                'Georgia',
                'Tennessee',
                'Kentucky',
                'Texas',
                'California',
              ].map((state) => (
                <div
                  key={state}
                  className="text-center p-3 theme-bg-tertiary rounded theme-border border"
                >
                  <span className="font-semibold theme-text-primary">{state}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold theme-text-primary">Explore Your Heritage</h2>
            <p className="text-lg theme-text-secondary max-w-2xl mx-auto">
              Discover your place in the Culpepper family tree and connect with relatives spanning
              over three centuries of American history.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tree"
                className="px-8 py-3 bg-heritage-primary hover:bg-heritage-secondary text-white rounded-lg font-semibold transition-colors theme-shadow-md"
              >
                View Family Tree
              </Link>
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
