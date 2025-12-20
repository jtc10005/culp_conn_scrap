import { checkRouteAccess } from '@lib';

export default async function PreImmigrationPage() {
  await checkRouteAccess('history');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8">English Origins: The Culpeper Story</h1>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-lg leading-relaxed mb-4">
          The Culpeper family&apos;s documented English history spans over 500 years, from the late
          12th century through the colonial period. Through extensive genealogical research and DNA
          analysis, we can trace our ancestral journey even further back—from prehistoric Africa to
          Ice Age Europe, and ultimately to medieval England where the Culpeper name first appears
          in historical records.
        </p>
      </section>

      {/* DNA Journey Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">
          The Ancient Ancestry: 60,000 Years of Migration
        </h2>

        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Haplogroup I1: The Viking Connection</h3>
          <p className="mb-4">
            DNA testing through the National Geographic Genographic Project reveals that Henry
            Culpeper (progenitor of most American Culpeppers) and his descendants belong to{' '}
            <strong>haplogroup I1</strong>, characterized by the Y-chromosome markers: M168 &gt; M89
            &gt; M170 &gt; M253.<sup>[1]</sup>
          </p>
          <p className="mb-4">
            The I1 Project at Family Tree DNA has identified that the Culpepper haplotype closely
            matches the <strong>Ultra-Norse Type 1 (Norway)</strong>, suggesting that the Culpeppers
            who first appeared in 12th century England were likely Viking descendants. The Vikings
            raided and colonized wide areas of Europe from the late 8th to the 11th century.
            <sup>[1]</sup>
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-4">The Ancestral Journey Timeline</h3>

        <div className="space-y-6 ml-4 border-l-4 border-blue-500 pl-6">
          <div>
            <h4 className="text-xl font-semibold mb-2">M168: Out of Africa (50,000 years ago)</h4>
            <p className="mb-2">
              Our earliest common ancestor lived in northeast Africa, possibly in present-day
              Ethiopia, Kenya, or Tanzania. His descendants became the only lineage to survive
              outside of Africa, making him the common ancestor of every non-African man living
              today.<sup>[1]</sup>
            </p>
            <p className="text-sm italic">
              Location: Rift Valley region | Climate: End of African drought, Sahara becoming
              habitable | Tools: Stone tools, earliest art
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">
              M89: The Middle East Migration (45,000 years ago)
            </h4>
            <p className="mb-2">
              This marker is found in 90-95% of all non-Africans. Our ancestors followed expanding
              grasslands and game herds to the Middle East, part of the second great wave of
              migration out of Africa. When drought closed the Saharan Gateway around 40,000 years
              ago, they continued eastward along the Central Asian &ldquo;superhighway&rdquo; of
              grass-covered plains.<sup>[1]</sup>
            </p>
            <p className="text-sm italic">
              Location: Northern Africa/Middle East | Climate: Semiarid grasslands | Tools: Stone,
              ivory, wood implements
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">
              M170: The Balkans Settlement (20,000 years ago)
            </h4>
            <p className="mb-2">
              Our ancestors migrated northwest into the Balkans and central Europe during the height
              of the Ice Age. They may have been responsible for the expansion of the Gravettian
              culture (21,000-28,000 years ago), known for distinctive stone hunting tools,
              &ldquo;Venus&rdquo; fertility figurines, shell jewelry, and mammoth-bone dwellings.
              <sup>[1]</sup>
            </p>
            <p className="text-sm italic">
              Location: Southeastern Europe | Culture: Gravettian (Upper Paleolithic) | Innovation:
              Early weaving (25,000 years ago)
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">M253: Ice Age Refugia (15,000 years ago)</h4>
            <p className="mb-2">
              The distinctive genetic marker M253 appeared in a male ancestor who survived the last
              ice age in the Iberian Peninsula (Spain). As the Earth warmed around 15,000 years ago,
              these refugia dwellers left Spain and repopulated ice-free northern Europe, carrying
              this unique marker that defines haplogroup I1. Today this marker is found in high
              frequencies throughout northwest Europe.<sup>[1]</sup>
            </p>
            <p className="text-sm italic">
              Location: Iberian Refugia (Spain) | Climate: Ice-free temperate zones | Era: Late
              Upper Paleolithic
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">Viking Heritage (8th-11th centuries AD)</h4>
            <p className="mb-2">
              The Ultra-Norse Type 1 haplotype match indicates that by medieval times, our direct
              ancestors were likely Norse seafarers who raided and colonized England. The Viking
              invasions and settlements of England (particularly the Danelaw region) would provide
              the pathway for Scandinavian families to establish themselves in Britain.
              <sup>[1]</sup>
            </p>
            <p className="text-sm italic">
              Location: Scandinavia to England | Period: Late 8th to 11th century | Cultural impact:
              Danelaw settlements
            </p>
          </div>
        </div>
      </section>

      {/* Medieval English Records */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">
          Medieval England: The First Documented Culpeppers
        </h2>

        <div className="bg-amber-50 dark:bg-amber-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">The Written Record Begins (Late 1100s)</h3>
          <p>
            While DNA evidence traces our ancestry back 60,000 years, the documented Culpeper family
            history begins in the late 12th century with written records from medieval England. The
            name &ldquo;Colepeper&rdquo; (later spelled various ways including Culpeper and
            Culpepper) first appears in court rolls and land deeds from Sussex and Kent.
            <sup>[2]</sup>
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-4">
          Thomas de Colepeper: The Earliest Documented Ancestor
        </h3>
        <p className="mb-4">
          The earliest known Culpeper in documented records is <strong>Thomas de Colepeper</strong>,
          who served as a <em>Recognitor of the Grand Assize</em>. This was not a judicial position
          but rather a juror role—twelve recognitors were chosen to settle disputes over land
          ownership by declaring which party had better right to the property.<sup>[2]</sup>
        </p>
        <p className="mb-4">
          Thomas had a son named <strong>John</strong>, and a grandson who bore his name,{' '}
          <strong>Sir Thomas Colepeper of Bayhall</strong>. This Sir Thomas would become a pivotal
          figure in the family&apos;s early history, though his life ended tragically during one of
          medieval England&apos;s great rebellions.<sup>[2]</sup>
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8">
          The Earl of Lancaster Rebellion (1321-1322)
        </h3>
        <p className="mb-4">
          In 1321-1322, England was torn by civil war. Thomas, Earl of Lancaster, led a rebellion
          against King Edward II. Sir Thomas Colepeper of Bayhall joined the Earl&apos;s cause,
          fighting at the <strong>Battle of Boroughbridge</strong> in March 1322. The rebellion
          failed catastrophically—the Earl was captured and executed, and many of his followers met
          similar fates.<sup>[2]</sup>
        </p>
        <p className="mb-4">
          Sir Thomas Colepeper was captured and <strong>executed at Winchelsea</strong> in 1321
          (some sources say 1322). His execution was part of King Edward II&apos;s brutal
          suppression of the rebellion. The Colepeper estates were seized by the Crown.
          <sup>[2]</sup>
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8">Four Sons, Four Fates</h3>
        <p className="mb-4">
          Sir Thomas and his wife Margery (possibly of the Bayhall family) had four sons, each of
          whom faced the consequences of their father&apos;s rebellion:<sup>[2]</sup>
        </p>

        <div className="ml-6 space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-lg">Thomas Colepeper (eldest)</h4>
            <p>
              Executed at Winchelsea alongside his father in 1321 for supporting the Earl of
              Lancaster&apos;s rebellion.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-lg">Walter Colepeper</h4>
            <p>
              Met perhaps the most dramatic fate of all four brothers. In October 1323, Queen Isabel
              (wife of Edward II) approached Leeds Castle in Kent, seeking entrance. Walter
              Colepeper, who held the castle, <strong>refused the Queen entry</strong>. This act of
              defiance enraged the King, who besieged the castle. After its capture, Walter was{' '}
              <strong>hanged</strong> for his impudence. This incident became known as the
              &ldquo;Leeds Castle Affair.&rdquo;<sup>[2]</sup>
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg">John Colepeper</h4>
            <p>
              Like his father and eldest brother, John fought at the Battle of Boroughbridge. He was
              captured and imprisoned. However, unlike his executed relatives, John survived. When{' '}
              <strong>King Edward III</strong> (son of Edward II) came to power, he released John
              from prison. John went on to continue the family line and eventually recovered some of
              the family estates.<sup>[2]</sup>
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg">Nicholas Colepeper</h4>
            <p>
              Also imprisoned following the rebellion but later released. Nicholas, like John,
              survived the political turmoil and helped restore the family&apos;s fortunes in
              subsequent years.<sup>[2]</sup>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg mt-6">
          <h4 className="font-semibold mb-2">Property Restoration</h4>
          <p>
            After the executions, the family estates—including lands at Pepinbury, Bayhall, and
            Frant—were seized by the Crown. However, the estates were eventually returned to{' '}
            <strong>Margery</strong>, the widow of Sir Thomas, suggesting some measure of royal
            clemency or successful legal appeal. Through John and Nicholas, the surviving brothers,
            the Colepeper family would rebuild and eventually thrive.<sup>[2]</sup>
          </p>
        </div>
      </section>

      {/* Major Family Branches */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">The Great Branches: 14th-17th Centuries</h2>

        <p className="mb-6">
          From these turbulent beginnings, the Colepeper family spread throughout southern England,
          establishing several major branches that would flourish for centuries. As noted in{' '}
          <em>The Sussex Colepepers</em> (1904-1905): &ldquo;To write a history of the family of
          Colepeper in all its different branches would take up a good many volumes.&rdquo;
          <sup>[2]</sup>
        </p>

        <div className="space-y-6">
          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Sussex Colepepers (Main Line)</h3>
            <p className="mb-2">
              The principal branch, descended from the survivors of the Lancaster rebellion,
              maintained significant holdings in Sussex including estates at Wakehurst, Ardingly,
              and other properties. This line produced numerous knights, members of Parliament, and
              prominent landholders throughout the medieval and Tudor periods.<sup>[2]</sup>
            </p>
            <p className="text-sm italic">Primary holdings: Sussex | Period: 14th-17th centuries</p>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Wakehurst Branch</h3>
            <p className="mb-2">
              One of the most distinguished branches, the Wakehurst Colepepers held the manor of
              Wakehurst (now home to Kew Gardens&apos; countryside estate) for many generations.
              This branch included several notable figures who served in Parliament and held
              important positions in county administration.<sup>[2]</sup>
            </p>
            <p className="text-sm italic">
              Primary holdings: Wakehurst, Sussex | Period: 14th-17th centuries
            </p>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Wigsell Branch</h3>
            <p className="mb-2">
              This branch held estates at Wigsell in Sussex. Like other branches, they played
              important roles in local governance and maintained significant landholdings throughout
              the medieval period.<sup>[2]</sup>
            </p>
            <p className="text-sm italic">
              Primary holdings: Wigsell, Sussex | Period: 14th-17th centuries
            </p>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Kent Branches</h3>
            <p className="mb-2">
              Several Colepeper branches established themselves in Kent, including families at
              Bedgebury, Folkington, Penton, Sevenoaks, and Oxen Hoath. The Leeds Castle incident of
              1323 demonstrates the family&apos;s early presence in Kent. These branches
              intermarried with other prominent Kentish families and maintained their own distinct
              lineages.<sup>[2]</sup>
            </p>
            <p className="text-sm italic">
              Primary holdings: Various Kent locations | Period: 14th-17th centuries
            </p>
          </div>
        </div>
      </section>

      {/* Colonial Connections */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">
          The Path to America: Virginia Company Connections
        </h2>

        <p className="mb-4">
          By the early 17th century, several Colepeper family members were positioned to play
          significant roles in England&apos;s colonial ventures. Members of the family appear in
          records related to the Virginia Company and the early colonization of America:
          <sup>[3]</sup>
        </p>

        <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Virginia Company Charters (1609 & 1612)</h3>
          <p className="mb-3">
            Colepeper family members were among the adventurers and patentees listed in the Second
            Charter (1609) and Third Charter (1612) of the Virginia Company. These charters granted
            rights to colonize and govern Virginia, and being listed as a patentee indicated
            financial investment in the colonial venture.<sup>[3]</sup>
          </p>
          <p className="text-sm">
            This documented involvement with the Virginia Company provides a crucial link between
            the medieval English Colepepers and the American Culpeppers who would arrive in Virginia
            by the mid-17th century.
          </p>
        </div>

        <div className="border-l-4 border-blue-500 pl-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">The Fairfax-Culpeper Connection</h3>
          <p className="mb-3">
            Thomas Culpeper, 2nd Baron Culpeper of Thoresway, inherited the proprietorship of the
            Northern Neck of Virginia (between the Rappahannock and Potomac rivers) through his
            marriage to Margaret, daughter of Thomas Fairfax. This massive land grant, originally
            awarded to loyal supporters of King Charles II, represented approximately 5 million
            acres.<sup>[3]</sup>
          </p>
          <p>
            While Henry Culpeper of Lower Norfolk County (progenitor of most American Culpeppers)
            arrived in Virginia before this land grant came into Culpeper hands, the Northern Neck
            Proprietorship demonstrates the family&apos;s continued prominence and connection to
            Virginia throughout the colonial period.<sup>[3]</sup>
          </p>
        </div>

        <p className="text-lg font-semibold">
          By the 1650s, the stage was set for the Culpeper family&apos;s permanent establishment in
          America, as Henry Culpeper arrived in Virginia to begin a new chapter in the family&apos;s
          long history.
        </p>
      </section>

      {/* Citations */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">References & Citations</h2>

        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">[1] DNA & Genetic History</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/dna/history.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                &ldquo;The Culpepper Ancestral Journey&rdquo;
              </a>{' '}
              — Culpepper Connections. Based on report from National Geographic Genographic Project
              (July 2007) for Warren Culpepper. Includes haplogroup I1 analysis, Y-chromosome
              markers (M168, M89, M170, M253), and Ultra-Norse Type 1 haplotype matching. Updated 02
              Jan 2015.
            </p>
            <p className="mt-2">
              <a
                href="https://www.culpepperconnections.com/dna.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                DNA Project Overview
              </a>{' '}
              — Culpepper Connections. Details on the Culpepper DNA testing program, haplogroup
              analysis, and Viking ancestry.
            </p>
          </div>

          <div className="border-l-4 border-amber-600 pl-4">
            <p className="font-semibold">[2] Medieval English History</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/historical/sussex/default.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <em>The Sussex Colepepers</em>
              </a>{' '}
              by Col. F. W. T. Attree, J.P., F.S.A. and Rev. J. H. L. Booker (1904-1905). Originally
              published in <em>Sussex Archaeological Collections</em>, Vol. 47 and 48. Available
              online at Culpepper Connections.
            </p>
            <p className="mt-2 ml-4">
              •{' '}
              <a
                href="https://www.culpepperconnections.com/historical/sussex/2-first4.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Chapter II: &ldquo;The First Four Generations&rdquo;
              </a>{' '}
              — Details on Thomas de Colepeper (Recognitor), Sir Thomas of Bayhall, the Earl of
              Lancaster rebellion (1321-1322), executions at Winchelsea, the Leeds Castle incident
              (1323), and the four sons. Cites Close Rolls, De Banco records, Harleian manuscripts,
              Inquisitions Post Mortem, and land deeds from the Public Record Office.
            </p>
          </div>

          <div className="border-l-4 border-purple-600 pl-4">
            <p className="font-semibold">[3] Colonial Virginia Connections</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/historical/proprietors.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                &ldquo;Proprietors of the Northern Neck&rdquo;
              </a>{' '}
              — Culpepper Connections. Documents Thomas Culpeper, 2nd Baron&apos;s inheritance of
              the Northern Neck Proprietorship through marriage to Margaret Fairfax. Covers the
              5-million-acre land grant between the Rappahannock and Potomac rivers.
            </p>
            <p className="mt-2">
              Virginia Company Charters (Second Charter 1609, Third Charter 1612) — Colepeper family
              members listed as adventurers and patentees in colonial ventures. Referenced in
              various historical documents on Culpepper Connections.
            </p>
          </div>

          <div className="border-l-4 border-green-600 pl-4">
            <p className="font-semibold">[4] Additional Resources</p>
            <p>
              <a
                href="https://www.culpepperconnections.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Culpepper Connections Main Site
              </a>{' '}
              — Comprehensive family history website with extensive documentation, photographs,
              genealogical records, and research materials.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/history"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <h4 className="text-lg font-semibold mb-2">← Back to History Overview</h4>
            <p className="text-sm">Return to the main history page</p>
          </a>
          <a
            href="/history/american"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <h4 className="text-lg font-semibold mb-2">American Culpeppers (1653-Present) →</h4>
            <p className="text-sm">
              Henry Culpeper&apos;s arrival in Virginia and the American lineage
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
