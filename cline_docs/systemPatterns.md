# System Patterns

## Admin Interface Patterns

### Dashboard Pattern
```typescript
interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Array<{
    id: number;
    eventTitle: string;
    customerName: string;
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    date: string;
  }>;
  popularEvents: Array<{
    id: number;
    title: string;
    bookings: number;
    revenue: number;
  }>;
}

class DashboardManager {
  async fetchStats(): Promise<DashboardStats> {
    const [events, bookings, revenue] = await Promise.all([
      this.fetchEventStats(),
      this.fetchBookingStats(),
      this.fetchRevenueStats()
    ]);
    return this.combineStats(events, bookings, revenue);
  }

  private async fetchEventStats(): Promise<EventStats> {
    // Implementation
  }
}
```

### User Management Pattern
```typescript
interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page: number;
  limit: number;
}

class UserManager {
  async listUsers(filters: UserFilters): Promise<PaginatedUsers> {
    const query = this.buildQuery(filters);
    const [users, total] = await Promise.all([
      this.fetchUsers(query),
      this.countUsers(query)
    ]);
    return { users, total, page: filters.page };
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await this.validateRole(role);
    await this.updateUser(userId, { role });
    await this.auditLog('role_update', userId);
  }
}
```

### Marketing Campaign Pattern
```typescript
interface Campaign {
  id: string;
  title: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed';
  metrics: CampaignMetrics;
}

class CampaignManager {
  async createCampaign(data: CampaignInput): Promise<Campaign> {
    await this.validateBudget(data.budget);
    const campaign = await this.saveCampaign(data);
    await this.initializeMetrics(campaign.id);
    return campaign;
  }

  async trackPerformance(id: string): Promise<CampaignMetrics> {
    const metrics = await this.fetchMetrics(id);
    await this.updateAnalytics(id, metrics);
    return metrics;
  }
}
```

## Organizer Interface Patterns

### Event Management Pattern
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  venue: Venue;
  date: Date;
  ticketTypes: TicketType[];
  status: EventStatus;
  metrics: EventMetrics;
}

class EventManager {
  async createEvent(data: EventInput): Promise<Event> {
    await this.validateVenue(data.venue);
    await this.validateTickets(data.ticketTypes);
    const event = await this.saveEvent(data);
    await this.initializeMetrics(event.id);
    return event;
  }

  async updateTickets(eventId: string, tickets: TicketType[]): Promise<void> {
    await this.validateTicketUpdates(eventId, tickets);
    await this.updateEventTickets(eventId, tickets);
    await this.notifyAttendees(eventId, 'ticket_update');
  }
}
```

### Booking Management Pattern
```typescript
interface Booking {
  id: string;
  eventId: string;
  customerId: string;
  tickets: BookedTicket[];
  totalAmount: number;
  status: BookingStatus;
  paymentInfo: PaymentInfo;
}

class BookingManager {
  async processBooking(data: BookingInput): Promise<Booking> {
    await this.validateAvailability(data.eventId, data.tickets);
    const booking = await this.createBooking(data);
    await this.processPayment(booking);
    await this.sendConfirmation(booking);
    return booking;
  }

  async refundBooking(bookingId: string): Promise<void> {
    const booking = await this.getBooking(bookingId);
    await this.validateRefundEligibility(booking);
    await this.processRefund(booking);
    await this.updateInventory(booking);
  }
}
```

### Analytics Pattern
```typescript
interface EventAnalytics {
  revenue: {
    total: number;
    byTicketType: Record<string, number>;
    trend: DataPoint[];
  };
  attendance: {
    total: number;
    checkedIn: number;
    byTicketType: Record<string, number>;
  };
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
  };
}

class AnalyticsManager {
  async generateReport(eventId: string): Promise<EventAnalytics> {
    const [revenue, attendance, demographics] = await Promise.all([
      this.calculateRevenue(eventId),
      this.getAttendanceStats(eventId),
      this.analyzeDemographics(eventId)
    ]);
    return { revenue, attendance, demographics };
  }

  async exportReport(eventId: string, format: 'pdf' | 'csv'): Promise<string> {
    const data = await this.generateReport(eventId);
    return this.formatReport(data, format);
  }
}
```

### Payment Processing Pattern
```typescript
interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  metadata: Record<string, any>;
}

class PaymentProcessor {
  async processPayment(booking: Booking): Promise<Payment> {
    const paymentIntent = await this.createPaymentIntent(booking);
    await this.validatePaymentMethod(booking.paymentInfo);
    const payment = await this.executePayment(paymentIntent);
    await this.updateBookingStatus(booking.id, payment);
    return payment;
  }

  async handleRefund(payment: Payment): Promise<void> {
    await this.validateRefundability(payment);
    await this.processRefund(payment);
    await this.updatePaymentStatus(payment.id, 'refunded');
  }
}
```

## Marketing System Patterns

### Campaign Pattern
```typescript
interface Campaign {
  id: string;
  name: string;
  targetAudience: AudienceSegment[];
  startDate: Date;
  endDate: Date;
  budget: number;
  metrics: CampaignMetrics;
}

