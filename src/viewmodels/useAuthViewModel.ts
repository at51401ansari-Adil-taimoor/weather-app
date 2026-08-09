import { User, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import * as authService from '../services/authService';

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Authentication failed. Please try again.';
}

export interface AuthViewModel {
  user: User | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuthViewModel(): AuthViewModel {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setSubmitting(true);
    setError(null);

    try {
      await authService.register(email, password);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setSubmitting(true);
    setError(null);

    try {
      await authService.login(email, password);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    try {
      await authService.logout();
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    submitting,
    error,
    register,
    login,
    logout,
    clearError,
  };
}
