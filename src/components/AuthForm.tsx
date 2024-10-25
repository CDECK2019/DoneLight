import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

type AuthMode = 'signin' | 'signup';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth form submitted:', { mode, email });
    
    try {
      const result = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password);
        
      if (result) {
        console.log('Authentication successful');
        toast.success(`Successfully ${mode === 'signin' ? 'signed in' : 'signed up'}!`);
        setEmail('');
        setPassword('');
        navigate('/dashboard'); // Change this from '/' to '/dashboard'
      }
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {mode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </form>
    </div>
  );
};
