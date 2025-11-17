'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashBoard from "./DashBoard/page.js";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <DashBoard />
    </div>
  );
}
