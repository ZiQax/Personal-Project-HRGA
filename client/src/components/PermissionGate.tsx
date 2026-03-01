
import { usePermissions, type Permission } from '../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  fallback?: React.ReactNode;
}

export default function PermissionGate({ 
  children, 
  permission, 
  permissions, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (permissions && !hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

