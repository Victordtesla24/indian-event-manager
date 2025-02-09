import type { AdminPermission, AdminLevel } from './admin';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SPONSOR = 'sponsor'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
  
  // Admin specific fields
  admin_level?: AdminLevel;
  permissions?: AdminPermission[];
  is_super_admin?: boolean;
  last_login?: string;
  last_active?: string;
  login_count?: number;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  full_name?: string;
  is_active?: boolean;
  role?: UserRole;
  admin_level?: AdminLevel;
  permissions?: AdminPermission[];
}
