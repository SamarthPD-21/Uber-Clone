# 🚗 RideShare Platform

A full-stack ride-sharing application built with Spring Boot, MongoDB, JWT authentication, and Next.js.

## 📋 Features

### ✅ Backend Features
- **JWT Authentication** - Secure token-based authentication with BCrypt password encoding
- **Role-Based Access Control** - Separate permissions for Passengers (ROLE_USER) and Drivers (ROLE_DRIVER)
- **Ride Management** - Complete CRUD operations for ride requests
- **Input Validation** - Jakarta validation for all DTOs
- **Global Exception Handling** - Centralized error handling with custom exceptions
- **MongoDB Integration** - NoSQL database with Spring Data MongoDB

### 🎨 Frontend Features
- **Modern UI/UX** - Beautiful glassmorphic design with dark theme
- **Modal Authentication** - Login/Signup in a popup modal instead of separate pages
- **Role-Based Views** - Different interfaces for Passengers and Drivers
- **Real-Time Updates** - Refresh functionality for rides and requests
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend Structure
```
demo/src/main/java/org/samarth/rideshare/
├── config/          # Security, CORS, JWT configuration
├── controller/      # REST API endpoints
├── dto/            # Data Transfer Objects with validation
├── exception/      # Custom exceptions and global handler
├── model/          # MongoDB entities (User, Ride)
├── repository/     # MongoDB repositories
├── service/        # Business logic layer
└── util/           # Utility classes (RideStatus)
```

### Frontend Structure
```
frontend/src/
├── app/            # Next.js app directory
│   ├── page.tsx    # Main application with modal auth
│   ├── layout.tsx  # Root layout
│   └── globals.css # Global styles
└── lib/            # Shared utilities
    ├── api.ts      # API client
    └── types.ts    # TypeScript interfaces
```

## 📡 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login and get JWT token |

### Passenger Endpoints (ROLE_USER)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/rides` | Request a new ride |
| GET | `/api/v1/user/rides` | Get all your rides |
| POST | `/api/v1/rides/{id}/complete` | Complete a ride |

### Driver Endpoints (ROLE_DRIVER)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/driver/rides/requests` | View pending ride requests |
| POST | `/api/v1/driver/rides/{id}/accept` | Accept a ride request |
| POST | `/api/v1/rides/{id}/complete` | Complete a ride |

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- MongoDB (Atlas or Local)
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd demo
```

2. **Update MongoDB connection in `application.properties`:**
```properties
spring.data.mongodb.uri=mongodb+srv://your-connection-string
```

3. **Build and run the Spring Boot application:**
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🧪 Testing the Application

### Using cURL

**1. Register a Passenger:**
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123",
    "role": "ROLE_USER"
  }'
```

**2. Register a Driver:**
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "driver1",
    "password": "password123",
    "role": "ROLE_DRIVER"
  }'
```

**3. Login:**
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

**4. Request a Ride (use token from login):**
```bash
curl -X POST http://localhost:8081/api/v1/rides \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Koramangala",
    "dropLocation": "Indiranagar"
  }'
```

### Using the UI

1. **Open the frontend** at `http://localhost:3000`
2. **Click "Sign In / Sign Up"** button
3. **Create accounts** for both a Passenger and a Driver
4. **As Passenger:**
   - Request a ride with pickup and drop locations
   - View your ride history
   - Complete accepted rides
5. **As Driver:**
   - View pending ride requests
   - Accept available rides
   - Complete rides you've accepted

## 📦 Dependencies

### Backend
- Spring Boot 4.0.0
- Spring Data MongoDB
- Spring Security
- JWT (JJWT 0.12.5)
- Jakarta Validation

### Frontend
- Next.js 16.0.7
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4

## 🔒 Security Features

- **Password Encryption**: BCrypt hashing
- **JWT Tokens**: Secure token-based authentication
- **CORS Configuration**: Cross-origin resource sharing enabled
- **Role-Based Authorization**: Method-level security
- **Input Validation**: Jakarta Bean Validation
- **Global Exception Handling**: Consistent error responses

## 📝 Data Models

### User
```java
{
  "id": "string",
  "username": "string",
  "password": "string (encrypted)",
  "role": "ROLE_USER | ROLE_DRIVER"
}
```

### Ride
```java
{
  "id": "string",
  "userId": "string",
  "driverId": "string",
  "pickupLocation": "string",
  "dropLocation": "string",
  "status": "REQUESTED | ACCEPTED | COMPLETED",
  "createdAt": "timestamp"
}
```

## 🎯 Assignment Requirements Checklist

- ✅ Complete functioning API
- ✅ Proper folder structure
- ✅ DTOs with validation (@NotBlank, @Size, @Valid)
- ✅ Global exception handling
- ✅ JWT authentication implemented
- ✅ BCrypt password encoding
- ✅ MongoDB integration
- ✅ Role-based access control
- ✅ Clean architecture (Controller → Service → Repository)
- ✅ Modern frontend with modal authentication
- ✅ Comprehensive README

## 🌟 Additional Features

- **Enhanced UI/UX**: Modal-based authentication instead of separate pages
- **User Profile Display**: Shows username and role in header
- **Better Role Separation**: Distinct views for passengers and drivers
- **Empty States**: Friendly messages when no data is available
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Toast notifications for success/error messages
- **Persistent Sessions**: JWT stored in localStorage
- **Responsive Design**: Mobile-friendly interface

## 🤝 Contributing

This is a classroom project. Feel free to fork and enhance!

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Built as part of the Spring Boot + MongoDB classroom project.

---

**Backend API**: http://localhost:8081  
**Frontend UI**: http://localhost:3000
