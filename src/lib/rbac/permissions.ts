export type UserRole = 'learner' | 'instructor' | 'org_admin' | 'super_admin';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  scope?: 'own' | 'org' | 'all';
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// Define base permissions first to avoid circular dependencies
const learnerPermissions: Permission[] = [
  { resource: 'dashboard', action: 'read', scope: 'own' },
  { resource: 'courses', action: 'read', scope: 'own' },
  { resource: 'progress', action: 'read', scope: 'own' },
  { resource: 'progress', action: 'update', scope: 'own' },
  { resource: 'achievements', action: 'read', scope: 'own' },
  { resource: 'profile', action: 'read', scope: 'own' },
  { resource: 'profile', action: 'update', scope: 'own' },
  { resource: 'notes', action: 'create', scope: 'own' },
  { resource: 'notes', action: 'read', scope: 'own' },
  { resource: 'notes', action: 'update', scope: 'own' },
  { resource: 'notes', action: 'delete', scope: 'own' }
];

const instructorPermissions: Permission[] = [
  ...learnerPermissions,
  { resource: 'instructor_dashboard', action: 'read', scope: 'own' },
  { resource: 'courses', action: 'create', scope: 'org' },
  { resource: 'courses', action: 'read', scope: 'org' },
  { resource: 'courses', action: 'update', scope: 'own' },
  { resource: 'courses', action: 'delete', scope: 'own' },
  { resource: 'lessons', action: 'create', scope: 'own' },
  { resource: 'lessons', action: 'read', scope: 'own' },
  { resource: 'lessons', action: 'update', scope: 'own' },
  { resource: 'lessons', action: 'delete', scope: 'own' },
  { resource: 'questions', action: 'create', scope: 'own' },
  { resource: 'questions', action: 'read', scope: 'own' },
  { resource: 'questions', action: 'update', scope: 'own' },
  { resource: 'questions', action: 'delete', scope: 'own' },
  { resource: 'cohorts', action: 'read', scope: 'own' },
  { resource: 'student_progress', action: 'read', scope: 'org' },
  { resource: 'analytics', action: 'read', scope: 'own' }
];

const orgAdminPermissions: Permission[] = [
  ...instructorPermissions,
  { resource: 'admin_dashboard', action: 'read', scope: 'org' },
  { resource: 'users', action: 'read', scope: 'org' },
  { resource: 'users', action: 'update', scope: 'org' },
  { resource: 'organization', action: 'read', scope: 'own' },
  { resource: 'organization', action: 'update', scope: 'own' },
  { resource: 'catalog', action: 'read', scope: 'org' },
  { resource: 'catalog', action: 'update', scope: 'org' },
  { resource: 'payments', action: 'read', scope: 'org' },
  { resource: 'compliance', action: 'read', scope: 'org' },
  { resource: 'audit_logs', action: 'read', scope: 'org' }
];

const superAdminPermissions: Permission[] = [
  ...orgAdminPermissions,
  { resource: 'admin_dashboard', action: 'read', scope: 'all' },
  { resource: 'users', action: 'create', scope: 'all' },
  { resource: 'users', action: 'read', scope: 'all' },
  { resource: 'users', action: 'update', scope: 'all' },
  { resource: 'users', action: 'delete', scope: 'all' },
  { resource: 'organizations', action: 'create', scope: 'all' },
  { resource: 'organizations', action: 'read', scope: 'all' },
  { resource: 'organizations', action: 'update', scope: 'all' },
  { resource: 'organizations', action: 'delete', scope: 'all' },
  { resource: 'system', action: 'read', scope: 'all' },
  { resource: 'system', action: 'update', scope: 'all' },
  { resource: 'feature_flags', action: 'create', scope: 'all' },
  { resource: 'feature_flags', action: 'read', scope: 'all' },
  { resource: 'feature_flags', action: 'update', scope: 'all' },
  { resource: 'feature_flags', action: 'delete', scope: 'all' }
];

// Now define the main permissions object without circular dependencies
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  learner: learnerPermissions,
  instructor: instructorPermissions,
  org_admin: orgAdminPermissions,
  super_admin: superAdminPermissions
};

export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: Permission['action'],
  scope?: Permission['scope']
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  return rolePermissions.some(permission => 
    permission.resource === resource &&
    permission.action === action &&
    (scope ? permission.scope === scope : true)
  );
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Dashboard routes
  if (route.startsWith('/dashboard')) {
    return hasPermission(userRole, 'dashboard', 'read');
  }
  
  // Instructor routes
  if (route.startsWith('/instructor')) {
    return hasPermission(userRole, 'instructor_dashboard', 'read');
  }
  
  // Admin routes
  if (route.startsWith('/admin')) {
    return hasPermission(userRole, 'admin_dashboard', 'read');
  }
  
  // Default to true for public routes
  return true;
}