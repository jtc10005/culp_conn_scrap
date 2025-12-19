import Link from 'next/link';
import { checkRouteAccess } from '@lib';

export const metadata = {
  title: 'About - Culpepper.Info',
  description: 'Learn about the technology and process behind Culpepper.info',
};

export default async function AboutPage() {
  await checkRouteAccess('about');

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold theme-text-primary mb-4">About This Project</h1>
          <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
            A modern web application for exploring and preserving the Culpepper family genealogy
          </p>
        </div>

        {/* Technology Stack */}
        <section className="mb-12">
          <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 theme-border border">
            <h2 className="text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              Technology Stack
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold theme-text-accent mb-3">Frontend</h3>
                <ul className="space-y-2 theme-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>Next.js 16</strong> - React framework with App Router for server &
                      client components
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>React 19</strong> - Modern UI library with hooks and server components
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>TypeScript 5</strong> - Type-safe development with strict mode
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>Tailwind CSS 4</strong> - Utility-first styling with custom theme
                      system
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>D3.js 7</strong> - Interactive family tree visualization
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold theme-text-accent mb-3">Backend & Data</h3>
                <ul className="space-y-2 theme-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>Neo4j Aura</strong> - Graph database perfect for family relationships
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>ConfigCat</strong> - Feature flags for dynamic configuration
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>Vercel</strong> - Deployment platform with GitHub integration
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="theme-text-accent mt-1">▸</span>
                    <div>
                      <strong>Node.js</strong> - Runtime for data scraping and processing
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Collection Process */}
        <section className="mb-12">
          <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 theme-border border">
            <h2 className="text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
              <span className="text-4xl">📊</span>
              Data Collection Process
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full theme-bg-accent theme-text-on-accent flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">Source Data</h3>
                  <p className="theme-text-secondary">
                    All genealogy data is sourced from{' '}
                    <a
                      href="https://culpepperconnections.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-text-accent hover:underline"
                    >
                      Culpepper Connections
                    </a>
                    , a comprehensive genealogy website maintained by Lewis Wyman Griffin Jr.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full theme-bg-accent theme-text-on-accent flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">Web Scraping</h3>
                  <p className="theme-text-secondary">
                    A custom TypeScript scraper fetches HTML pages from the source website, parsing
                    person records, relationships (parents, spouses, siblings), and biographical
                    details using Cheerio for HTML parsing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full theme-bg-accent theme-text-on-accent flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">
                    Graph Database Import
                  </h3>
                  <p className="theme-text-secondary">
                    Data is transformed and imported into Neo4j, a graph database ideal for modeling
                    family relationships. Each person becomes a node, with edges representing
                    PARENT_OF, SPOUSE_OF, and SIBLING_OF relationships.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full theme-bg-accent theme-text-on-accent flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">Web Application</h3>
                  <p className="theme-text-secondary">
                    Next.js queries Neo4j to build interactive family tree visualizations,
                    searchable person directories, and detailed person pages. The graph database
                    makes it efficient to traverse family relationships across generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 theme-border border">
            <h2 className="text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
              <span className="text-4xl">✨</span>
              Key Features
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">
                  🌳 Interactive Family Tree
                </h3>
                <p className="theme-text-secondary text-sm">
                  D3.js-powered visualization with zoom, pan, and click-to-expand functionality for
                  exploring family connections.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">🔍 People Search</h3>
                <p className="theme-text-secondary text-sm">
                  Debounced search across all records with filtering by name, birthplace, and other
                  criteria.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">🌓 Dark Mode</h3>
                <p className="theme-text-secondary text-sm">
                  Custom CSS theme system with localStorage persistence and FOUC prevention using
                  blocking scripts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">🚦 Feature Flags</h3>
                <p className="theme-text-secondary text-sm">
                  ConfigCat integration for dynamic feature control with route protection and
                  instant rollback capability.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">
                  📱 Responsive Design
                </h3>
                <p className="theme-text-secondary text-sm">
                  Mobile-first design with Tailwind CSS breakpoints for optimal viewing on all
                  devices.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold theme-text-accent mb-2">⚡ Performance</h3>
                <p className="theme-text-secondary text-sm">
                  Server-side rendering, efficient Neo4j queries, and Next.js optimizations for fast
                  page loads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Highlights */}
        <section className="mb-12">
          <div className="theme-bg-secondary rounded-lg theme-shadow-lg p-8 theme-border border">
            <h2 className="text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
              <span className="text-4xl">🏗️</span>
              Architecture Highlights
            </h2>

            <ul className="space-y-4 theme-text-secondary">
              <li className="flex items-start gap-3">
                <span className="theme-text-accent text-2xl">→</span>
                <div>
                  <strong className="theme-text-primary">TypeScript Path Mappings:</strong> Clean
                  imports using{' '}
                  <code className="theme-bg-primary px-2 py-1 rounded">@components</code>,{' '}
                  <code className="theme-bg-primary px-2 py-1 rounded">@lib</code>,{' '}
                  <code className="theme-bg-primary px-2 py-1 rounded">@models</code> for better
                  code organization
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="theme-text-accent text-2xl">→</span>
                <div>
                  <strong className="theme-text-primary">Server & Client Components:</strong>{' '}
                  Strategic use of Next.js 13+ patterns for optimal performance and interactivity
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="theme-text-accent text-2xl">→</span>
                <div>
                  <strong className="theme-text-primary">Route Protection:</strong> Feature
                  flag-based access control preventing direct URL access to disabled features
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="theme-text-accent text-2xl">→</span>
                <div>
                  <strong className="theme-text-primary">Graph Database:</strong> Neo4j&apos;s
                  Cypher query language enables efficient traversal of complex family relationships
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="theme-text-accent text-2xl">→</span>
                <div>
                  <strong className="theme-text-primary">Barrel Exports:</strong> All modules use
                  index.ts files for clean, maintainable imports
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Links */}
        <div className="text-center space-y-4">
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-block px-6 py-3 theme-bg-accent theme-text-on-accent rounded-lg hover:opacity-90 transition-opacity theme-shadow-lg font-medium"
            >
              Back to Home
            </Link>
            <a
              href="https://github.com/jtc10005/culp_conn_scrap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 theme-bg-secondary theme-text-primary rounded-lg hover:opacity-90 transition-opacity theme-shadow-lg font-medium theme-border border"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
          <p className="theme-text-tertiary text-sm">
            Open source • Built with ❤️ for the Culpepper family
          </p>
        </div>
      </div>
    </div>
  );
}
