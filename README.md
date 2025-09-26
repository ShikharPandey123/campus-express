# 📦 Campus Express - Shipment Management System

A comprehensive, full-stack shipment management system built with Next.js, Node.js, and MongoDB. Features real-time tracking, role-based access control, and an intuitive dashboard for managing shipments across multiple warehouses.

![Campus Express Logo](public/CE-5.jpg)

## 🌟 Features

### 🔐 **Authentication & Authorization**
- **JWT-based Authentication** with secure token management
- **Role-Based Access Control (RBAC)** with three user roles:
  - **Admin**: Full system access, user management, all CRUD operations
  - **Manager**: Shipment management, warehouse oversight, reporting
  - **WarehouseStaff**: Basic shipment tracking and status updates

### 📊 **Dashboard & Analytics**
- **Real-time KPI Metrics**: Out for Delivery, Pending Pickup, In Transit, Delivered Today
- **Interactive Charts**: Shipment status breakdown and location distribution
- **Recent Shipments Table** with live updates
- **Responsive Design** optimized for desktop and mobile

### 🚚 **Shipment Management**
- **Create Shipments** with comprehensive form validation
- **Real-time Tracking** with live status updates
- **Status Management**: Pending → In Transit → Out for Delivery → Delivered
- **Automatic Tracking ID Generation** with unique identifiers
- **Shipment Details**: Weight, dimensions, sender/recipient information
- **Date Management**: Pickup dates and expected delivery dates

### 🗺️ **Live Tracking**
- **Interactive Map** integration with Leaflet
- **Real-time Location Updates** via Socket.IO
- **Multi-shipment Tracking** on a single map view
- **Status-based Map Markers** with color coding

### 🏢 **Warehouse Management**
- **Multi-warehouse Support** with automatic assignment
- **Warehouse Details**: Name, location, capacity management
- **Default Warehouse Creation** for seamless onboarding

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15+ (App Router, Server Components)
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks + Context API
- **Maps**: Leaflet + React-Leaflet
- **Real-time**: Socket.IO Client
- **Charts**: Recharts for data visualization

### **Backend**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO for live updates
- **API**: RESTful API with proper error handling

### **DevOps & Tools**
- **Monorepo**: NPM Workspaces
- **Package Manager**: NPM
- **Build Tools**: TypeScript compiler, Next.js build system
- **Development**: Nodemon, ts-node, Hot reload
- **Deployment**: Optimized for Render, Vercel, Railway

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShikharPandey123/campus-express.git
   cd campus-express
   ```

2. **Install dependencies**
   ```bash
   # Install all workspace dependencies
   npm install
   
   # Or install individually
   npm install --workspace=client
   npm install --workspace=server
   ```

3. **Environment Configuration**

   **Server Environment** (`server/.env`):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-express
   PORT=5000
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=development
   ```

   **Client Environment** (`client/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Database Setup**
   - Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/)
   - Create a new cluster and database
   - Get your connection string and update `MONGODB_URI`
   - The application will auto-create required collections and sample data

### **Running the Application**

1. **Development Mode (Recommended)**
   ```bash
   # Terminal 1 - Start the backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start the frontend client
   cd client
   npm run dev
   ```

2. **Production Build**
   ```bash
   # Build both client and server
   npm run build --workspace=client
   npm run build --workspace=server
   
   # Start production servers
   npm start --workspace=server
   npm start --workspace=client
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Socket.IO**: Real-time updates on port 5000

## 👥 User Roles & Permissions

### 🔴 **Admin Role**
**Full System Access**
- ✅ **Dashboard**: View all KPI metrics and analytics
- ✅ **Shipment Management**: Create, read, update, delete all shipments
- ✅ **User Management**: Create and manage user accounts
- ✅ **Warehouse Management**: Add, modify, delete warehouses
- ✅ **System Settings**: Configure system-wide settings
- ✅ **Reports**: Access all reporting features

### 🟡 **Manager Role**
**Operational Management**
- ✅ **Dashboard**: View KPI metrics and team analytics  
- ✅ **Shipment Management**: Create, read, update shipments
- ✅ **Tracking**: Access live tracking for all shipments
- ✅ **Warehouse Oversight**: View warehouse information
- ✅ **Team Reports**: Generate operational reports
- ❌ **User Management**: Cannot create/delete users
- ❌ **System Settings**: Cannot modify system settings

### 🟢 **WarehouseStaff Role**
**Basic Operations**
- ✅ **Dashboard**: View basic KPI metrics
- ✅ **Shipment Tracking**: View and update shipment status
- ✅ **Status Updates**: Mark shipments as picked up, in transit, delivered
- ✅ **Basic Information**: View sender/recipient details
- ❌ **Create Shipments**: Cannot create new shipments
- ❌ **Delete Operations**: Cannot delete shipments
- ❌ **User Management**: No access to user functions
- ❌ **Reports**: Limited reporting access

## 🎯 Application Flow

### **User Authentication Flow**
```
1. Landing → 2. Login/Register → 3. JWT Token → 4. Role-based Dashboard
```

1. **Registration/Login**
   - Users register with email, password, and role selection
   - System validates credentials and generates JWT token
   - Token stored in localStorage for session management
   - Automatic role-based redirection

2. **Dashboard Access**
   - Role-based sidebar navigation with conditional menu items
   - Real-time KPI updates via Socket.IO
   - Responsive layout with mobile optimization

### **Shipment Management Flow**
```
Create → Assign → Track → Update Status → Deliver
```

1. **Shipment Creation** (Admin/Manager only)
   - Comprehensive form with sender/recipient details
   - Automatic tracking ID generation (TRK{timestamp}{random})
   - Weight, dimensions, and package description
   - Pickup and expected delivery dates
   - Automatic warehouse assignment

2. **Tracking & Updates**
   - Real-time status updates: Pending → In Transit → Out for Delivery → Delivered
   - Live map tracking with location updates
   - Status change notifications via Socket.IO
   - Historical status timeline

3. **Delivery Confirmation**
   - Final status update to 'Delivered'
   - Automatic timestamp recording
   - Update delivery metrics and KPIs

### **Real-time Features Flow**
```
Action → Socket.IO Event → All Connected Clients → UI Update

### **Environment Variables**

**Server Configuration**
```env
# Database
MONGODB_URI=your_mongodb_connection_string
DB_NAME=campus_express

# Authentication  
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

# Socket.IO
SOCKET_CORS_ORIGIN=https://your-frontend-domain.com
```

**Client Configuration**
```env
# API Endpoints
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.com

# Maps
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key_if_needed

# Features
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_MAPS=true
```


