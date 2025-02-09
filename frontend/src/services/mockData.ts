import { AdminPermission, UserRole } from "../core/enums";

export const mockMetrics = {
  events: { value: 150, change: 12.5 },
  users: { value: 2500, change: 8.2 },
  sponsors: { value: 45, change: -2.3 },
  engagement: { value: 4.8, change: 15.7 },
};

export const mockTrends = {
  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ],
  values: [65, 72, 81, 78, 85, 90, 88],
};

export const mockRevenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  revenue: [150000, 180000, 210000, 240000, 270000, 300000],
  tickets: [300, 350, 400, 450, 500, 550],
};

export const mockEventMetrics = [
  { category: "Festivals & Celebrations", count: 35 },
  { category: "Marathi Natya", count: 28 },
  { category: "Cultural Programs", count: 25 },
  { category: "Maharashtra Mandal Events", count: 20 },
  { category: "Youth Programs", count: 18 },
  { category: "Traditional Performances", count: 15 },
  { category: "Community Gatherings", count: 12 },
];

export const mockAuditLogs = {
  logs: [
    {
      id: "1",
      adminId: "1",
      adminName: "Admin User",
      action: "CREATE",
      entityType: "EVENT",
      entityId: "123",
      details: { title: "Ganesh Utsav 2025" },
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: "2",
      adminId: "1",
      adminName: "Admin User",
      action: "UPDATE",
      entityType: "USER",
      entityId: "456",
      details: { role: "ORGANIZER" },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    },
    {
      id: "3",
      adminId: "2",
      adminName: "System Admin",
      action: "STATUS_CHANGE",
      entityType: "EVENT",
      entityId: "789",
      details: { status: "APPROVED" },
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: "4",
      adminId: "1",
      adminName: "Admin User",
      action: "CREATE",
      entityType: "SPONSOR",
      entityId: "101",
      details: { name: "Maharashtra Mandal Victoria", abn: "34 567 890 123" },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    },
    {
      id: "5",
      adminId: "2",
      adminName: "System Admin",
      action: "UPDATE",
      entityType: "SETTINGS",
      details: { feature: "email_notifications", enabled: true },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
  ],
  total: 5,
};

export const mockUsers = [
  {
    id: "1",
    email: "admin@maharashtramandal.org.au",
    fullName: "Marathi Community Admin",
    role: UserRole.ADMIN,
    isActive: true,
    permissions: [
      AdminPermission.VIEW_DASHBOARD,
      AdminPermission.MANAGE_USERS,
      AdminPermission.MANAGE_EVENTS,
      AdminPermission.MANAGE_SETTINGS,
    ],
  },
  {
    id: "2",
    email: "events@maharashtramandal.org.au",
    fullName: "Cultural Events Coordinator",
    role: UserRole.ORGANIZER,
    isActive: true,
  },
  {
    id: "3",
    email: "sponsor@marathibusiness.org.au",
    fullName: "Marathi Business Council",
    role: UserRole.SPONSOR,
    isActive: true,
  },
];

// Simulate API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import { Event, EventStatus } from "../types/event";

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "गणेशोत्सव मेळावा २०२५",
    description: "Join Melbourne's biggest Ganesh Utsav celebration with traditional aarti, cultural performances, and authentic Maharashtrian prasad. Experience the warmth of community gatherings and cultural festivities.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Melbourne Convention and Exhibition Centre, 1 Convention Centre Pl, South Wharf VIC 3006",
    capacity: 500,
    registrations: 350,
    status: "PUBLISHED" as EventStatus,
    imageUrl: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=1200&auto=format",
    category: "Events",
    organizer: {
      name: "Maharashtra Mandal Victoria",
      contact: "events@mmvic.org.au",
      abn: "45 123 456 789"
    },
    price: 49.99,
    duration: "3 hours",
    marathi: {
      titleInMarathi: "गणेश उत्सव २०२५",
      descriptionInMarathi: "पारंपारिक आरती, सांस्कृतिक कार्यक्रम आणि महाराष्ट्रीय प्रसाद यांसह गणेश उत्सवाच्या भव्य सोहळ्यात सहभागी व्हा.",
      culturalNotes: "Please bring your own pooja thali. Prasad will be distributed after aarti.",
      dietaryOptions: "veg",
      traditionalDress: "Traditional Indian attire preferred",
      poojaTimings: "Morning Aarti: 8:00 AM, Evening Aarti: 7:00 PM",
      specialRequirements: ["Remove footwear before entering temple area", "Bring flowers for pooja"]
    },
    familyDiscount: {
      enabled: true,
      threshold: 4,
      discountPercentage: 15
    },
    membershipDiscount: {
      enabled: true,
      discountPercentage: 10
    },
  },
  {
    id: "2",
    title: "एका लग्नाची पुढची गोष्ट",
    description: "Don't miss Melbourne's most anticipated Marathi play of the year! A hilarious comedy about marriage, relationships, and family dynamics in modern times.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Athenaeum Theatre, 188 Collins St, Melbourne VIC 3000",
    capacity: 200,
    registrations: 150,
    status: "PUBLISHED" as EventStatus,
    imageUrl: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=1200&auto=format",
    category: "Natak",
    organizer: {
      name: "Melbourne Marathi Theatre",
      contact: "bookings@melbournemarathitheatre.com.au",
      abn: "78 987 654 321"
    },
    price: 89.99,
    duration: "4 hours",
    marathi: {
      titleInMarathi: "मराठी नाट्य महोत्सव",
      descriptionInMarathi: "ऑस्ट्रेलियातील मराठी रंगभूमीवरील कलाकारांद्वारे सादर केलेली पारंपारिक आणि समकालीन नाटके.",
      culturalNotes: "Featuring both traditional and modern Marathi plays",
      dietaryOptions: "both",
      traditionalDress: "Smart casual or traditional wear",
      specialRequirements: ["Please be seated 15 minutes before show time"]
    },
    familyDiscount: {
      enabled: true,
      threshold: 3,
      discountPercentage: 10
    },
    membershipDiscount: {
      enabled: true,
      discountPercentage: 15
    },
  },
  {
    id: "3",
    title: "शिकायला गेलो एक!",
    description: "A brand new comedy play that will leave you in splits! Join us for an evening of laughter and entertainment with this hilarious take on education and life lessons.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "The Alex Theatre, 135 Fitzroy St, St Kilda VIC 3182",
    capacity: 250,
    registrations: 180,
    status: "PUBLISHED" as EventStatus,
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200&auto=format",
    category: "Natak",
    organizer: {
      name: "Marathi Rangbhoomi Melbourne",
      contact: "tickets@marathirangbhoomi.com.au",
      abn: "91 234 567 890"
    },
    price: 69.99,
    duration: "6 hours",
    marathi: {
      titleInMarathi: "गुढी पाडवा २०२५",
      descriptionInMarathi: "पारंपारिक गुढी उभारणी, सांस्कृतिक कार्यक्रम आणि मराठमोळ्या जेवणासह मराठी नववर्षाचं स्वागत करूया.",
      culturalNotes: "Learn about the significance of Gudhi Padwa and traditional customs",
      dietaryOptions: "veg",
      traditionalDress: "Traditional Maharashtrian attire encouraged",
      specialRequirements: ["Participate in community Gudhi decoration", "Join morning procession at 8:00 AM"]
    },
    familyDiscount: {
      enabled: true,
      threshold: 4,
      discountPercentage: 20
    },
    membershipDiscount: {
      enabled: true,
      discountPercentage: 10
    },
  },
];

