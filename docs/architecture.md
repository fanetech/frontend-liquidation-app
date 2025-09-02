# Frontend Architecture

## React Application Architecture

The frontend follows a modern component-based architecture with clear separation between UI components, business logic, and data management.

### Component Architecture

```
┌─────────────────────────────────────┐
│         App.jsx                     │
│   Root Component + Router Setup     │
└─────────────────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌─────────────┐    ┌─────────────┐
│  Pages      │    │ Components  │
│ Route-based │    │ Reusable    │
│ Components  │    │ UI Elements │
└─────────────┘    └─────────────┘
       │                 │
       └────────┬────────┘
                ▼
┌─────────────────────────────────────┐
│       Services Layer                │
│   API Calls + Business Logic        │
└─────────────────────────────────────┘
```

### State Management Architecture

```
┌─────────────────────────────────────┐
│      Component State                │
│   useState + useEffect Hooks        │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│     Local Storage                   │
│   JWT Tokens + User Session         │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│    Context API (Future)             │
│   Global State Management           │
└─────────────────────────────────────┘
```

### Data Flow Architecture

```
User Interaction → Component → Service API Call → Backend API
                        ▲              ▲
                        │              │
Response ←──────────────┼──────────────┘
                        │
                State Update
```

## Component Architecture

### Frontend Architecture

**React Application Structure:**

```
┌─────────────────────────────────────┐
│           App.jsx                   │
│   Main component + routing + layout │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│         React Router DOM            │
│     Client-side routing system      │
└─────────────────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌─────────────┐    ┌─────────────┐
│ Components  │    │  Services   │
│ UI elements │    │ API calls   │
└─────────────┘    └─────────────┘
       │                 │
       └────────┬────────┘
                ▼
┌─────────────────────────────────────┐
│       State Management             │
│   React Hooks + Context API        │
└─────────────────────────────────────┘
```

**Key Components:**

```
Authentication Components:
├── Login.jsx          - User authentication
├── Register.jsx       - User registration
└── ProtectedRoute.jsx - Route protection

Customer Management:
├── CustomersPage.jsx     - Customer list & search
├── CustomerModals.jsx    - CRUD operations
└── Customer forms        - Create/Edit forms

Liquidation Management:
├── LiquidationsPage.jsx  - Liquidation dashboard
├── LiquidationDetail.jsx - Detailed view
├── LiquidationModals.jsx - CRUD operations
└── QRCodeDisplay.jsx     - QR code interface

Administrative:
├── Admin.jsx             - Admin dashboard
├── Home.jsx              - Landing page
└── QRCodeDemo.jsx        - Demo component
```


## Routing Architecture

### Route Structure

```
App.jsx (Root)
├── / (Home) → Home.jsx
├── /login → Login.jsx
├── /register → Register.jsx
├── /customers → ProtectedRoute(CustomersPage.jsx)
├── /liquidations → ProtectedRoute(LiquidationsPage.jsx)
├── /liquidations/:id → ProtectedRoute(LiquidationDetail.jsx)
├── /admin → ProtectedRoute(Admin.jsx, requireAdmin=true)
└── /qr-demo → ProtectedRoute(QRCodeDemo.jsx)
```

### Route Protection

```
Public Routes: /login, /register
Protected Routes: /customers, /liquidations, /admin, /qr-demo
Admin Routes: /admin (requires admin role)
```

## Form Management Architecture

### React Hook Form Integration

```
Form Component
├── useForm() Hook
│   ├── resolver: yupResolver(schema)
│   ├── defaultValues: initialData
│   └── mode: 'onChange'
├── register() - Field registration
├── handleSubmit() - Form submission
├── formState - Validation state
│   ├── errors - Field errors
│   ├── isSubmitting - Submit state
│   └── isValid - Form validity
└── reset() - Form reset
```

### Validation Schema (Yup)

```
Validation Rules:
├── Required fields (*)
├── Email format validation
├── Phone number patterns
├── String length constraints
├── Number range validation
└── Custom validation rules
```

## API Integration Architecture

### Axios Configuration

```
HTTP Client Setup:
├── Base URL configuration
├── Request timeout settings
├── Default headers (JSON)
├── Request interceptors
│   ├── JWT token injection
│   └── Request logging
└── Response interceptors
    ├── Error handling
    └── Token refresh logic
```

### Service Layer Structure

```
API Services:
├── AuthService - Authentication operations
├── CustomerService - Customer CRUD operations
├── LiquidationService - Liquidation management
└── Shared utilities - Common API functions
```

## Component Communication

### Props Flow

```
Parent Component
├── State management
├── Event handlers
└── Data passing
    │
    ▼
Child Components
├── Receive props
├── Handle events
└── Update parent state
```

### Event Handling

```
User Interaction → Event Handler → State Update → Re-render
                        ▲
                        │
                Prevent default
                Form validation
                API calls
```

## Technology Stack Details

### Frontend Technologies

```
┌─────────────────────────────────────┐
│        Frontend Stack               │
├─────────────────────────────────────┤
│ Framework:    React 19.1.1          │
│ Build:        Vite                  │
│ Styling:      Bootstrap 5.3.7       │
│ Routing:      React Router DOM      │
│ HTTP:         Axios 1.11.0          │
│ Forms:        React Hook Form       │
│ Validation:   Yup 1.7.0             │
│ Notifications: React Toastify       │
│ QR:           QRCode.react 4.2.0    │
└─────────────────────────────────────┘
```

## Design Patterns Used

```
Frontend Patterns:
├── Component Composition
├── Higher-Order Components
├── Custom Hooks
├── Container/Presentational
├── Controlled Components
└── Error Boundaries
```