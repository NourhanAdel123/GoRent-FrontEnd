import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import ThemeRegistry from '../lib/ThemeRegistry';
import LayoutWrapper from '../components/shared/LayoutWrapper';
import StoreProvider from '../store/StoreProvider';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'GoRent',
  description: 'The specialized platform for real estate rental in Egypt',
  icons: {
    icon: '/favicon.ico'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className} style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <ThemeRegistry>
          <StoreProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </StoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}