export const mockApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== "admin123") {
      throw new Error("Invalid credentials");
    }
    return user;
  },

  getMetrics: async () => {
    await delay(800);
    return mockMetrics;
  },

  getTrends: async () => {
    await delay(800);
    return mockTrends;
  },

  getRevenueData: async () => {
    await delay(800);
    return mockRevenueData;
  },

  getEventMetrics: async () => {
    await delay(800);
    return mockEventMetrics;
  },

  getAuditLogs: async (page = 1, limit = 10) => {
    await delay(600);
    return {
      logs: mockAuditLogs.logs.slice((page - 1) * limit, page * limit),
      total: mockAuditLogs.total,
    };
  },

  getUsers: async () => {
    await delay(600);
    return mockUsers;
  },

  createUser: async (userData: any) => {
    await delay(800);
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      isActive: true,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, userData: any) => {
    await delay(800);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
  },

  // Event methods
  getEvents: async () => {
    await delay(800);
    return mockEvents;
  },

  createEvent: async (eventData: any) => {
    await delay(800);
    const newEvent = {
      id: String(mockEvents.length + 1),
      ...eventData,
      registrations: 0,
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  updateEvent: async (id: string, eventData: any) => {
    await delay(800);
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    mockEvents[index] = { ...mockEvents[index], ...eventData };
    return mockEvents[index];
  },

  deleteEvent: async (id: string) => {
    await delay(800);
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    mockEvents.splice(index, 1);
  },

  // System Settings methods
  getSystemSettings: async () => {
    await delay(600);
    return {
      email: {
        smtp_host: "smtp.example.com.au",
        smtp_port: 587,
        smtp_user: "notifications@maharashtramandal.org.au",
        smtp_encryption: "TLS",
      },
      payment: {
        gateway: "stripe",
        test_mode: true,
        currency: "AUD",
        auto_capture: true,
        methods: ["credit_card", "eftpos", "bpay", "payid"],
      },
      database: {
        auto_backup: true,
        backup_frequency: "daily",
        retain_backups: 7,
        last_backup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      backups: [
        {
          id: "backup1",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          size: "256MB",
          status: "completed",
        },
        {
          id: "backup2",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          size: "255MB",
          status: "completed",
        },
      ],
    };
  },

  updateSystemSettings: async (settings: any) => {
    await delay(800);
    return {
      success: true,
      message: "Settings updated successfully",
      settings,
    };
  },

  testEmailConfig: async (config: any) => {
    await delay(1000);
    return {
      success: true,
      message: "Email configuration test successful",
    };
  },

  backupDatabase: async () => {
    await delay(2000);
    return {
      id: `backup${Date.now()}`,
      timestamp: new Date().toISOString(),
      size: "257MB",
      status: "completed",
    };
  },

  restoreDatabase: async (backupId: string) => {
    await delay(3000);
    return {
      success: true,
      message: "Database restored successfully",
      backupId,
    };
  },
};
