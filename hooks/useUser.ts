import { useEffect } from 'react';
import { router } from 'expo-router';
import { useUserStore } from '../stores/user.store';

export function useUser() {
  const { name, age, setUser, clearUser } = useUserStore();

  useEffect(() => {
    // If no user info, redirect to welcome screen
    if (!name || !age) {
      router.replace('/');
    }
  }, [name, age]);

  return {
    isAuthenticated: !!(name && age),
    name,
    age,
    setUser,
    clearUser,
  };
} 