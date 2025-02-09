export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  capacity: number;
  registrations?: number;
  status: EventStatus;
  imageUrl?: string;
  image_url?: string;  // Legacy field
  venue?: Venue;
  language?: string;
  price: number;  // Required field, used for display and sorting
  is_promoted?: boolean;
  banner_url?: string;
  organizer?: {
    name: string;
    contact: string;
    abn?: string;  // Australian Business Number
  };
  duration: string;
  category?: string;
  // Marathi cultural event specific fields
  marathi?: {
    titleInMarathi?: string;  // Title in Marathi script
    descriptionInMarathi?: string;  // Description in Marathi
    culturalNotes?: string;  // Special cultural information
    dietaryOptions?: "veg" | "non-veg" | "both";  // Food preferences
    traditionalDress?: string;  // Dress code information
    poojaTimings?: string;  // For religious events
    specialRequirements?: string[];  // Any special requirements for attendees
  };
  familyDiscount?: {
    enabled: boolean;
    threshold: number;  // Number of family members for discount
    discountPercentage: number;
  };
  membershipDiscount?: {
    enabled: boolean;
    discountPercentage: number;
  };
}

