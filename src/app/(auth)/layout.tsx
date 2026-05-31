import { Suspense } from 'react';
import AuthRedirect from '@/components/AuthRedirect';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <AuthRedirect>
        {children}
      </AuthRedirect>
    </Suspense>
  );
}