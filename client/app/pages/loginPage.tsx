// client/app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        'http://localhost:9000/auth/login',
        { email, password },
        { withCredentials: true }
      );
      console.log('Logged in:', res.data);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      console.log('Login error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white rounded py-2 mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
