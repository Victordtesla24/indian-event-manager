import { UserRole, AdminLevel, AdminPermission } from '../core/enums';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  isActive: boolean;
  isSuperuser?: boolean;
  adminLevel?: AdminLevel;
  permissions?: AdminPermission[];
  lastLogin?: string;
  lastActive?: string;
  loginCount?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
