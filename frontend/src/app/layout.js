'use client';

import "./globals.css";
import { AuthProvider } from '../context/AuthContext';
import ConnectionStatus from '../components/ConnectionStatus';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ConnectionStatus />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
