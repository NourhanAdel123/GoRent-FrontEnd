import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import ThemeRegistry from '../lib/ThemeRegistry';
import LayoutWrapper from '../components/shared/LayoutWrapper';
import StoreProvider from '../store/StoreProvider';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'GoRent',
  description: 'GoRent Arabic Store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className} style={{ margin: 0, padding: 0 }}>
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
