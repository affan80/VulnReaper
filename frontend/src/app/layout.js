'use client';

import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
