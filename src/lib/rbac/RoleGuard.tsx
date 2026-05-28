import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { hasPermission, canAccessRoute, UserRole, Permission } from './permissions';

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: UserRole[];
  requiredPermission?: {
    resource: string;
    action: Permission['action'];
    scope?: Permission['scope'];
  };
  route?: string;
}

export function RoleGuard({ 
  children, 
  fallback = null, 
  requiredRole,
  requiredPermission,
  route 
}: RoleGuardProps) {
  const { user, userProfile } = useAuth();
  
  if (!user || !userProfile) {
    return <>{fallback}</>;
  }
  
  const userRole = userProfile.role as UserRole;
  
  // Check role requirement
  if (requiredRole && !requiredRole.includes(userRole)) {
    return <>{fallback}</>;
  }
  
  // Check permission requirement
  if (requiredPermission) {
    const { resource, action, scope } = requiredPermission;
    if (!hasPermission(userRole, resource, action, scope)) {
      return <>{fallback}</>;
    }
  }
  
  // Check route access
  if (route && !canAccessRoute(userRole, route)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermissions() {
  const { userProfile } = useAuth();
  
  const checkPermission = (
    resource: string,
    action: Permission['action'],
    scope?: Permission['scope']
  ): boolean => {
    if (!userProfile) return false;
    return hasPermission(userProfile.role as UserRole, resource, action, scope);
  };
  
  const checkRoute = (route: string): boolean => {
    if (!userProfile) return false;
    return canAccessRoute(userProfile.role as UserRole, route);
  };
  
  return {
    checkPermission,
    checkRoute,
    role: userProfile?.role as UserRole | undefined
  };
}