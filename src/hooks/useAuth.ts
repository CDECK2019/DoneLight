import { useState, useCallback, useEffect } from 'react';

interface User {
  email: string;
  id: string;
}

const AUTH_KEY = 'auth_user';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('Initializing auth state...');
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsedUser = JSON.parse(saved);
        console.log('Found saved user:', parsedUser);
        setCurrentUser(parsedUser);
      }
    } catch (err) {
      console.error('Error restoring auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Signing in...', email);
    setIsLoading(true);
    setError(null);
    
    try {
      const user = { id: Date.now().toString(), email };
      console.log('Setting user:', user);
      
      // Update localStorage first
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      
      // Then update state
      setCurrentUser(user);
      return true;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('Signing up...', email);
    setIsLoading(true);
    setError(null);
    
    try {
      const user = { id: Date.now().toString(), email };
      console.log('Creating new user:', user);
      
      // Update localStorage first
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      
      // Then update state
      setCurrentUser(user);
      return true;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Sign up failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    console.log('Signing out...');
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setError(null);
  }, []);

  return { currentUser, isLoading, error, signIn, signUp, signOut };
};
