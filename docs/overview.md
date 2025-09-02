# Frontend - Liquidation App

## Overview

The frontend is a modern React application that provides a responsive web interface for managing customer liquidations and QR code generation. Built with React 19.1.1 and Vite, it offers a clean, user-friendly experience with comprehensive form validation and real-time interactions.

## Key Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Customer Management**: Complete CRUD interface for customer data
- **Liquidation Processing**: Intuitive workflow for managing liquidations
- **QR Code Integration**: Seamless QR code generation and display
- **Responsive Design**: Mobile-first approach with Bootstrap 5.3.7
- **Real-time Updates**: Dynamic data updates and notifications
- **Form Validation**: Comprehensive client-side validation with Yup
- **Role-based UI**: Different interfaces for Admin and User roles

## Technology Stack

- **React 19.1.1**: Modern JavaScript library with Hooks
- **Vite**: Fast build tool and development server
- **Bootstrap 5.3.7**: Responsive CSS framework
- **React Router DOM 7.8.0**: Client-side routing
- **Axios 1.11.0**: HTTP client for API communication
- **React Hook Form 7.62.0**: Performant form management
- **Yup 1.7.0**: Schema-based form validation
- **React Toastify 11.0.5**: Notification system
- **QRCode.react 4.2.0**: QR code generation and display
- **React Data Table Component 7.7.0**: Advanced table functionality

## Application Architecture

### Component Structure

```
App.jsx (Main Application)
├── Router (React Router DOM)
├── Authentication Components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ProtectedRoute.jsx
├── Customer Management
│   ├── CustomersPage.jsx
│   └── CustomerModals.jsx
├── Liquidation Management
│   ├── LiquidationsPage.jsx
│   ├── LiquidationDetail.jsx
│   ├── LiquidationModals.jsx
│   └── QRCodeDisplay.jsx
└── Administrative
    ├── Admin.jsx
    ├── Home.jsx
    └── Navbar.jsx
```

### State Management

- **Local Storage**: JWT tokens and user session data
- **React Hooks**: useState and useEffect for component state
- **Context API**: Global state management (available for future use)

## User Experience

### Authentication Flow

1. **Login**: User enters credentials
2. **Token Storage**: JWT token saved in localStorage
3. **Route Protection**: Automatic redirects for unauthorized access
4. **Role-based Navigation**: Dynamic menu based on user permissions

### Main Workflows

#### Customer Management
- View paginated customer list with search
- Create new customers with form validation
- Edit existing customer information
- Delete customers with confirmation

#### Liquidation Processing
- Browse liquidations with advanced filtering
- View detailed liquidation information
- Generate QR codes for payments
- Track payment status and history

## Development Status

### Completed Features
- ✅ User authentication and authorization
- ✅ Customer CRUD operations
- ✅ Liquidation management interface
- ✅ QR code generation and display
- ✅ Responsive design for all devices
- ✅ Form validation and error handling
- ✅ Real-time notifications
- ✅ Role-based access control

### Current Focus
- 🔄 Performance optimizations
- 🔄 Advanced search and filtering
- 🔄 Enhanced user experience
- 🔄 Mobile responsiveness improvements

## Target Users

1. **Administrators**: Full access to customer and liquidation management
2. **Regular Users**: Limited access for viewing and basic operations
3. **Mobile Users**: Optimized experience for tablets and smartphones

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+