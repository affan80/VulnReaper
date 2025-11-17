'use client';
import React from "react";
import Image from "next/image";
import { useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const D_nav = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLoggedIn(!!localStorage.getItem('token'));
        }
    }, []);

    const onLoginClick = () => {
        router.push('/login');
    };

    const onLogoutClick = async () => {
        try {
            // Call logout API endpoint
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Always clear local storage and redirect
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            router.push('/');
        }
    };

    return (
             <nav className="fixed top-0 w-full z-10 bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M8 12l2 2 4-4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-xl text-white-800">MyBrand</span>
          </Link>

          {/* Burger Icon for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Right Side: Login/Logout button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={onLogoutClick} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Logout
              </button>
            ) : (
              <button onClick={onLoginClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
    );
};
export default D_nav;
