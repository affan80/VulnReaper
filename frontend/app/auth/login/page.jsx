"use client";
import { useState } from 'react';
import API from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('vms_token', res.data.token);
      router.push('/dashboard');
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type='submit'>Login</button>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  );
}
