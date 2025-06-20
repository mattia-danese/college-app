import '~/styles/globals.css';
import { type Metadata } from 'next';
import { Geist } from 'next/font/google';
import { TRPCReactProvider } from '~/trpc/react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '~/components/ui/sonner';
// import { Navbar } from "~/components/Navbar";
import { UserProvider } from '~/components/UserProvider'; // <-- import here
import Navbar from '~/components/Navbar';

export const metadata: Metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
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
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <TRPCReactProvider>
            <UserProvider>
              <Navbar />
              {children}
            </UserProvider>
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

// ---------------------------------------------------

// import "~/styles/globals.css";
// import { type Metadata } from "next";
// import { Geist } from "next/font/google";
// import { TRPCReactProvider } from "~/trpc/react";
// import { ClerkProvider } from '@clerk/nextjs';
// import { Toaster } from "~/components/ui/sonner";
// import { Navbar } from "./_components/Navbar";

// export const metadata: Metadata = {
//   title: "Create T3 App",
//   description: "Generated by create-t3-app",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <ClerkProvider>
//       <html lang="en" className={`${geist.variable}`}>
//         <body>
//           <Navbar />
//           <TRPCReactProvider>{children}</TRPCReactProvider>
//           <Toaster />
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }

// ---------------------------------------------------

// import "~/styles/globals.css";

// import { type Metadata } from "next";
// import { Geist } from "next/font/google";

// import { TRPCReactProvider } from "~/trpc/react";

// import { ClerkProvider } from '@clerk/nextjs'
// import { Toaster } from "~/components/ui/sonner";

// export const metadata: Metadata = {
//   title: "Create T3 App",
//   description: "Generated by create-t3-app",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <ClerkProvider>
//         <html lang="en" className={`${geist.variable}`}>
//         <body>
//             <TRPCReactProvider>{children}</TRPCReactProvider>
//             <Toaster />
//         </body>
//         </html>
//     </ClerkProvider>
//   );
// }
