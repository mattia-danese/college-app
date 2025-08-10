import '~/styles/globals.css';
import { type Metadata } from 'next';
import { Geist } from 'next/font/google';
import { TRPCReactProvider } from '~/trpc/react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '~/components/ui/sonner';
import { UserProvider } from '~/components/UserProvider'; // <-- import here
import Navbar from '~/components/Navbar';
import { ThemeProvider } from '~/components/ui/theme-provider';

export const metadata: Metadata = {
  title: 'Collegenda',
  description: 'Plan your college application journey with Collegenda',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <UserProvider>
                <Navbar />
                {children}
              </UserProvider>
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
