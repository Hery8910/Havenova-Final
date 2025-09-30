import type { Metadata } from 'next';

export const metadata: Metadata = {
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-light.ico', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
