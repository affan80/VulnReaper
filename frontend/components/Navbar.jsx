"use client";
import Link from 'next/link';

export default function Navbar({ user }) {
  return (
    <nav style={{padding:16, borderBottom:'1px solid #eee'}}>
      <Link href="/">Home</Link> | {" "}
      <Link href="/dashboard">Dashboard</Link> | {" "}
      <Link href="/auth/login">Login</Link> | {" "}
      <Link href="/auth/signup">Signup</Link>
    </nav>
  );
}
