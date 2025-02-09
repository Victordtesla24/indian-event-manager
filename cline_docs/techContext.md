# Technical Context

## Frontend Infrastructure

### Admin Interface

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/frontend/src/pages/admin`
- Framework: React with TypeScript
- Styling: TailwindCSS
- Layout: Responsive grid system

#### Features
1. Dashboard System
   - Statistics overview
   - Quick actions panel
   - Recent activity tracking
   - Performance metrics
   - Revenue analytics

2. User Management
   - User listing with filters
   - Role management
   - Status tracking
   - Action logging
   - Bulk operations

3. Marketing Interface
   - Campaign management
   - Performance tracking
   - Budget management
   - Target audience
   - A/B testing

4. Settings Management
   - Site configuration
   - Payment settings
   - Email configuration
   - Language preferences
   - System preferences

#### Configuration
- Environment Variables:
  - API endpoints
  - Authentication settings
  - Feature flags
  - Analytics keys
  - Payment gateways

### Organizer Interface

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/frontend/src/pages/organizer`
- Framework: React with TypeScript
- Styling: TailwindCSS
- Layout: Responsive dashboard

#### Features
1. Dashboard System
   - Event statistics
   - Booking metrics
   - Revenue tracking
   - Quick actions
   - Recent activities

2. Event Management
   - Event creation
   - Schedule management
   - Ticket configuration
   - Venue selection
   - Media handling

3. Booking System
   - Booking tracking
   - Customer management
   - Payment processing
   - Refund handling
   - Analytics

4. Analytics Dashboard
   - Sales metrics
   - Attendance tracking
   - Revenue analysis
   - Customer insights
   - Performance trends

5. Payment Management
   - Transaction history
   - Settlement tracking
   - Refund processing
   - Financial reports
   - Bank integration

#### Configuration
- Environment Variables:
  - API endpoints
  - Authentication settings
  - Payment gateways
  - Analytics keys
  - Storage settings

### Role-Based Access

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/frontend/src/contexts`
- Implementation: React Context API
- Authentication: JWT-based
- Storage: Local storage with encryption

#### Features
1. Authentication System
   - JWT implementation
   - Session management
   - Token validation
   - Secure routing
   - Error handling

2. Authorization System
   - Role validation
   - Permission checks
   - Protected routes
   - Access control
   - Audit logging

3. Security Features
   - Token encryption
   - Session timeout
   - CSRF protection
   - XSS prevention
   - Secure storage

#### Configuration
- Environment Variables:
  - JWT secret
  - Token expiry
  - Security settings
  - Role definitions
  - Permission mappings

### React Application

#### Application Details
- Location: `/Users/Shared/cursor/indian-event-manager/frontend`
- Runtime: Node.js
- Language: TypeScript
- Key Dependencies:
  - React
  - React Testing Library
  - Jest
  - TypeScript
  - TailwindCSS

#### Features
1. Component Architecture
   - Type-safe props
   - Context providers
   - Error boundaries
   - Loading states
   - Responsive layouts

2. Testing Framework
   - Jest configuration
   - React Testing Library setup
   - User event testing
   - Mock data management
   - Integration tests

3. State Management
   - Centralized stores
   - Context-based auth
   - Type-safe interfaces
   - Async operations
   - Cache management

## Marketing Infrastructure

### Campaign System

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/app/marketing`
- Language: Python/TypeScript
- Key Dependencies:
  - FastAPI
  - SQLAlchemy
  - React
  - Analytics tools

#### Features
1. Campaign Management
   - Creation workflow
   - Audience targeting
   - Performance tracking
   - A/B testing
   - Analytics

2. Banner System
   - Dynamic creation
   - Scheduling
   - Click tracking
   - A/B testing
   - Analytics

3. Sponsor Management
   - Profile handling
   - Level tracking
   - Agreement management
   - Financial tracking
   - Reporting

#### Configuration
- Environment Variables:
  - Analytics API keys
  - Database settings
  - Feature flags
- Integration Points:
  - Analytics services
  - Payment systems
  - Notification services

