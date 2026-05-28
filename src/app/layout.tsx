import type { Metadata } from 'next';
import { Inter, Poppins, Source_Sans_3 } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../lib/auth-context';
import { QueryProvider } from '../lib/query-provider';
import { Analytics } from '../lib/analytics-component';
import { PWAInstaller, PWAUpdater } from '../lib/pwa';
import './globals.css';
import './performance.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const sourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AI Learning OS - Build Job-Winning Resume with AI',
    template: '%s | AI Learning OS',
  },
  description: 'ATS score, job match, and interview prep in one AI-powered resume platform.',
  keywords: ['AI resume', 'ATS score', 'job match', 'interview prep', 'career copilot'],
  authors: [{ name: 'NeuroLearn' }],
  creator: 'NeuroLearn',
  publisher: 'NeuroLearn',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://neurolearn.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neurolearn.vercel.app',
    siteName: 'AI Learning OS',
    title: 'AI Learning OS - Build Job-Winning Resume with AI',
    description: 'ATS score, job match, and interview prep in one AI-powered resume platform.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Learning OS',
      },
    ],
  },
  icons: {
    icon: '/favicon.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Learning OS - Build Job-Winning Resume with AI',
    description: 'ATS score, job match, and interview prep in one AI-powered resume platform.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0066ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${sourceSansPro.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Analytics />
              <PWAInstaller />
              <PWAUpdater />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
