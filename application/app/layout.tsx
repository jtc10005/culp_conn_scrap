import type { Metadata } from 'next';
import { Geist, Geist_Mono, Tangerine } from 'next/font/google';
import './globals.css';
import { HeaderWithFlags as Header } from '@/components';
import { getCalligraphicFontEnabled } from '@lib';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const tangerine = Tangerine({
  variable: '--font-tangerine',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Culpepper.Info',
  description: 'Explore the Culpepper family tree',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const useCalligraphicFont = await getCalligraphicFontEnabled();
  const fontClasses = useCalligraphicFont
    ? `${tangerine.variable} font-[family-name:var(--font-tangerine)] antialiased`
    : `${geistSans.variable} ${geistMono.variable} antialiased`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={fontClasses}>
        <Header />
        {children}
      </body>
    </html>
  );
}
