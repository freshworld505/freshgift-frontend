import { useState, useEffect, useCallback } from 'react';

// List of admin emails - you can add more emails here
const ADMIN_EMAILS = [
  'ajbaggar@gmail.com',
  'admin@veggieco.com', 
  'aryan@veggieco.com',
  'admin@freshworld.com',
  'adminuser@freshworld.com',
  'freshworld.official01@gmail.com',
  'srivastavaadi129@gmail.com',
  'premiumsps505@gmail.com',
  // Add more admin emails as needed
];

interface AdminAuthState {
  isAdmin: boolean;
  loading: boolean;
}

export function useAdminAuth() {
  const [adminState, setAdminState] = useState<AdminAuthState>({
    isAdmin: false,
    loading: true,
  });

  const checkAdminStatus = useCallback((email: string | null | undefined) => {
    setAdminState({ loading: true, isAdmin: false });
    
    if (!email) {
      setAdminState({ loading: false, isAdmin: false });
      return;
    }

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    
    console.log('Admin check:', { email, isAdmin, adminEmails: ADMIN_EMAILS });
    
    setAdminState({ 
      loading: false, 
      isAdmin 
    });
  }, []);

  useEffect(() => {
    // Initialize loading state
    setAdminState(prev => ({ ...prev, loading: false }));
  }, []);

  return {
    ...adminState,
    checkAdminStatus,
  };
}
