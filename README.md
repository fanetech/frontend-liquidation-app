# Liquidation App Frontend - React Application

A modern, responsive React application built with Vite for managing customer liquidations with integrated QR code payment functionality.

## 🚀 Overview

This frontend application provides a user-friendly interface for:
- **User Authentication**: Secure login and registration system
- **Customer Management**: Complete CRUD operations for customer data
- **Liquidation Processing**: Intuitive liquidation management workflow
- **QR Code Integration**: Seamless QR code generation and display
- **Responsive Design**: Mobile-first approach with Bootstrap styling
- **Real-time Updates**: Dynamic data updates and notifications

## 🏗️ Architecture

### Project Structure

```
frontend-liquidation-app/
├── src/
│   ├── components/
│   │   ├── customers/
│   │   │   ├── CustomerModals.jsx      # Customer CRUD modal forms
│   │   │   └── CustomersPage.jsx       # Customer management page
│   │   ├── liquidations/
│   │   │   ├── LiquidationDetail.jsx   # Liquidation detail view
│   │   │   ├── LiquidationModals.jsx   # Liquidation CRUD modals
│   │   │   ├── LiquidationsPage.jsx    # Liquidation management page
│   │   │   └── QRCodeDisplay.jsx       # QR code display component
│   │   ├── Admin.jsx                   # Admin dashboard
│   │   ├── Home.jsx                    # Landing page
│   │   ├── Login.jsx                   # Authentication form
│   │   ├── Navbar.jsx                  # Navigation component
│   │   ├── ProductList.jsx             # Legacy component
│   │   ├── ProtectedRoute.jsx          # Route protection wrapper
│   │   ├── QRCodeDemo.jsx              # QR code demonstration
│   │   └── Register.jsx                # User registration form
│   ├── services/
│   │   ├── api.js                      # Axios configuration and auth service
│   │   ├── customerService.js          # Customer API operations
│   │   └── liquidationService.js       # Liquidation API operations
│   ├── config.js                       # Application configuration
│   ├── App.jsx                         # Main application component
│   ├── main.jsx                        # Application entry point
│   ├── App.css                         # Component styles
│   └── index.css                       # Global styles
├── public/
│   └── vite.svg                        # Vite logo asset
├── index.html                          # HTML template
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
├── eslint.config.js                    # ESLint configuration
└── README.md                           # This file
```

## 🛠️ Technology Stack

### Core Framework
- **React**: 19.1.1 with modern hooks and concurrent features
- **Vite**: 7.1.3 - Fast build tool and development server
- **JavaScript**: ES6+ with module support

### UI & Styling
- **Bootstrap**: 5.3.7 - Responsive CSS framework
- **React Bootstrap**: 2.10.10 - Bootstrap components for React
- **React Icons**: 5.5.0 - Icon library
- **React Toastify**: 11.0.5 - Notification system

### Form Management
- **React Hook Form**: 7.62.0 - Performant form handling
- **Yup**: 1.7.0 - Schema-based validation
- **React Select**: 5.10.2 - Enhanced select components

### HTTP & API
- **Axios**: 1.11.0 - HTTP client with interceptors
- **JWT**: Token-based authentication handling

### Development Tools
- **ESLint**: 9.33.0 - Code linting and quality
- **Vite Plugin React SWC**: Fast refresh and compilation
- **React Router DOM**: 7.8.0 - Client-side routing

