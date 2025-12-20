import Image from 'next/image';
import Link from 'next/link';
import { checkRouteAccess } from '@lib';

export const metadata = {
  title: 'Culpepper Family Crest & Motto - Culpepper.Info',
  description:
    'The history and meaning of the Culpepper family crest, coat of arms, and family motto',
};

export default async function CrestPage() {
  await checkRouteAccess('history');

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/culpepper_crest_no_bg.png"
              alt="Culpepper Family Crest"
              width={250}
              height={250}
              priority
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">The Culpepper Family Crest</h1>
          <p className="text-xl theme-text-secondary italic">
            Heraldic Symbol of the English Culpeper Family
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* The Coat of Arms */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">The Coat of Arms</h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="text-lg leading-relaxed">
                The Culpepper family coat of arms is one of the most distinctive and recognizable
                heraldic designs from medieval England. The arms were granted to the Culpepper
                family of Kent and have been associated with the family since the medieval period.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="theme-bg-tertiary p-6 rounded-lg theme-border border">
                  <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                    Heraldic Description (Blazon)
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    <strong className="theme-text-primary">
                      From Burke&apos;s General Armory:
                    </strong>
                    <br />
                    <span className="italic">Argent, a bend engrailed, gules</span>
                  </p>
                  <p className="text-sm leading-relaxed">
                    In plain language: A silver (white) shield with a red diagonal stripe indented
                    with small concave curves running from the upper left to the lower right.
                  </p>
                </div>

                <div className="theme-bg-tertiary p-6 rounded-lg theme-border border">
                  <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                    Key Elements
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-heritage-primary mr-2">•</span>
                      <span>
                        <strong className="theme-text-primary">Argent (Silver/White):</strong>{' '}
                        Represents peace, sincerity, and purity
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-heritage-primary mr-2">•</span>
                      <span>
                        <strong className="theme-text-primary">Gules (Red):</strong> Symbolizes
                        military fortitude and magnanimity
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-heritage-primary mr-2">•</span>
                      <span>
                        <strong className="theme-text-primary">Bend Engrailed:</strong> A diagonal
                        stripe with wavy, scalloped edges
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 theme-bg-tertiary p-6 rounded-lg theme-border border">
                <h3 className="text-xl font-semibold mb-3 theme-text-primary">The Crest</h3>
                <p className="text-sm leading-relaxed mb-3">
                  Above the shield and helmet is the crest, described in Burke&apos;s as:
                </p>
                <p className="text-sm italic theme-text-secondary mb-3">
                  &ldquo;A silver falcon with extended wings whose beak and bells are gold.&rdquo;
                </p>
                <p className="text-sm leading-relaxed">
                  A more elaborate description from an old Colepeper pedigree chart: &ldquo;On a
                  trunk of a tree, lying fessways, a branch issuant from the dexter end, proper, a
                  falcon, wings expanded, argent, beaked, belled and legged, or.&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* The Family Motto */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">Family Mottos</h2>
            <div className="space-y-6">
              <p className="theme-text-secondary leading-relaxed">
                In England, mottos do not form part of the patent and can vary within families and
                across generations. Three different mottos have been documented with the Culpeper
                Coat of Arms:
              </p>

              {/* Motto 1: J'espère */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border-2">
                <div className="text-center mb-4">
                  <p className="text-3xl font-serif italic theme-text-primary mb-2">
                    J&apos;espère
                  </p>
                  <p className="text-lg theme-text-secondary">&ldquo;I hope&rdquo;</p>
                </div>
                <p className="text-sm theme-text-tertiary leading-relaxed">
                  This French motto was used by the Barbados Culpepers and by John, Lord Culpeper,
                  Governor of Virginia. It reflects optimism and forward-looking confidence.
                </p>
              </div>

              {/* Motto 2: Jesu Christe */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-serif italic theme-text-primary mb-2">
                    Jesu Christe fili Dei miserere mei
                  </p>
                  <p className="text-lg theme-text-secondary">
                    &ldquo;Jesus Christ, Son of God, have mercy upon me&rdquo;
                  </p>
                </div>
                <p className="text-sm theme-text-tertiary leading-relaxed">
                  Found on a pedigree chart for the Colepepers of Bedgebury, this religious motto
                  was noted by Sir Alexander Colepeper. However, its length is unusual for a
                  heraldic motto, so its authenticity as an official family motto is uncertain.
                </p>
              </div>

              {/* Motto 3: Fides fortitudio fastio */}
              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border-2">
                <div className="text-center mb-4">
                  <p className="text-2xl font-serif italic theme-text-primary mb-2">
                    Fides fortitudio fastio
                  </p>
                  <p className="text-lg theme-text-secondary">
                    &ldquo;Faith, Courage, Dignity&rdquo; (or &ldquo;Faith, Duty, Honor&rdquo;)
                  </p>
                </div>
                <p className="text-sm theme-text-tertiary leading-relaxed mb-3">
                  This Latin-appearing motto has appeared with the Coat of Arms, though its origin
                  is uncertain. The words &ldquo;fortitudio&rdquo; and &ldquo;fastio&rdquo; are not
                  standard classical Latin, suggesting this may be a later creation rather than an
                  authentic historical motto. Dr. Sarah Culpepper Stroup, a Classics professor,
                  analyzed these terms and suggested they may be neologisms formed to create a motto
                  with alliterative appeal.
                </p>
                <p className="text-sm theme-text-tertiary leading-relaxed">
                  Some interpret this motto as embodying warrior virtues of faith, fortitude (duty
                  to act rightly), and honor (dignity earned through sacrifice).
                </p>
              </div>

              <div className="mt-6 p-4 theme-bg-tertiary rounded theme-border border">
                <p className="text-xs theme-text-tertiary italic">
                  Source:{' '}
                  <a
                    href="https://www.culpepperconnections.com/historical/coat.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heritage-primary hover:text-heritage-secondary underline"
                  >
                    Culpepper Connections - The Culpeper/Colepeper Coat of Arms
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Historical Context */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">Historical Context</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  The English Culpepers
                </h3>
                <p className="theme-text-secondary leading-relaxed text-sm mb-4">
                  The Culpepper family of England rose to prominence in Kent during the medieval
                  period. They held extensive lands and titles, including:
                </p>
                <ul className="space-y-2 text-sm theme-text-tertiary">
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>Barons Culpeper of Thoresway (created 1644)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>Lords of multiple manors in Kent and Sussex</span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>Colonial administrators in Virginia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>
                      Notable members included Thomas, Lord Culpeper, Governor of Virginia
                    </span>
                  </li>
                </ul>
              </div>

              <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md theme-border border">
                <h3 className="text-xl font-semibold mb-4 text-heritage-secondary">
                  Virginia Connection
                </h3>
                <p className="theme-text-secondary leading-relaxed text-sm mb-4">
                  While the coat of arms and motto were associated with the noble English Culpepers,
                  the relationship to American Culpeppers remains a subject of research:
                </p>
                <ul className="space-y-2 text-sm theme-text-tertiary">
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>
                      Henry Culpeper of Virginia (our progenitor) used various spellings of the name
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>No documented right to bear the noble family&apos;s arms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>DNA evidence suggests a separate line from noble Culpepers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="theme-text-primary mr-2">•</span>
                    <span>The crest remains a symbol of family heritage and identity</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Heraldic Significance */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">
              Understanding Heraldry
            </h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                The system of heraldry developed in medieval Europe as a way to identify knights in
                battle and establish noble lineage. Each element of a coat of arms carried specific
                meaning:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">Colors (Tinctures)</h4>
                  <p className="text-sm">
                    Each color in heraldry has symbolic meaning. Red (gules) represents courage and
                    military strength, while silver (argent) symbolizes peace and sincerity.
                  </p>
                </div>

                <div className="theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">Patterns (Ordinaries)</h4>
                  <p className="text-sm">
                    The bend is one of the &ldquo;honorable ordinaries&rdquo; in heraldry. The
                    engrailed edge (wavy pattern) adds distinction and may reference water or land.
                  </p>
                </div>

                <div className="theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">Inheritance</h4>
                  <p className="text-sm">
                    Coats of arms were passed down through male lines and modified with additional
                    elements to distinguish different family branches.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Modern Usage */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-6 text-heritage-primary">Modern Usage</h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                Today, the Culpepper family crest serves as a symbol of family heritage and
                connection to our shared history. While most American Culpeppers do not have a legal
                right to bear the historic coat of arms, it remains an important symbol of family
                identity and pride.
              </p>

              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border mt-4">
                <h3 className="text-lg font-semibold mb-3 theme-text-primary">A Note on Usage</h3>
                <p className="text-sm leading-relaxed mb-3">
                  In traditional heraldry, coats of arms belong to individuals and their direct male
                  descendants, not to all people sharing a surname. As noted by Culpepper
                  Connections: &ldquo;Where Coats of Arms have existed, they have always been
                  associated with a specific family and the right to display the Coat passed from
                  generation to generation through the male line.&rdquo;
                </p>
                <p className="text-sm leading-relaxed">
                  While no modern day Culpepper can claim the legal &ldquo;right&rdquo; to display
                  this Coat of Arms, many have adopted it as a symbol of family heritage. The
                  Culpepper arms displayed on this website represent our family&apos;s historical
                  connection to the name, even though the exact relationship between American and
                  English Culpepers continues to be researched through DNA analysis and genealogical
                  records.
                </p>
              </div>

              <div className="mt-6 p-4 theme-bg-tertiary rounded theme-border border">
                <p className="text-sm leading-relaxed mb-2">
                  <strong className="theme-text-primary">Historical References:</strong>
                </p>
                <ul className="text-xs theme-text-tertiary space-y-1">
                  <li>
                    • Burke, John and John Bernard Burke:{' '}
                    <em>General Armory of England, Scotland, Ireland and Wales</em>. London:
                    Harrison and Sons, 1884.
                  </li>
                  <li>
                    • Michael Drayton&apos;s <em>The Barons Warres</em>, Canto 2, Verse 23:
                    &ldquo;And Culpeper, in Silver Arms enrayl&apos;d Bare thereupon a bloudie Bend
                    engrayl&apos;d&rdquo;
                  </li>
                  <li>
                    • Information compiled from{' '}
                    <a
                      href="https://www.culpepperconnections.com/historical/coat.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heritage-primary hover:text-heritage-secondary underline"
                    >
                      Culpepper Connections
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="text-center space-y-6 pt-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/history"
                className="px-8 py-3 theme-bg-accent hover:opacity-90 theme-text-on-accent rounded-lg font-semibold transition-opacity theme-shadow-md"
              >
                Back to Family History
              </Link>
              <Link
                href="/"
                className="px-8 py-3 theme-bg-tertiary hover:theme-bg-secondary theme-text-primary rounded-lg font-semibold transition-colors theme-shadow-md theme-border border-2"
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