## Hydrogen Infrastructure

### Storefront Details
- Location: `/Users/Shared/cursor/indian-event-manager/frontend/hydrogen-storefront`
- Runtime: Node.js
- Language: TypeScript/React
- Key Dependencies:
  - Hydrogen framework
  - Shopify SDK
  - GraphQL
  - Tailwind CSS

#### Features
1. Core System
   - Shopify integration
   - GraphQL operations
   - Custom components
   - SSR optimization

2. E-commerce
   - Product management
   - Cart operations
   - Checkout system
   - Account handling

3. Performance
   - Code splitting
   - Asset optimization
   - Cache management
   - PWA features

#### Configuration
- Environment Variables:
  - Shopify credentials
  - API endpoints
  - Feature flags
- Build Settings:
  - SSR configuration
  - Cache strategies
  - Bundle optimization

## MCP Server Infrastructure

### Memory Bank Server

#### Server Details
- Location: `/Users/vikd/Documents/Cline/MCP/memory-bank`
- Runtime: Node.js
- Language: TypeScript
- Key Dependencies:
  - @modelcontextprotocol/sdk
  - fs-extra
  - vitest (testing)

#### Features
1. Resource Management
   - URI format: `memory://{filename}`
   - Markdown file handling
   - Directory-based storage
   - Automatic file creation

2. Caching System
   - TTL-based (1 hour default)
   - In-memory storage
   - Automatic cleanup
   - Key-value structure

3. Error Handling
   - McpError integration
   - Type-safe error handling
   - Automatic error recovery
   - Detailed error messages

#### Configuration
- Environment Variables:
  - DOCS_DIR: Documentation directory path
- Default Settings:
  - TTL: 3600000ms (1 hour)
  - Cache: In-memory Map
  - File type: Markdown

### OpenRouter Server

#### API Details
- Base URL: https://openrouter.ai/api/v1
- Authentication: Bearer token
- Rate Limits: Based on subscription tier
- Supported Models: mamba-2.8b, mixtral-8x7b

#### Server Details
- Location: `/Users/vikd/Documents/Cline/MCP/openrouter-server`
- Runtime: Node.js
- Language: TypeScript
- Key Dependencies:
  - @modelcontextprotocol/sdk
  - axios
  - vitest (testing)

#### Model Selection
1. mamba-2.8b
   - Optimal for low complexity tasks (< 3)
   - Efficient token usage
   - Fast response times
   - Default token budget: 1500

2. mixtral-8x7b
   - For high complexity tasks (>= 3)
   - Advanced reasoning capabilities
   - Higher token capacity
   - Configurable token budget

#### Configuration
- Environment Variables:
  - OPENROUTER_API_KEY: API authentication
  - MAX_TOKENS: Token budget (default: 1500)
  - COMPLEXITY_THRESHOLD: Model selection threshold (default: 3)

#### Caching System
1. Token Management
   - Default budget: 1500 tokens
   - Dynamic allocation based on task
   - Token usage tracking
   - Cache-based optimization

2. Caching Strategy
   - Memory-based caching
   - TTL-based invalidation (1 hour)
   - Token usage tracking
   - Request deduplication

3. Error Recovery
   - Automatic error detection
   - Type-safe error handling
   - API error mapping
   - Cache-based fallback

## Common Infrastructure

### Testing Framework
1. Frontend Testing
   - Jest Configuration:
     * TypeScript support
     * DOM testing
     * Mock system
     * Coverage reporting
   - React Testing Library:
     * Component testing
     * User event simulation
     * Async testing
     * Screen queries

2. Test Types
   - Unit tests:
     * Component tests
     * Hook tests
     * Utility tests
   - Integration tests:
     * Page tests
     * Flow tests
     * Store tests
   - Error scenario tests:
     * Loading states
     * Error states
     * Edge cases
   - Cache behavior tests:
     * Store caching
     * Context updates
     * State persistence

### Error Handling
1. McpError Integration
   - Standard error codes
   - Type-safe error handling
   - Error message formatting
   - Error recovery patterns