class CampaignManager {
  async createCampaign(data: CampaignInput): Promise<Campaign> {
    const campaign = await this.validateAndCreate(data);
    await this.initializeMetrics(campaign.id);
    return campaign;
  }

  async trackPerformance(id: string): Promise<CampaignMetrics> {
    const metrics = await this.fetchMetrics(id);
    await this.updateAnalytics(id, metrics);
    return metrics;
  }
}
```

### Banner Pattern
```typescript
interface Banner {
  id: string;
  title: string;
  content: string;
  schedule: DisplaySchedule;
  abTest?: ABTestConfig;
  metrics: BannerMetrics;
}

class BannerManager {
  async scheduleBanner(banner: Banner): Promise<void> {
    await this.validateSchedule(banner.schedule);
    if (banner.abTest) {
      await this.setupABTest(banner.id, banner.abTest);
    }
    await this.activateBanner(banner);
  }

  async trackClicks(id: string): Promise<ClickMetrics> {
    const clicks = await this.fetchClickData(id);
    await this.updateAnalytics(id, clicks);
    return clicks;
  }
}
```

### Sponsor Pattern
```typescript
interface Sponsor {
  id: string;
  name: string;
  level: SponsorshipLevel;
  agreement: Agreement;
  financials: FinancialTracking;
}

class SponsorManager {
  async manageSponsor(sponsor: Sponsor): Promise<void> {
    await this.validateAgreement(sponsor.agreement);
    await this.trackFinancials(sponsor.id);
    await this.updateAnalytics(sponsor);
  }

  async generateReport(id: string): Promise<SponsorReport> {
    const data = await this.fetchSponsorData(id);
    return this.formatReport(data);
  }
}
```

## Hydrogen Storefront Patterns

### Product Pattern
```typescript
interface Product {
  id: string;
  title: string;
  variants: ProductVariant[];
  price: Money;
  inventory: InventoryInfo;
}

class ProductManager {
  async syncWithShopify(): Promise<void> {
    const products = await this.fetchShopifyProducts();
    await this.updateLocalProducts(products);
    await this.syncInventory();
  }

  async handleVariants(productId: string): Promise<void> {
    const variants = await this.fetchVariants(productId);
    await this.updatePricing(variants);
    await this.syncInventory(variants);
  }
}
```

### Cart Pattern
```typescript
interface Cart {
  id: string;
  items: CartItem[];
  total: Money;
  checkout?: CheckoutSession;
}

class CartManager {
  async addToCart(item: CartItem): Promise<Cart> {
    await this.validateInventory(item);
    const updatedCart = await this.updateCart(item);
    await this.recalculateTotal(updatedCart);
    return updatedCart;
  }

  async initiateCheckout(cartId: string): Promise<CheckoutSession> {
    const cart = await this.fetchCart(cartId);
    const session = await this.createCheckoutSession(cart);
    return session;
  }
}
```

### Customer Pattern
```typescript
interface Customer {
  id: string;
  profile: CustomerProfile;
  orders: Order[];
  preferences: CustomerPreferences;
}

class CustomerManager {
  async manageAccount(customer: Customer): Promise<void> {
    await this.validateProfile(customer.profile);
    await this.syncOrders(customer.id);
    await this.updatePreferences(customer.preferences);
  }

  async processOrder(order: Order): Promise<void> {
    await this.validateOrder(order);
    await this.updateInventory(order.items);
    await this.notifyCustomer(order);
  }
}
```

## Frontend Architecture

### Component Testing Patterns
```typescript
// Mock Provider Pattern
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MockProvider>
      {ui}
    </MockProvider>
  );
};

// Test Setup Pattern
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue(defaultStore);
  });

  it('handles async operations', async () => {
    const { getByRole } = renderWithProvider(<Component />);
    await userEvent.click(getByRole('button'));
    await waitFor(() => {
      expect(mockFunction).toHaveBeenCalled();
    });
  });
});
```

### State Management Pattern
```typescript
interface Store {
  data: any[];
  loading: boolean;
  error: string | null;
  filter: Record<string, any>;
  setFilter: (filter: Record<string, any>) => void;
  fetchData: () => Promise<void>;
}

const createStore = (overrides?: Partial<Store>): Store => ({
  data: [],
  loading: false,
  error: null,
  filter: {},
  setFilter: jest.fn(),
  fetchData: jest.fn(),
  ...overrides,
});
```

### Mock Data Pattern
```typescript
const mockData = {
  id: 1,
  title: 'Test Event',
  description: 'Test Description',
  venue: {
    city: 'Test City',
  },
  date: new Date().toISOString(),
};

const mockAuthContext = {
  user: {
    id: 1,
    email: 'test@example.com',
  },
  login: jest.fn(),
  logout: jest.fn(),
};
```

### Testing Utilities
```typescript
// Async testing helper
const waitForAsync = async (callback: () => void) => {
  await waitFor(() => {
    callback();
  }, { timeout: 1000 });
};

// User event helper
const simulateUserInteraction = async (element: HTMLElement, text: string) => {
  const user = userEvent.setup();
  await user.clear(element);
  await user.type(element, text);
};
