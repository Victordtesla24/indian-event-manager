import { AdminPermission } from "../core/enums";
import { mockApi } from "./mockData";

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

interface DashboardMetrics {
  events: { value: number; change: number };
  users: { value: number; change: number };
  sponsors: { value: number; change: number };
  engagement: { value: number; change: number };
}

export const adminService = {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getMetrics();
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  },

  async getAuditLogs(page = 1, limit = 10): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getAuditLogs(page, limit);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  },

  async getTrends(): Promise<{
    labels: string[];
    values: number[];
  }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getTrends();
    } catch (error) {
      console.error("Error fetching trends:", error);
      throw error;
    }
  },

  async getRevenueData(): Promise<{
    labels: string[];
    revenue: number[];
    tickets: number[];
  }> {
    try {
      return await mockApi.getRevenueData();
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
  },

  async getEventMetrics(): Promise<Array<{ category: string; count: number }>> {
    try {
      return await mockApi.getEventMetrics();
    } catch (error) {
      console.error("Error fetching event metrics:", error);
      throw error;
    }
  },

  formatAuditAction(log: AuditLog): string {
    const entityType = log.entityType.toLowerCase();
    switch (log.action) {
      case "CREATE":
        return `created a new ${entityType}`;
      case "UPDATE":
        return `updated ${entityType} details`;
      case "DELETE":
        return `deleted a ${entityType}`;
      case "STATUS_CHANGE":
        return `changed ${entityType} status`;
      default:
        return `performed ${log.action} on ${entityType}`;
    }
  },

  getActionColor(action: string): string {
    switch (action) {
      case "CREATE":
        return "text-green-600";
      case "UPDATE":
        return "text-blue-600";
      case "DELETE":
        return "text-red-600";
      case "STATUS_CHANGE":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  },

  async login(email: string, password: string) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.login(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async getUsers() {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async createUser(userData: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.createUser(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(id: string, userData: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.updateUser(id, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Event methods
  async getEvents() {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  async createEvent(eventData: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.createEvent(eventData);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  async updateEvent(id: string, eventData: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.updateEvent(id, eventData);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  async deleteEvent(id: string) {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockApi.deleteEvent(id);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  async getEventById(id: string) {
    try {
      // TODO: Replace with actual API call when backend is ready
      const events = await mockApi.getEvents();
      const event = events.find(e => e.id === id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // System Settings methods
  async getSystemSettings() {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.getSystemSettings();
    } catch (error) {
      console.error("Error fetching system settings:", error);
      throw error;
    }
  },

  async updateSystemSettings(settings: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.updateSystemSettings(settings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      throw error;
    }
  },

  async testEmailConfig(config: any) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.testEmailConfig(config);
    } catch (error) {
      console.error("Error testing email configuration:", error);
      throw error;
    }
  },

  async backupDatabase() {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.backupDatabase();
    } catch (error) {
      console.error("Error backing up database:", error);
      throw error;
    }
  },

  async restoreDatabase(backupId: string) {
    try {
      // TODO: Replace with actual API call when backend is ready
      return await mockApi.restoreDatabase(backupId);
    } catch (error) {
      console.error("Error restoring database:", error);
      throw error;
    }
  },
};
