import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { onAuthStateChange } from '@/lib/auth';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        login(user);
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout]);

  return {
    user,
    isAuthenticated,
  };
};
