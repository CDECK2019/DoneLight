import React, { useState } from 'react';
import { LogIn, UserPlus, X, KeyRound } from 'lucide-react';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, name: string) => void;
  onRequestReset: (email: string) => void;
  onResetPassword: (token: string, password: string) => void;
  onClose: () => void;
  error?: string;
}

export default function AuthForm({ 
  onSignIn, 
  onSignUp, 
  onRequestReset,
  onResetPassword,
  onClose, 
  error 
}: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'newpassword'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (mode) {
      case 'signup':
        onSignUp(email, password, name);
        break;
      case 'signin':
        onSignIn(email, password);
        break;
      case 'reset':
        onRequestReset(email);
        break;
      case 'newpassword':
        onResetPassword(resetToken, password);
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            {mode === 'signup' && 'Create Account'}
            {mode === 'signin' && 'Sign In'}
            {mode === 'reset' && 'Reset Password'}
            {mode === 'newpassword' && 'Set New Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          )}

          {mode !== 'newpassword' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          )}

          {mode === 'newpassword' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reset Token
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          )}

          {(mode === 'signin' || mode === 'signup' || mode === 'newpassword') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2"
          >
            {mode === 'signup' && (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
            {mode === 'signin' && (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
            {mode === 'reset' && (
              <>
                <KeyRound size={18} />
                <span>Send Reset Link</span>
              </>
            )}
            {mode === 'newpassword' && (
              <>
                <KeyRound size={18} />
                <span>Set New Password</span>
              </>
            )}
          </button>

          <div className="space-y-2 text-center">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Don't have an account? Sign up
                </button>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </>
            )}
            {mode !== 'signin' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}