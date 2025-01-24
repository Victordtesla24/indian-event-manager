export enum AdminPermission {
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_USERS = 'manage_users',
  MANAGE_EVENTS = 'manage_events',
  MANAGE_SPONSORS = 'manage_sponsors',
  MANAGE_MARKETING = 'manage_marketing',
  MANAGE_PLATFORM = 'manage_platform'
}

export enum AdminLevel {
  BASIC = 'basic',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin'
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  pendingEvents: number;
  activeSponsors: number;
  usersByRole: {
    user: number;
    admin: number;
    sponsor: number;
  };
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    attendees: number;
  }>;
}

export interface AdminUserActivity {
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
  usersByLoginCount: Array<{
    id: string;
    full_name: string;
    email: string;
    login_count: number;
  }>;
  topActiveUsers: Array<{
    id: string;
    full_name: string;
    email: string;
    last_active: string;
    activity_count: number;
  }>;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  type: 'email' | 'social' | 'push' | 'ai_generated';
  targetAudience: string[];
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}

export interface PlatformSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  features: {
    enableRegistration: boolean;
    enableEventCreation: boolean;
    enableSponsorship: boolean;
    enableAIMarketing: boolean;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
}
