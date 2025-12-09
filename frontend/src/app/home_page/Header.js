'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const displayName = user ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-5 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        Vulnerability Management System
      </h1>

      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
        {displayName}
      </div>
    </header>
  );
}