### QR Code Integration
- **QRCode.react**: 4.2.0 - QR code generation and display
- **React Data Table Component**: 7.7.0 - Advanced table functionality

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher (comes with Node.js)
- **Backend API**: Running Liquidation App backend
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend-liquidation-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Application Settings
VITE_APP_NAME=Liquidation App
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEBUG=true
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | Application display name | `Liquidation App` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_DEBUG` | Enable debug mode | `false` |

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
    },
  },
]
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

Features:
- Hot module replacement (HMR)
- Automatic browser refresh
- Source maps for debugging
- Development server with proxy

### Production Mode

```bash
npm run build
npm run preview
```

### Docker Development

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 🧩 Key Components

### Authentication Components

#### Login.jsx
- JWT-based authentication
- Form validation with Yup
- Error handling and user feedback
- Remember me functionality

#### Register.jsx
- User registration with role selection
- Password strength validation
- Email format validation
- Duplicate username/email prevention

#### ProtectedRoute.jsx
- Route-level authentication guard
- Role-based access control
- Automatic redirect to login
- Admin-only route protection

### Customer Management

#### CustomersPage.jsx
- Paginated customer list
- Real-time search and filtering
- CRUD operations through modals
- Responsive data table
- Bulk operations support

#### CustomerModals.jsx
- Create/Edit customer forms
- Form validation with React Hook Form
- Address and contact information
- IFU (tax ID) field for compliance

### Liquidation Management

#### LiquidationsPage.jsx
- Advanced liquidation filtering
- Status-based color coding
- Quick action buttons
- Pagination with configurable sizes
- Export functionality (planned)

#### LiquidationDetail.jsx
- Complete liquidation information
- QR code generation and display
- Payment status tracking
- Transaction history
- Penalty calculation display

#### LiquidationModals.jsx
- Liquidation creation and editing
- Customer selection dropdown
- Amount and penalty inputs
- Date range validation
- Status management

#### QRCodeDisplay.jsx
- QR code rendering with QRCode.react
- Download functionality (PNG/SVG)
- Copy to clipboard
- Print support
- Error correction level configuration

### Navigation & Layout

#### Navbar.jsx
- Responsive navigation bar
- Authentication status display
- Role-based menu items
- Mobile hamburger menu
- Logout functionality

#### Home.jsx
- Application landing page
- Quick navigation links
- System status overview
- Recent activity summary

### Administrative

#### Admin.jsx
- User management dashboard
- System statistics
- Configuration settings
- Audit logging interface

## 🔗 API Integration

### Axios Configuration

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('liquidation_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('liquidation_jwt_token');
      localStorage.removeItem('liquidation_user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Layer

#### AuthService

```javascript
export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    const { token, username: user, role } = response.data;

    localStorage.setItem('liquidation_jwt_token', token);
    localStorage.setItem('liquidation_user_data', JSON.stringify({ username: user, role }));

    return { token, username: user, role };
  },

  async register(username, password) {
    const response = await api.post('/auth/register/user', { username, password });
    return response.data;
  },

  logout() {
    localStorage.removeItem('liquidation_jwt_token');
    localStorage.removeItem('liquidation_user_data');
  },

  isAuthenticated() {
    return !!localStorage.getItem('liquidation_jwt_token');
  },

  getCurrentUser() {
    const userData = localStorage.getItem('liquidation_user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};
```

#### CustomerService

```javascript
export const customerService = {
  async list(page = 0, size = 10) {
    const response = await api.get('/customers', { params: { page, size } });
    return response.data;
  },

  async search(query, page = 0, size = 10) {
    const response = await api.get('/customers/search', {
      params: { q: query, page, size }
    });
    return response.data;
  },

  async get(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async create(customerData) {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  async update(id, customerData) {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/customers/${id}`);
    return true;
  }
};
```

#### LiquidationService

```javascript
export const liquidationService = {
  async list(filters = {}) {
    const params = {};
    if (filters.customerId) params.customerId = filters.customerId;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.page !== undefined) params.page = filters.page;
    if (filters.size) params.size = filters.size;

    const response = await api.get('/liquidations', { params });
    return response.data;
  },

  async get(id) {
    const response = await api.get(`/liquidations/${id}`);
    return response.data;
  },

  async create(liquidationData) {
    const response = await api.post('/liquidations', liquidationData);
    return response.data;
  },

  async update(id, liquidationData) {
    const response = await api.put(`/liquidations/${id}`, liquidationData);
    return response.data;
  },

  async payLiquidation(id) {
    const response = await api.put(`/liquidations/${id}/pay`);
    return response.data;
  }
};
```

## 🎨 Styling & UI

### Bootstrap Integration

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Component with Bootstrap classes
<div className="container-fluid">
  <div className="row">
    <div className="col-md-8">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Customer List</h5>
        </div>
        <div className="card-body">
          {/* Content */}
        </div>
      </div>
    </div>
  </div>
</div>
```

### Custom CSS

```css
/* App.css */
.full-width-main {
  min-height: calc(100vh - 76px); /* Adjust for navbar height */
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
```

### Responsive Design

```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.2rem;
  }

  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
```

## 🧪 Testing

### Unit Testing (Planned)

```bash
npm test
```

### Component Testing

```javascript
// Example test for Login component
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('handles login submission', async () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  // Assert expected behavior
});
```

### E2E Testing (Planned)

```bash
npm run test:e2e
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Serve with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t liquidation-frontend .
docker run -p 80:80 liquidation-frontend
```

## 🔧 Development

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Development Tips

1. **Use React DevTools** for component inspection
2. **Enable React Strict Mode** for development warnings
3. **Use Hot Module Replacement** for fast development
4. **Implement Error Boundaries** for better error handling

## 🐛 Troubleshooting

### Common Issues

#### API Connection Issues

**Problem**: Unable to connect to backend API
**Solution**:
```bash
# Check if backend is running
curl http://localhost:8080/api/actuator/health

# Verify environment variables
echo $VITE_API_BASE_URL

# Check CORS configuration
```

#### Build Issues

**Problem**: Build fails with dependency errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Hot Reload Not Working

**Problem**: Changes not reflecting in browser
**Solution**:
```bash
# Restart dev server
npm run dev

# Check for syntax errors
npm run lint
```

#### Form Validation Issues

**Problem**: Form validation not working as expected
**Solution**:
```javascript
// Check Yup schema
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required()
});

// Verify form setup
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});
```

## 📊 Performance

### Optimization Techniques

1. **Code Splitting**: Automatic with Vite
2. **Lazy Loading**: For route components
3. **Memoization**: React.memo for expensive components
4. **Image Optimization**: WebP format support
5. **Bundle Analysis**: `npm run build -- --mode analyze`

### Performance Monitoring

```javascript
// Performance measurement
const startTime = performance.now();
// ... code to measure
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

## 🔒 Security

### Client-Side Security

- **Input Validation**: Comprehensive form validation
- **XSS Prevention**: React's automatic escaping
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: LocalStorage for non-sensitive data

### Best Practices

1. **Environment Variables**: Never commit secrets
2. **HTTPS Only**: Always use HTTPS in production
3. **Input Sanitization**: Validate all user inputs
4. **Error Handling**: Don't expose sensitive information in errors

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Maintained by**: Frontend Development Team
