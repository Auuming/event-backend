## EventTicker - Event Ticketing System API

EventTicker is a RESTful API for an Event Ticketing System with user authentication and role-based access control.

## 🚀 Features

### Authentication System
- User registration and login with JWT tokens
- Password hashing using bcryptjs
- Role-based authorization (staff/admin)
- Protected routes with middleware

### Core Entities
- **Users:** Registration, login, profile management. There are two types of user 'admin' and 'member'.
- **Events:** CRUD operations for event management.
- **Ticketing:** Event ticketing requests linking Users to Events

### Database Schema
- **User Model:** name, email, tel, password, role, timestamps
- **Event Model:** name, description, eventDate, venue, organizer, availableTicket, posterPicture
- **Ticketing Model:** user reference, event reference, ticketAmount

### API Structure
- **Auth Routes (/api/v1/auth):** register, login, logout, get profile
- **Event Routes (/api/v1/events):** CRUD operations for events
- **Ticketing Routes (/api/v1/ticketing):** CRUD operations for event ticketing requests

### Access Control / Controllers 
- After login, registered admin user can add/update/delete/view any book
- After login, registered member user can issue reservation request to borrow any book. The book list is provided to the user. Book information is also available. Registered member user can have only 3 reservations in total at any time.
- Registered member user can view his/her own reservation requests
- Registered member user can edit his/her own reservation request 
- Registered member user can delete his/her own reservation request 
- Registered admin user can view any reservation request 
- Registered admin user can edit any reservation request 
- Registered admin user can delete any reservation request 

### Security Features
- JWT-based authentication
- Rate limiting (100 requests per 10 minutes)
- Helmet for security headers
- XSS protection
- MongoDB injection protection
- CORS enabled

### Documentation
- Swagger/OpenAPI documentation integrated
- Available at /api-docs endpoint

### Technology Stack
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose ODM
**Authentication:** JWT, bcryptjs
**Security:** helmet, xss-clean, express-rate-limit
**Documentation:** Swagger UI

### Development Setup
- Uses nodemon for development
- Environment variables in config/config.env
- MongoDB connection with mongoose

The project follows RESTful API conventions with proper middleware, error handling, and security measures.
