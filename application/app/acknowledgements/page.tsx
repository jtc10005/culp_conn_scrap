import Image from 'next/image';
import Link from 'next/link';
import { checkRouteAccess } from '@lib';

export const metadata = {
  title: 'Acknowledgements - Culpepper.Info',
  description: 'Credits and acknowledgements for the Culpepper family genealogy project',
};

export default async function AcknowledgementsPage() {
  await checkRouteAccess('acknowledgements');
  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/culpepper_crest_no_bg.png"
              alt="Culpepper Family Crest"
              width={150}
              height={150}
              priority
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">Acknowledgements</h1>
          <p className="text-xl theme-text-secondary">Standing on the Shoulders of Giants</p>
        </div>

        {/* Main Acknowledgement Section */}
        <div className="space-y-8">
          {/* Primary Credit */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-heritage-primary mb-2">
                Lewis Wyman Griffin, Jr.
              </h2>
              <p className="text-lg theme-text-secondary">Publisher, Culpepper Connections</p>
            </div>

            <div className="prose max-w-none space-y-4 theme-text-primary">
              <p className="text-lg leading-relaxed">
                This website would not exist without the extraordinary genealogical research and
                dedication of <strong>Lewis Wyman Griffin, Jr.</strong>, the publisher and
                maintainer of{' '}
                <a
                  href="https://www.culpepperconnections.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-heritage-primary hover:text-heritage-secondary underline font-semibold"
                >
                  Culpepper Connections
                </a>
                .
              </p>

              <div className="theme-bg-tertiary p-6 rounded-lg theme-border border my-6">
                <p className="text-center text-xl font-semibold theme-text-primary italic">
                  &ldquo;All Culpepper family information, genealogical data, historical records,
                  and biographical details presented on this website have been sourced from the
                  Culpepper Connections website.&rdquo;
                </p>
              </div>

              <p className="leading-relaxed">
                Mr. Griffin&apos;s meticulous research has compiled decades of genealogical records,
                DNA testing results, historical documents, and family connections into the most
                comprehensive resource on the Culpepper family. His work has connected thousands of
                Culpepper descendants and preserved invaluable family history for future
                generations.
              </p>

              <p className="leading-relaxed">
                The data presented on Culpepper.Info, including family relationships, biographical
                information, historical context, and DNA project results, is drawn directly from the
                extensive research compiled on Culpepper Connections. We are deeply grateful for his
                tireless efforts in documenting our shared heritage.
              </p>
            </div>
          </section>

          {/* Culpepper Connections Website */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-2xl font-bold mb-4 text-heritage-primary">
              About Culpepper Connections
            </h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                <a
                  href="https://www.culpepperconnections.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-heritage-primary hover:text-heritage-secondary underline font-semibold text-lg"
                >
                  www.culpepperconnections.com
                </a>
              </p>

              <p className="leading-relaxed">
                Culpepper Connections is the premier genealogical resource for the Culpepper family,
                featuring:
              </p>

              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Comprehensive family tree with thousands of documented individuals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Historical documents, deeds, wills, and court records</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>DNA testing project results and genetic genealogy research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Biographical notes and family histories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Photo archives and historical images</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Connection to related families and marriages</span>
                </li>
              </ul>

              <div className="mt-6 p-4 theme-bg-tertiary rounded theme-border border">
                <p className="text-sm leading-relaxed">
                  <strong className="theme-text-primary">
                    For the most complete and authoritative information
                  </strong>{' '}
                  on the Culpepper family, we encourage you to visit the original Culpepper
                  Connections website. This site serves as a modern, interactive visualization of
                  that invaluable research.
                </p>
              </div>
            </div>
          </section>

          {/* Additional Contributors */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-2xl font-bold mb-4 text-heritage-primary">
              Contributing Researchers
            </h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                The Culpepper Connections website represents the collective efforts of numerous
                genealogists, historians, and family members who have contributed research,
                documents, and family information over many years, including:
              </p>

              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>DNA testing participants in the Culpepper Y-DNA Project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>
                    Professional genealogists who have researched colonial Virginia records
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Family historians who have shared documents, photos, and stories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-heritage-primary mr-2">•</span>
                  <span>Volunteers who have transcribed historical records and documents</span>
                </li>
              </ul>

              <p className="leading-relaxed mt-4">
                We extend our gratitude to all who have contributed to preserving and sharing
                Culpepper family history.
              </p>
            </div>
          </section>

          {/* Technology & Tools */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-2xl font-bold mb-4 text-heritage-primary">Technology & Tools</h2>
            <div className="space-y-3 theme-text-secondary">
              <p className="leading-relaxed">
                This website was built using modern web technologies to provide an interactive and
                accessible experience:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">Frontend</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Next.js 16 - React framework</li>
                    <li>• TypeScript - Type safety</li>
                    <li>• Tailwind CSS - Styling</li>
                    <li>• D3.js - Tree visualization</li>
                  </ul>
                </div>

                <div className="theme-bg-tertiary p-4 rounded theme-border border">
                  <h4 className="font-semibold theme-text-primary mb-2">Backend</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Neo4j - Graph database</li>
                    <li>• Node.js - Server runtime</li>
                    <li>• Vercel - Hosting platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Copyright Notice */}
          <section className="theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-2xl font-bold mb-4 text-heritage-primary">Copyright & Usage</h2>
            <div className="space-y-4 theme-text-secondary">
              <p className="leading-relaxed">
                All genealogical data, historical information, and research presented on this
                website is sourced from Culpepper Connections and remains the intellectual property
                of its contributors and publishers.
              </p>

              <p className="leading-relaxed">
                This website serves as a modern visualization and interface for accessing that
                research. For questions about data accuracy, updates, or contributions to the
                genealogical record, please visit the original Culpepper Connections website.
              </p>

              <div className="mt-6 p-4 theme-bg-tertiary rounded theme-border border">
                <p className="text-sm leading-relaxed">
                  <strong className="theme-text-primary">Note:</strong> If you are a family member
                  with corrections, additions, or updated information, please contact Culpepper
                  Connections directly to ensure the genealogical record is properly maintained and
                  updated.
                </p>
              </div>
            </div>
          </section>

          {/* Gratitude */}
          <section className="text-center theme-bg-secondary p-8 rounded-lg theme-shadow-lg theme-border border-2">
            <h2 className="text-3xl font-bold mb-4 text-heritage-primary">
              With Deepest Gratitude
            </h2>
            <p className="text-lg theme-text-secondary leading-relaxed max-w-2xl mx-auto">
              To Lewis Wyman Griffin, Jr. and all the researchers, contributors, and family members
              who have dedicated countless hours to preserving our shared heritage—
              <span className="block mt-4 text-xl font-semibold theme-text-primary">
                Thank you.
              </span>
            </p>
          </section>

          {/* Navigation */}
          <section className="text-center space-y-6 pt-8">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.culpepperconnections.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 theme-bg-accent hover:opacity-90 theme-text-on-accent rounded-lg font-semibold transition-opacity theme-shadow-md"
              >
                Visit Culpepper Connections
              </a>
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
