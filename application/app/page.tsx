import Image from 'next/image';
import { getNavigationConfig } from '@/lib';

export default async function Home() {
  const navConfig = await getNavigationConfig();
  return (
    <div className="min-h-screen theme-bg-primary">
      <main className="container mx-auto px-4 py-12">
        {/* Culpepper Crest Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/culpepper_crest_no_bg.png"
            alt="Culpepper Family Crest"
            width={300}
            height={300}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold theme-text-primary mb-4">Culpepper Family Genealogy</h2>
          <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
            Explore the family tree and discover your Culpepper ancestry
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {navConfig.tree && (
            <a
              href="/tree"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">🌳 Family Tree</h2>
              <p className="theme-text-secondary">
                Interactive visualization of the Culpepper family tree
              </p>
            </a>
          )}

          {navConfig.history && (
            <a
              href="/history"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">📜 Family History</h2>
              <p className="theme-text-secondary">
                Discover the rich history of the Culpepper family from England to Virginia
              </p>
            </a>
          )}

          {navConfig.people && (
            <a
              href="/people"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">👥 Browse People</h2>
              <p className="theme-text-secondary">
                Search and explore all individuals in the database
              </p>
            </a>
          )}

          {navConfig.acknowledgements && (
            <a
              href="/acknowledgements"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">
                🙏 Acknowledgements
              </h2>
              <p className="theme-text-secondary">
                Credits and gratitude to those who preserved our family history
              </p>
            </a>
          )}

          {navConfig.about && (
            <a
              href="/about"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">ℹ️ About</h2>
              <p className="theme-text-secondary">
                Learn about the technology and process behind this project
              </p>
            </a>
          )}

          {navConfig.practice && (
            <a
              href="/practice"
              className="p-8 theme-bg-secondary rounded-lg theme-shadow-lg hover:theme-shadow-xl transition-shadow theme-border border"
            >
              <h2 className="text-2xl font-semibold theme-text-primary mb-3">🎨 SVG Practice</h2>
              <p className="theme-text-secondary">
                Experimental SVG playground with camera controls
              </p>
            </a>
          )}
        </div>

        <div className="mt-16 text-center theme-text-tertiary text-sm">
          <p>
            Data sourced from <a href="https://culpepperconnections.com">Culpepper Connections</a>
          </p>
        </div>
      </main>
    </div>
  );
}
