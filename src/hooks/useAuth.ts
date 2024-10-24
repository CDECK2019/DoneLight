import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { User } from '../types';

const AUTH_KEY = 'wunderlist-auth';
const USERS_KEY = 'wunderlist-users';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const signUp = async (email: string, password: string, name: string) => {
    if (users.some(user => user.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      subscription: { status: 'free', validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 }
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const signIn = (email: string, password: string) => {
    const user = users.find(
      user => user.email === email && user.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    setCurrentUser(user);
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  const requestPasswordReset = (email: string) => {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('No account found with this email');
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, resetToken, resetTokenExpiry }
        : u
    ));

    // In a real app, send email here
    toast.success('Password reset link sent to your email');
    return resetToken;
  };

  const resetPassword = (token: string, newPassword: string) => {
    const user = users.find(u => 
      u.resetToken === token && 
      u.resetTokenExpiry && 
      u.resetTokenExpiry > Date.now()
    );

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    setUsers(users.map(u => 
      u.id === user.id 
        ? { 
            ...u, 
            password: newPassword, 
            resetToken: undefined, 
            resetTokenExpiry: undefined 
          }
        : u
    ));

    toast.success('Password has been reset successfully');
  };

  const updateSubscription = (userId: string, status: 'free' | 'pro' | 'premium') => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            subscription: { 
              status, 
              validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 
            } 
          }
        : u
    ));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        subscription: {
          status,
          validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000
        }
      } : null);
    }
  };

  return {
    currentUser,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    updateSubscription
  };
}