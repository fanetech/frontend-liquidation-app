# Liquidation App Frontend

A modern React application for managing customer liquidations with QR code payment integration.

## 🚀 Overview

This frontend provides a user-friendly interface for:
- User authentication and registration
- Customer management (CRUD operations)
- Liquidation processing and tracking
- QR code generation and display
- Responsive design with Bootstrap

## 🛠️ Technology Stack

- **React** 19.1.1 with modern hooks
- **Vite** 7.1.3 for fast development and building
- **Bootstrap** 5.3.7 for responsive UI
- **React Hook Form** with Yup validation
- **Axios** for API communication
- **QRCode.react** for QR code generation
- **React Router DOM** for routing

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Running backend API server

## ⚙️ Installation & Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd frontend-liquidation-app
npm install
```

### 2. Environment Configuration

Create a `.env.local` file:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Liquidation App
VITE_DEBUG=true
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
frontend-liquidation-app/
├── src/
│   ├── components/
│   │   ├── customers/     # Customer management
│   │   ├── liquidations/  # Liquidation management
│   │   ├── Admin.jsx      # Admin dashboard
│   │   ├── Home.jsx       # Landing page
│   │   ├── Login.jsx      # Authentication
│   │   └── Navbar.jsx     # Navigation
│   ├── services/          # API services
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🧩 Key Components

### Authentication
- **Login/Register**: JWT-based auth with form validation
- **ProtectedRoute**: Route guards for authenticated users

### Customer Management
- **CustomersPage**: List, search, and manage customers
- **CustomerModals**: Create/edit customer forms

### Liquidation Management
- **LiquidationsPage**: View and filter liquidations
- **LiquidationDetail**: Detailed view with QR code
- **QRCodeDisplay**: QR code generation and export

## 🔗 API Integration

The app uses Axios with JWT authentication interceptors. Services are organized in the `services/` directory:

- `api.js`: Base configuration and interceptors
- `customerService.js`: Customer CRUD operations
- `liquidationService.js`: Liquidation management

## 🚀 Deployment

### Docker

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

### Nginx Configuration

```nginx
server {
    listen 80;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Code Quality

- ESLint for code linting
- React DevTools recommended for development
- Hot Module Replacement enabled

## 🐛 Troubleshooting

### Common Issues

- **API Connection**: Verify backend is running and environment variables are set
- **Build Errors**: Clear `node_modules` and reinstall
- **Hot Reload**: Restart dev server if changes aren't reflecting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Run linting
5. Submit a pull request

---

**Version**: 1.0.0
**Last Updated**: January 2025
