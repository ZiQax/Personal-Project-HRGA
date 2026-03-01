import { useAuth } from '../context/AuthContext';

export type Permission = 
  | 'view_dashboard'
  | 'manage_users'
  | 'view_mobility'
  | 'create_mobility'
  | 'approve_mobility'
  | 'delete_mobility'
  | 'view_leave'
  | 'create_leave'
  | 'approve_leave'
  | 'delete_leave';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Super-admin check (bypass)
    if (user.role === 'admin') return true;

    const permissions = user.access_right?.permissionsArray || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  return { hasPermission, hasAnyPermission, role: user?.role };
};
