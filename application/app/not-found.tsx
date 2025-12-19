import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold theme-text-accent mb-4">404</h1>
        <h2 className="text-4xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl theme-text-secondary mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 theme-bg-secondary theme-text-primary rounded-lg hover:opacity-90 transition-opacity theme-shadow-lg font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
