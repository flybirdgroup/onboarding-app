'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from './contexts/UserContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUsername: setGlobalUsername } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios({
        url: "https://[MASKED_URL]/dsp/dspAuthenticate.jsp?realm=Staff&service=ssoservice",
        method: "post",
        headers: {
          'Accept-API-Version': 'protocol-1.0,resource-2.1',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Client-Id': '[MASKED_CLIENT_ID]',
          'X-Client-Secret': '[MASKED_CLIENT_SECRET]'
        },
        withCredentials: true,
        data: { username, password }
      });

      if (response.status === 200) {
        setGlobalUsername(username);
        console.log('Username set after login:', username);
        router.push('/main');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">SBC Staff Login</h1>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}