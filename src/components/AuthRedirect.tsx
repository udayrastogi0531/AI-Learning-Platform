'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only redirect if user is authenticated and we're on an auth page
    if (!loading && user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/reset-password'];
      
      if (authPaths.includes(currentPath)) {
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        console.log('User authenticated, redirecting to:', redirectTo);
        
        // Use a small delay to ensure auth state is fully updated
        setTimeout(() => {
          router.push(redirectTo);
        }, 100);
      }
    }
  }, [user, loading, router, searchParams]);

  return <>{children}</>;
}