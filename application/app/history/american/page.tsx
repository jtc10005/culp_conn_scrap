import { checkRouteAccess } from '@lib';

export default async function AmericanPage() {
  await checkRouteAccess('history');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8">
        American Culpeppers: Building a Legacy (1653-Present)
      </h1>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-lg leading-relaxed mb-4">
          In May 1653, a young Englishman named Henry Culpeper arrived in colonial Virginia,
          bringing with him the Culpeper name to the New World. Through DNA testing and genealogical
          research, we have traced approximately <strong>80% of American Culpeppers</strong> to this
          single common ancestor. This is the story of how one family spread from a small settlement
          in Lower Norfolk County to all 50 states, creating a legacy that spans over 370 years.
        </p>
      </section>

      {/* Henry Culpeper Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">
          Henry Culpeper of Lower Norfolk County: The Progenitor
        </h2>

        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">About Henry</h3>
          <p className="mb-4">
            Henry Culpeper (circa 1633 - after 1675) is the proven progenitor of most American
            Culpeppers. Through Y-DNA testing, 117 Culpepper males have been tested, and 80% share
            close DNA relationships that all trace back to Henry.<sup>[1]</sup>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Life Timeline</h3>
            <ul className="space-y-3">
              <li>
                <strong>Born:</strong> circa 1633, England
              </li>
              <li>
                <strong>Arrived in Virginia:</strong> May 1653 or earlier
              </li>
              <li>
                <strong>First Record:</strong> 1658, listed as &ldquo;Planter&rdquo; in Lancaster
                County, VA
              </li>
              <li>
                <strong>Settled:</strong> Lower Norfolk County, VA by 1667
              </li>
              <li>
                <strong>Marriage:</strong> circa 1660 to Elizabeth Green
              </li>
              <li>
                <strong>Last Record:</strong> August 1675
              </li>
              <li>
                <strong>Death:</strong> after 1675, Lower Norfolk County, VA
              </li>
            </ul>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Historical Significance</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>
                  Proven through Y-DNA testing to be the progenitor of approximately 80% of American
                  Culpeppers<sup>[1]</sup>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Property owner and cattle farmer, suggesting a person of means</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>
                  Literate and educated, signed deeds with a distinctive script &ldquo;H&rdquo;
                  <sup>[2]</sup>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>
                  Known children: Robert Culpepper (b. 1664) and Henry Culpepper Jr. (b. 1669)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">
          Colonial Virginia: Three Phases of Henry&apos;s Life
        </h3>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h4 className="text-xl font-semibold mb-2">
              Phase 1: Arrival and Early Establishment (1653-1658)
            </h4>
            <p className="mb-3">
              Henry likely arrived in Virginia in May 1653 or earlier, paying for his own passage
              rather than arriving as an indentured servant. This is significant because it suggests
              he had financial means—indenture was the common method for working-class English
              immigrants to afford passage to America.<sup>[2]</sup>
            </p>
            <p className="mb-3">
              Shortly after arrival, he sold his <em>headright</em> (a claim to 50 acres of land
              given to those who paid their own passage) to Captain Nathaniel Hurd. This suggests
              Henry either had access to better land through other means, or he preferred immediate
              capital to start his enterprises.<sup>[2]</sup>
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h4 className="text-xl font-semibold mb-2">
              Phase 2: Lancaster County Period (1658-1667)
            </h4>
            <p className="mb-3">
              By December 1658, court records show &ldquo;Henry Colepepper, Planter&rdquo; selling
              cattle in Lancaster County. The designation &ldquo;Planter&rdquo; indicated property
              ownership and agricultural pursuits—within five years of arrival, Henry had
              established himself as a landowner and livestock farmer.<sup>[2]</sup>
            </p>
            <p className="mb-3">
              The cattle sale demonstrates that Henry was engaged in commercial agriculture, not
              merely subsistence farming. Colonial Virginia&apos;s economy was largely based on
              tobacco, but successful planters diversified with livestock, which provided both food
              security and additional income.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h4 className="text-xl font-semibold mb-2">
              Phase 3: Lower Norfolk County Settlement (1667-1675)
            </h4>
            <p className="mb-3">
              By 1667, Henry had relocated to Lower Norfolk County (in present-day southeastern
              Virginia, including areas now part of Norfolk and Virginia Beach). This would remain
              his home for the rest of his documented life.<sup>[2]</sup>
            </p>
            <p className="mb-3">
              Court records from this period reveal an active member of the colonial community:
            </p>
            <ul className="ml-6 space-y-2 text-sm">
              <li>
                • Numerous land transactions along Little Creek and the Western Branch of the
                Elizabeth River
              </li>
              <li>
                • Served as appraiser for estates (a position of trust given to respected community
                members)
              </li>
              <li>• Witnessed legal documents (indicating literacy and standing)</li>
              <li>• Bought, sold, and managed significant properties and livestock</li>
            </ul>
            <p className="mt-3">
              His last documented appearance in colonial records is August 1675, after which the
              historical trail goes cold. He presumably died shortly thereafter in Lower Norfolk
              County.<sup>[2]</sup>
            </p>
          </div>
        </div>
      </section>

      {/* Family Life Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Henry&apos;s Family</h2>

        <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Elizabeth, Wife of Henry</h3>
          <p className="mb-4">
            Henry married a woman named Elizabeth, whose maiden name was likely{' '}
            <strong>Green</strong>, around 1660. Several land transactions required Elizabeth&apos;s
            consent (as indicated by notations in deeds), suggesting she may have brought property
            to the marriage from a previous union or inheritance.<sup>[2]</sup>
          </p>
          <p>
            Under English common law (which governed Virginia), a married woman&apos;s property
            became her husband&apos;s, but certain transactions still required her explicit consent,
            especially regarding lands she brought to the marriage. The presence of these consent
            notations suggests Elizabeth had independent property rights that Henry respected.
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-4">The Next Generation: Two Sons</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Robert Culpepper (circa 1664)</h4>
            <p className="text-sm mb-3">
              The elder son, Robert established his own family in Norfolk County and continued the
              family&apos;s presence in Virginia. His descendants would spread throughout the colony
              and eventually beyond.
            </p>
            <p className="text-sm italic">
              Through Robert&apos;s line, numerous branches of the Culpepper family tree developed
              in Virginia and the Carolinas.
            </p>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-700 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Henry Culpepper Jr. (circa 1669)</h4>
            <p className="text-sm mb-3">
              The younger son, Henry Jr. also remained in the Norfolk County area, contributing to
              the growing Culpepper population in colonial Virginia.
            </p>
            <p className="text-sm italic">
              From these two sons—Robert and Henry Jr.—descended the vast majority of American
              Culpeppers, a genetic legacy confirmed by DNA testing in the 21st century.
            </p>
          </div>
        </div>
      </section>

      {/* English Origins Mystery */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">The English Connection: Ongoing Research</h2>

        <p className="mb-6">
          While Henry Culpeper&apos;s life in Virginia is well-documented through land deeds and
          court records, his exact English ancestry remains a subject of ongoing research. Several
          theories have been proposed, each with supporting evidence but none yet definitively
          proven:<sup>[3]</sup>
        </p>

        <div className="space-y-6">
          <div className="border-2 border-amber-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Theory 1: Son of John Culpeper &ldquo;the Merchant&rdquo;
            </h3>
            <p className="mb-3">
              <strong>Candidate:</strong> John Culpeper of Astwood in Feckenham and Ursula Woodcock
            </p>
            <p className="text-sm mb-2">
              <strong>Supporting Evidence:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-6">
              <li>• John was the right age to have a son born circa 1633</li>
              <li>• Known to have been abroad (could have sent son to Virginia)</li>
              <li>• Family had documented Virginia connections through the Virginia Company</li>
              <li>• Social status (merchant class) fits Henry&apos;s apparent means</li>
            </ul>
          </div>

          <div className="border-2 border-blue-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Theory 2: Son of Thomas Culpeper of the Middle Temple
            </h3>
            <p className="mb-3">
              <strong>Candidate:</strong> Thomas Culpeper, brother of John the Merchant, who was
              associated with the Middle Temple (legal profession)
            </p>
            <p className="text-sm mb-2">
              <strong>Supporting Evidence:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-6">
              <li>• Thomas&apos;s children are documented, but the list may not be complete</li>
              <li>• Neither parent left a will, leaving gaps in family documentation</li>
              <li>
                • Middle Temple connection suggests literacy and education (Henry was literate)
              </li>
              <li>• Family&apos;s legal connections might explain Henry&apos;s business acumen</li>
            </ul>
          </div>

          <div className="border-2 border-green-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Theory 3: Related to Sir Edward Culpeper of Wakehurst
            </h3>
            <p className="mb-3">
              <strong>Candidate:</strong> Connection to Sir Edward Culpeper, Knight, of the
              prestigious Wakehurst branch
            </p>
            <p className="text-sm mb-2">
              <strong>Supporting Evidence:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-6">
              <li>
                • Sir Edward signed the Third Virginia Charter in 1612, showing early family ties to
                Virginia
              </li>
              <li>• Wakehurst Culpepers were one of the most distinguished English branches</li>
              <li>• Noble connections might explain Henry&apos;s education and means</li>
              <li>• Timeline fits (Edward active in early 1600s, Henry born 1633)</li>
            </ul>
          </div>

          <div className="border-2 border-purple-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Theory 4: Henry Culpeper of London</h3>
            <p className="mb-3">
              <strong>Candidate:</strong> Henry baptized at St. Margaret&apos;s Church, Westminster,
              London (February 20, 1632), son of William Culpeper of London
            </p>
            <p className="text-sm mb-2">
              <strong>Supporting Evidence:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-6">
              <li>• Nearly exact age match (baptized 1632, Henry of Virginia born circa 1633)</li>
              <li>• Same given name (though common)</li>
              <li>• London was major port for Virginia-bound ships</li>
              <li>• William Culpeper of London was a merchant (means to send son abroad)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-6 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">DNA Evidence and Complications</h3>
          <p className="mb-3">
            DNA testing has provided crucial insights but also raised new questions. Y-DNA analysis
            shows that:<sup>[1]</sup>
          </p>
          <ul className="space-y-2 ml-6">
            <li>
              • American Culpeppers descended from Henry of Lower Norfolk are not closely related to
              Culpepers of Barbados, Puerto Rico, South Africa, India, or Australia
            </li>
            <li>
              • The Barbados line has been proven to descend from William Culpeper of Hunton and
              Wigsell (a different branch)
            </li>
            <li>
              • This suggests either:
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>→ False paternity somewhere in Henry&apos;s English lineage</li>
                <li>→ Descent from an as-yet unidentified English Culpeper branch</li>
                <li>
                  → William Culpeper of London was not connected to the famous Bedgebury Culpepers
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-4 text-sm italic">
            The search for Henry&apos;s English parents continues, combining traditional
            genealogical research with modern DNA analysis and English parish records. As more
            documents are digitized and more descendants participate in DNA testing, we may yet
            solve this 370-year-old mystery.
          </p>
        </div>
      </section>

      {/* Name Variations Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">The Culpepper Name: Spelling Variations</h2>

        <p className="mb-6">
          Throughout colonial and early American history, the family name appeared with various
          spellings—often different spellings for the same individual in different documents. This
          was typical of the era, when spelling standards were not yet formalized.<sup>[4]</sup>
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-4xl font-serif mb-3 text-blue-600 dark:text-blue-400">
              Culpeper
            </div>
            <p className="text-sm">
              <strong>English spelling</strong>, used by the noble families and in official British
              records
            </p>
          </div>

          <div className="text-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-4xl font-serif mb-3 text-green-600 dark:text-green-400">
              Culpepper
            </div>
            <p className="text-sm">
              <strong>Common American spelling</strong> variant, most prevalent among U.S.
              descendants
            </p>
          </div>

          <div className="text-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-4xl font-serif mb-3 text-purple-600 dark:text-purple-400">
              Colepeper
            </div>
            <p className="text-sm">
              <strong>Early colonial spelling</strong>, often found in 17th-century Virginia records
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-center italic">
            All three spellings appear in historical documents, sometimes for the same individual.
            Henry himself was recorded as &ldquo;Colepepper&rdquo; (1658), &ldquo;Culpeper&rdquo;
            (various dates), and other variants. Modern descendants use various spellings, with{' '}
            <strong>Culpepper</strong> being most common in America.
          </p>
        </div>
      </section>

      {/* DNA Project Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">The Culpepper DNA Project: Scientific Proof</h2>

        <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Revolutionizing Family History Research</h3>
          <p>
            The Culpepper Y-DNA Project at FamilyTreeDNA has transformed our understanding of family
            connections, providing scientific proof for relationships that were previously based
            only on documentary evidence. Y-DNA is passed from father to son virtually unchanged,
            making it an ideal tool for tracing patrilineal descent.<sup>[1]</sup>
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Key Findings</h3>

        <div className="space-y-4">
          <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <span className="text-3xl mr-4">✓</span>
            <div>
              <h4 className="font-semibold mb-1">117 Culpepper Males Tested</h4>
              <p className="text-sm">
                As of recent testing, 117 men bearing the Culpepper surname (and variants) have
                participated in the Y-DNA project, providing a substantial dataset for analysis.
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <span className="text-3xl mr-4">✓</span>
            <div>
              <h4 className="font-semibold mb-1">80% Share Close DNA Relationships</h4>
              <p className="text-sm">
                Approximately 80% of tested participants share close genetic relationships,
                indicating descent from a common ancestor within the genealogical timeframe (past
                400 years).
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <span className="text-3xl mr-4">✓</span>
            <div>
              <h4 className="font-semibold mb-1">Henry Culpeper Confirmed as Progenitor</h4>
              <p className="text-sm">
                All closely-related participants trace their documented genealogy back to Henry
                Culpeper of Lower Norfolk County, Virginia. DNA testing has definitively proven
                Henry as the common ancestor.
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <span className="text-3xl mr-4">✓</span>
            <div>
              <h4 className="font-semibold mb-1">Haplogroup I1: The Viking Connection</h4>
              <p className="text-sm">
                The Culpepper Y-DNA signature belongs to haplogroup I1, with a haplotype closely
                matching the &ldquo;Ultra-Norse Type 1 (Norway)&rdquo; signature. This suggests
                Viking/Norse ancestry, consistent with English Culpepers being descendants of Norse
                settlers in Britain.<sup>[5]</sup>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-3">What About the Other 20%?</h4>
          <p className="mb-3">
            The remaining 20% of tested Culpeppers fall into different genetic groups, indicating:
          </p>
          <ul className="space-y-2 ml-6 text-sm">
            <li>• Descent from other English Culpeper branches (not Henry&apos;s line)</li>
            <li>• Non-paternity events (adoption, surname changes, or undocumented parentage)</li>
            <li>• Independent adoption of the surname (possible but less likely)</li>
            <li>
              • Descent from other colonial Culpepper immigrants whose lines haven&apos;t been fully
              documented
            </li>
          </ul>
          <p className="mt-3 text-sm">
            These individuals are no less &ldquo;Culpepper&rdquo; in terms of family identity and
            heritage—they simply have different genetic origins, which is not uncommon in any
            surname study.
          </p>
        </div>
      </section>

      {/* Geographic Spread Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">
          From Virginia to All 50 States: The American Expansion
        </h2>

        <p className="mb-6">
          From Henry&apos;s settlement in Lower Norfolk County, Virginia, the Culpepper family
          spread in waves across the American continent. Each generation pushed further west and
          south, following the frontier, economic opportunities, and the promise of land.
        </p>

        <h3 className="text-2xl font-semibold mb-4">Migration Patterns</h3>

        <div className="space-y-6 mb-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h4 className="text-lg font-semibold mb-2">
              First Wave: Virginia Expansion (1670s-1750s)
            </h4>
            <p className="text-sm">
              Henry&apos;s sons and grandsons spread throughout Tidewater Virginia, then into the
              Piedmont region as coastal lands became crowded and expensive. By the mid-1700s,
              Culpeppers could be found throughout Virginia&apos;s counties.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h4 className="text-lg font-semibold mb-2">
              Second Wave: The Carolinas and Georgia (1750s-1800)
            </h4>
            <p className="text-sm">
              As Virginia lands filled, many Culpeppers joined the migration south into North
              Carolina, South Carolina, and eventually Georgia. These states show particularly heavy
              concentrations of Culpepper families to this day.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h4 className="text-lg font-semibold mb-2">
              Third Wave: Trans-Appalachian Migration (1780s-1850s)
            </h4>
            <p className="text-sm">
              Following the Revolutionary War, Culpeppers joined the great migration west through
              the Cumberland Gap and across the Appalachian Mountains. Tennessee and Kentucky became
              home to many family branches. By the 1830s-1840s, some had reached as far as Missouri,
              Arkansas, and Texas.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-6">
            <h4 className="text-lg font-semibold mb-2">
              Fourth Wave: Westward to the Pacific (1840s-1900)
            </h4>
            <p className="text-sm">
              The California Gold Rush, homestead opportunities, and railroad expansion drew
              Culpeppers to the far western states. By the late 1800s, family members had settled in
              California, Oregon, Washington, and throughout the Great Plains.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-6">
            <h4 className="text-lg font-semibold mb-2">
              Modern Dispersal: All 50 States (1900-Present)
            </h4>
            <p className="text-sm">
              The 20th century saw unprecedented mobility. World Wars, economic opportunities, and
              modern transportation allowed Culpeppers to scatter to every corner of the nation.
              Today, Culpepper families can be found in all 50 states, though concentrations remain
              highest in the southeastern states that were settled earliest.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Highest Concentrations Today</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { state: 'Virginia', emoji: '🏛️' },
            { state: 'North Carolina', emoji: '⛰️' },
            { state: 'South Carolina', emoji: '🌴' },
            { state: 'Georgia', emoji: '🍑' },
            { state: 'Tennessee', emoji: '🎸' },
            { state: 'Kentucky', emoji: '🐎' },
            { state: 'Texas', emoji: '🤠' },
            { state: 'California', emoji: '☀️' },
          ].map(({ state, emoji }) => (
            <div
              key={state}
              className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded border-2 border-blue-300 dark:border-blue-700"
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <span className="font-semibold">{state}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center italic text-sm">
          From one man in one Virginia county to families in all 50 states—the American Culpepper
          story is one of growth, migration, and enduring family connections.
        </p>
      </section>

      {/* Citations */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">References & Citations</h2>

        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">[1] DNA Testing and Genetic Genealogy</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/dna.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Culpepper Y-DNA Project
              </a>{' '}
              — FamilyTreeDNA and Culpepper Connections. Results from 117 tested males, showing 80%
              descend from Henry Culpeper of Lower Norfolk County. Includes haplogroup analysis and
              genetic distance calculations.
            </p>
          </div>

          <div className="border-l-4 border-green-600 pl-4">
            <p className="font-semibold">[2] Colonial Virginia Records</p>
            <p className="mb-2">
              <a
                href="https://www.culpepperconnections.com/archives/va/norfolk1661-1724.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Norfolk, Virginia Records (1667-1724)
              </a>{' '}
              — Culpepper Connections. Transcriptions of colonial court records, land deeds, and
              legal documents mentioning Henry Culpeper, his wife Elizabeth, and their descendants.
              Includes:
            </p>
            <ul className="ml-6 space-y-1">
              <li>• Lower Norfolk County Court Records (1667-1675)</li>
              <li>• Land deeds and property transactions</li>
              <li>• Estate appraisals and witness documents</li>
              <li>• Marriage and birth inference from land consent documents</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-600 pl-4">
            <p className="font-semibold">[3] English Origins Research</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/historical/theories/linkage.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                The English/New World Linkage
              </a>{' '}
              — Culpepper Connections. Comprehensive analysis of theories regarding Henry
              Culpeper&apos;s English parentage, including discussion of John Culpeper &ldquo;the
              Merchant,&rdquo; Thomas of the Middle Temple, Sir Edward Culpeper of Wakehurst, and
              William Culpeper of London.
            </p>
          </div>

          <div className="border-l-4 border-amber-600 pl-4">
            <p className="font-semibold">[4] Name Variations and Spelling</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/historical/namevariations.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Name Variations: Colepeper vs. Culpeper vs. Culpepper
              </a>{' '}
              — Culpepper Connections. Historical analysis of surname spelling variations throughout
              English and American records, with examples from medieval times through the present
              day.
            </p>
          </div>

          <div className="border-l-4 border-red-600 pl-4">
            <p className="font-semibold">[5] Viking/Norse Ancestry</p>
            <p>
              <a
                href="https://www.culpepperconnections.com/dna/history.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                The Culpepper Ancestral Journey
              </a>{' '}
              — Culpepper Connections. National Geographic Genographic Project report (2007) on
              haplogroup I1, Ultra-Norse Type 1 haplotype matching, and Viking heritage of the
              Culpepper Y-DNA signature.
            </p>
          </div>

          <div className="border-l-4 border-gray-500 pl-4">
            <p className="font-semibold">[6] Primary Source Website</p>
            <p>
              <a
                href="https://www.culpepperconnections.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Culpepper Connections
              </a>{' '}
              — The premier genealogical resource for the Culpepper family, maintained by Lewis
              Wyman Griffin, Jr. Contains extensive documentation, photographs, genealogical
              records, historical treatises, DNA project results, and ongoing research.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-xs italic">
            <strong>Note:</strong> This page serves as a comprehensive overview of American
            Culpepper history based on research compiled at Culpepper Connections. For complete
            source documents, additional research materials, and ongoing updates, visit{' '}
            <a
              href="https://www.culpepperconnections.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              www.culpepperconnections.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Continue Exploring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/history"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <h4 className="text-lg font-semibold mb-2">← Back to History Overview</h4>
            <p className="text-sm">Return to the main history page</p>
          </a>
          <a
            href="/history/pre-immigration"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <h4 className="text-lg font-semibold mb-2">English Origins (Pre-1653) →</h4>
            <p className="text-sm">Medieval Culpepers and the journey from England</p>
          </a>
        </div>
      </div>
    </div>
  );
}
