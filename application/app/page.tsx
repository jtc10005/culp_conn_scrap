export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Culpepper Family Genealogy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore the family tree and discover your Culpepper ancestry
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <a
            href="/tree"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              🌳 Family Tree
            </h2>
            <p className="text-slate-600">
              Interactive visualization of the Culpepper family tree
            </p>
          </a>

          <a
            href="/people"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              👥 Browse People
            </h2>
            <p className="text-slate-600">
              Search and explore all individuals in the database
            </p>
          </a>
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Data sourced from Culpepper Connections</p>
        </div>
      </main>
    </div>
  );
}