2. Error Types
   - InvalidRequest
   - MethodNotFound
   - InvalidParams
   - InternalError

### Type Safety
1. TypeScript Configuration
   - Strict mode enabled
   - ESM modules
   - Type declarations
   - Interface definitions
   - React types
   - Testing types

2. Type Patterns
   - Component props
   - Context types
   - Store types
   - Event types
   - Test utility types
   - Mock data types
   - Request/Response types
   - Error types
   - Cache entry types
   - Configuration types

### Development Tools
1. Build System
   - TypeScript compiler
   - ESM support
   - Declaration generation
   - Source maps

2. Development Workflow
   - Hot reloading
   - Type checking
   - Error reporting
   - Test automation

## Core Backend Dependencies

### Database Infrastructure

#### System Details
- Type: PostgreSQL 14
- Location: `/Users/Shared/cursor/indian-event-manager/app/db`
- Key Dependencies:
  - SQLAlchemy 1.4
  - Alembic
  - psycopg2-binary
  - Redis

#### Features
1. Schema Management
   - Migration system
   - Version control
   - Rollback support
   - Data validation
   - Index optimization

2. Query System
   - Connection pooling
   - Query optimization
   - Transaction management
   - Relationship handling
   - Cascade operations

3. Caching Layer
   - Redis integration
   - TTL management
   - Cache invalidation
   - Data serialization
   - Memory optimization

#### Configuration
- Environment Variables:
  - Database credentials
  - Connection settings
  - Pool configuration
  - Cache settings
- Integration Points:
  - ORM mappings
  - Migration scripts
  - Cache strategies
  - Backup systems

### API Infrastructure

#### System Details
- Framework: FastAPI
- Location: `/Users/Shared/cursor/indian-event-manager/app/api`
- Key Dependencies:
  - Pydantic
  - uvicorn
  - starlette
  - python-jose

#### Features
1. Endpoint Management
   - Route handling
   - Request validation
   - Response formatting
   - Error handling
   - Documentation

2. Authentication
   - JWT implementation
   - Role-based access
   - Token management
   - Session handling
   - Security middleware

3. Performance
   - Async operations
   - Connection pooling
   - Response caching
   - Rate limiting
   - Resource optimization

#### Configuration
- Environment Variables:
  - API keys
  - Security settings
  - Rate limits
  - Cache configuration
- Integration Points:
  - Database connections
  - External services
  - Monitoring systems
  - Documentation tools

### Security Infrastructure

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/app/core`
- Key Dependencies:
  - python-jose
  - passlib
  - bcrypt
  - cryptography

#### Features
1. Authentication
   - Password hashing
   - Token generation
   - Session management
   - 2FA support
   - OAuth integration

2. Authorization
   - Role management
   - Permission system
   - Access control
   - Audit logging
   - Policy enforcement

3. Data Protection
   - Encryption
   - Key management
   - Data masking
   - Secure storage
   - Transport security

#### Configuration
- Environment Variables:
  - Security keys
  - Hash settings
  - Token configuration
  - Audit settings
- Integration Points:
  - Authentication services
  - Logging systems
  - Monitoring tools
  - Backup services

### Monitoring Infrastructure

#### System Details
- Location: `/Users/Shared/cursor/indian-event-manager/app/monitoring`
- Key Dependencies:
  - prometheus-client
  - grafana
  - sentry-sdk
  - logging

#### Features
1. Performance Monitoring
   - Metric collection
   - Performance tracking
   - Resource monitoring
   - Alert system
   - Dashboard creation

2. Error Tracking
   - Error logging
   - Stack traces
   - Context capture
   - Alert generation
   - Error analytics

3. Health Checks
   - Service status
   - Database health
   - Cache status
   - API health
   - Resource usage

#### Configuration
- Environment Variables:
  - Monitoring endpoints
  - Alert settings
  - Log levels
  - Metric configuration
- Integration Points:
  - Logging services
  - Alert systems
  - Dashboard tools
  - Analytics platforms
