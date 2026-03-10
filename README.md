# 🚀 Rentify - Property Rental Management System

A full-stack web application that connects property owners with tenants through an intuitive platform featuring real-time messaging, reservation management, secure authentication, and comprehensive admin controls.

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

Rentify is a comprehensive property rental management system designed to streamline interactions between property owners, tenants, and administrators. The platform enables property owners to list their properties, tenants to browse and reserve properties, and administrators to oversee the entire system.

Built with modern web technologies, Rentify provides a seamless experience for all stakeholders in the rental property ecosystem. Property owners can efficiently manage their listings, track reservations, and communicate with potential tenants. Tenants can easily discover properties, make reservation requests, and maintain direct communication with property owners. Administrators have complete oversight with powerful tools to manage users, moderate content, and ensure platform integrity.

**Key Highlights:**
- **Secure Authentication**: Session-based authentication with Spring Security and role-based access control (RBAC) ensuring data security and proper authorization
- **Property Management**: Complete CRUD operations with multi-image upload, advanced filtering, and search capabilities
- **Real-time Communication**: Integrated messaging system enabling direct tenant-owner communication for inquiries and negotiations
- **Reservation Workflow**: Streamlined booking process with status tracking (Pending, Confirmed, Cancelled) and owner approval system
- **Admin Control Panel**: Comprehensive dashboard for user management, property moderation, and system monitoring
- **Responsive Design**: Fully responsive UI with 44+ media queries ensuring optimal experience across all devices (desktop, tablet, mobile)
- **Modern UI/UX**: Clean, intuitive interface with dark/light theme support and smooth animations
- **Notification System**: Real-time notifications for reservations, messages, and important updates

**Project Context:**
This full-stack application was developed as an academic project, demonstrating proficiency in modern web development practices, RESTful API design, database management, and collaborative software development. Each team member took ownership of specific modules, implementing both frontend and backend components to create a cohesive, production-ready application.

## Features

### 🔐 Authentication & User Management
- User registration and secure login
- Role-based access control (Admin, Owner, Tenant)
- Password encryption with Spring Security
- User profile and settings management
- Session management

### 🏘️ Property Management
- Create, edit, and delete property listings
- Upload multiple property images
- Advanced search and filtering
- Property details with amenities
- Owner dashboard for managing listings
- Track incoming reservations

### 📅 Reservation System
- Browse available properties
- Make reservation requests
- Reservation status tracking (Pending, Confirmed, Cancelled)
- View reservation history
- Owner approval workflow

### 💬 Real-time Messaging
- Direct chat between tenants and owners
- Message notifications
- Conversation history
- Contact property owners for inquiries

### 👨‍💼 Admin Panel
- User management (view, edit, delete)
- Property oversight and moderation
- Message monitoring
- Contact form management
- System-wide notifications

### 🌐 Additional Features
- Responsive design
- Home page with featured properties
- About Us and Contact pages
- FAQ and resources
- Legal pages (Privacy Policy, Terms, Cookie Policy)
- Notification system

## Tech Stack

**Frontend:**
- **React** 19.2.0 - Modern JavaScript library for building user interfaces
- **React Router DOM** 7.9.4 - Declarative routing for React applications
- **Axios** 1.13.1 - Promise-based HTTP client for API communication
- **Lucide React** 0.545.0 - Beautiful, consistent icon library
- **CSS3** - Custom styling with responsive design (44+ media queries)
- **React Hooks** - Custom hooks for state management and side effects

**Backend:**
- **Spring Boot** 3.5.7 - Enterprise-grade Java framework for rapid application development
- **Spring Security** - Comprehensive security framework for authentication and authorization
- **Spring Data JPA** - Simplified data access layer with repository pattern
- **Hibernate ORM** 6.6.33 - Object-relational mapping for database operations
- **MySQL** 8.0+ - Relational database management system
- **Lombok** - Reduces boilerplate code with annotations
- **SpringDoc OpenAPI** 2.2.0 - Automated API documentation (Swagger UI)
- **Java** 21 - Latest LTS version with modern language features
- **HikariCP** - High-performance JDBC connection pool
- **Bean Validation** - Input validation with annotations

**Development Tools:**
- **Maven** 3.6+ - Dependency management and build automation
- **Git** - Version control system
- **BCrypt** - Password hashing algorithm for secure storage
- **Session Management** - Secure session-based authentication with Spring Security
- **CORS** - Cross-Origin Resource Sharing configuration
- **CSRF Protection** - Cross-Site Request Forgery prevention with token validation

**Architecture Patterns:**
- RESTful API design
- MVC (Model-View-Controller) pattern
- Repository pattern for data access
- Service layer for business logic
- DTO (Data Transfer Objects) for API communication
- Exception handling with global error handler

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Java JDK** 21
- **MySQL** 8.0 or higher
- **Maven** 3.6 or higher

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rentify.git
cd rentify
```

2. **Set up the MySQL database**
```sql
CREATE DATABASE rentify_db;
```

3. **Configure database credentials**

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rentify_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. **Install backend dependencies**
```bash
cd backend
mvn clean install
```

5. **Install frontend dependencies**
```bash
cd frontend
npm install
```

### Running the App

1. **Start the backend server**
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `https://project-rentify.up.railway.app`

2. **Start the frontend development server**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

3. **Access the application**

Open your browser and navigate to `http://localhost:3000`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ Change the default admin password after first login.

## Project Structure

```
rentify/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rentify/
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── repository/      # Data access layer
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── exception/       # Exception handling
│   │   │   │   └── RentifyApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── uploads/                     # Uploaded property images
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/              # Admin panel components
│   │   │   ├── RentalOwner/        # Owner dashboard components
│   │   │   ├── Tenant/             # Tenant dashboard components
│   │   │   └── ...                 # Shared components
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # Entry point
│   └── package.json
│
└── README.md
```

### Team Contributions

**Member 1: Adikari AMND - Authentication & User Management**

*Responsible for implementing the complete authentication system and user management features*

**Frontend Components:**
- `LoginPage.jsx` - User authentication interface with form validation
- `SignupPage.jsx` - User registration with role selection (Owner/Tenant)
- `ProfilePage.jsx` - User profile display and management
- `SettingsPage.jsx` - Account settings, password change, theme preferences
- `LogoutModal.jsx` - Secure logout confirmation dialog

**Backend Components:**
- `AuthController.java` - REST endpoints for login, signup, logout
- `UserController.java` - User profile and account management endpoints
- `AuthService.java` - Authentication business logic and user registration
- `UserService.java` - User CRUD operations and validation
- `User.java` - User entity with JPA annotations
- `Role.java` - Role entity for RBAC implementation
- `SecurityConfig.java` - Spring Security configuration with session management and CSRF protection
- `UserDetailsServiceImpl.java` - Custom user details service for authentication

**Key Features:** Session-based authentication, password encryption with BCrypt, Spring Security configuration, role-based access control, CSRF protection

---

**Member 2: Warnasooriya KAKM - Property Management (Owner Side)**

*Developed the complete property listing and management system for property owners*

**Frontend Components:**
- `RentalOwner/OwnerDashboard.jsx` - Centralized dashboard for property owners
- `RentalOwner/AddProperty.jsx` - Multi-step form for adding new properties with image upload
- `RentalOwner/EditProperty.jsx` - Property editing interface with existing data population
- `RentalOwner/ViewProperty.jsx` - Detailed property view with all information
- `IncomingReservations.jsx` - Manage and respond to reservation requests

**Backend Components:**
- `PropertyController.java` - RESTful endpoints for property CRUD operations
- `PropertyService.java` - Business logic for property management
- `FileController.java` - File upload and retrieval endpoints
- `FileStorageService.java` - File system operations for image storage
- `Property.java` - Property entity with relationships
- `PropertyRepository.java` - JPA repository for data access
- `PropertySpecification.java` - Dynamic query building for advanced filtering

**Key Features:** Multi-image upload, property search and filtering, JPA Specifications for complex queries, file storage management

---

**Member 3: Samaraweera KIS - Reservations & Messaging**

*Implemented the booking system and real-time communication features*

**Frontend Components:**
- `Tenant/TenantDashboard.jsx` - Tenant interface for browsing properties
- `ReserveModal.jsx` - Reservation booking form with date selection
- `MyReservations.jsx` - View and manage user's reservations
- `ChatBox.jsx` - Real-time chat interface with message history
- `MessagesPage.jsx` - Conversation list and message management

**Backend Components:**
- `ReservationController.java` - Reservation CRUD and status management endpoints
- `MessageController.java` - Messaging system endpoints
- `ReservationService.java` - Reservation business logic and validation
- `MessageService.java` - Message handling and conversation management
- `Reservation.java` - Reservation entity with status tracking
- `Message.java` - Message entity with sender/receiver relationships
- `ReservationRepository.java` - Reservation data access with custom queries
- `MessageRepository.java` - Message data access and conversation retrieval

**Key Features:** Reservation status workflow, real-time messaging, conversation threading, notification integration

---

**Member 4: Ethugala EPHH - Admin Panel & Supporting Features**

*Created the administrative interface and all supporting pages for the platform*

**Frontend Components:**
- `Admin/AdminLogin.jsx` - Separate admin authentication interface
- `Admin/AdminDashboard.jsx` - Admin overview with statistics and quick actions
- `Admin/AdminUsers.jsx` - User management interface (view, edit, delete)
- `Admin/AdminProperties.jsx` - Property moderation and management
- `Admin/AdminMessages.jsx` - Message monitoring and moderation
- `HomePage.jsx` - Landing page with featured properties
- `AboutUsPage.jsx` - Company information and team details
- `ContactUsPage.jsx` - Contact form for user inquiries
- Legal pages - Privacy Policy, Terms of Service, Cookie Policy
- Resources - FAQ, Blog, Help documentation
- `NotificationSystem` - Toast notifications and notification badge
- `Footer.jsx` - Site-wide footer with links and information

**Backend Components:**
- `AdminController.java` - Admin-specific endpoints with elevated permissions
- `ContactController.java` - Contact form submission handling
- `AdminService.java` - Admin operations and system management
- `ContactService.java` - Contact inquiry management
- `Contact.java` - Contact form entity
- `ContactRepository.java` - Contact data access
- `DataInitializer.java` - Database seeding with initial admin account
- `GlobalExceptionHandler.java` - Centralized exception handling
- Custom exception classes - Structured error responses

**Key Features:** Admin dashboard with analytics, user moderation, contact form handling, notification system, exception handling, system initialization

## 🔒 Security Implementation

Rentify implements enterprise-grade security using **Spring Security** with session-based authentication.

### Authentication Method

**Session-Based Authentication** (Not JWT)
- Users authenticate via login endpoint
- Server creates and maintains session (JSESSIONID cookie)
- Session stored server-side with user credentials
- Automatic session validation on each request
- Session expires on logout or timeout

### Security Features

**1. Password Security**
- **BCrypt Hashing Algorithm** - Industry-standard password encryption
- Automatic salt generation for each password
- Passwords never stored in plain text
- One-way hashing (cannot be reversed)

**2. Role-Based Access Control (RBAC)**
- Three distinct roles: `ROLE_ADMIN`, `ROLE_OWNER`, `ROLE_TENANT`
- Method-level security with `@PreAuthorize` annotations
- URL-based access restrictions in SecurityConfig
- Hierarchical permission system

**3. CSRF Protection**
- Cross-Site Request Forgery token validation
- CSRF token stored in cookies (`XSRF-TOKEN`)
- Token validated on state-changing requests (POST, PUT, DELETE)
- Frontend automatically includes token in requests

**4. CORS Configuration**
- Configured for frontend origins (localhost:3000, 3001)
- Credentials enabled for cookie-based authentication
- Specific allowed methods and headers
- Preflight request handling

**5. Session Management**
- Maximum 1 concurrent session per user
- Session invalidation on logout
- Automatic cleanup of expired sessions
- Session fixation protection

**6. HTTP Security**
- Custom authentication entry points (401 Unauthorized)
- Access denied handlers (403 Forbidden)
- Secure cookie configuration (HttpOnly where appropriate)
- Exception handling for security errors

### Security Configuration

```java
// Password Encoding
BCryptPasswordEncoder - 10 rounds (default strength)

// Session Configuration
- Max Sessions: 1 per user
- Session Timeout: Configurable in application.properties
- Cookie Names: JSESSIONID, XSRF-TOKEN

// Access Control
- Public: /api/auth/**, GET /api/properties/**, /api/files/**
- Owner: POST/PUT/DELETE /api/properties/**, /api/files/upload
- Admin: /api/admin/**
- Authenticated: All other endpoints
```

### Why Session-Based Instead of JWT?

**Advantages for this application:**
- ✅ Simpler implementation for academic project
- ✅ Server-side session control (can revoke immediately)
- ✅ No token storage needed on client
- ✅ Built-in Spring Security support
- ✅ Automatic CSRF protection
- ✅ Better for traditional web applications
- ✅ Session management handled by Spring

**Security Best Practices Implemented:**
- Password complexity validation
- Username and email uniqueness checks
- Transactional user operations
- Secure error messages (no information leakage)
- Logging for security auditing
- Input validation on all endpoints

## Usage

### For Property Owners

**Getting Started:**
1. **Register**: Create an account and select "Owner" role during signup
2. **Login**: Access your account using your credentials
3. **Dashboard**: Navigate to the Owner Dashboard to see your properties overview

**Managing Properties:**
1. **Add Property**: Click "Add Property" and fill in details:
   - Property name, description, and location
   - Price per night/month
   - Amenities and features
   - Upload multiple property images
2. **Edit Property**: Update property information anytime
3. **View Properties**: See all your listed properties with status
4. **Delete Property**: Remove properties that are no longer available

**Handling Reservations:**
1. View incoming reservation requests in the "Incoming Reservations" section
2. Review tenant details and requested dates
3. Confirm or decline reservation requests
4. Track reservation status (Pending, Confirmed, Cancelled)

**Communication:**
- Receive messages from interested tenants
- Respond to inquiries through the integrated chat system
- Get notifications for new messages and reservation requests

---

### For Tenants

**Getting Started:**
1. **Register**: Create an account and select "Tenant" role
2. **Login**: Access the platform with your credentials
3. **Dashboard**: Browse available properties on your dashboard

**Finding Properties:**
1. **Browse**: View all available properties with images and details
2. **Search**: Use filters to find properties matching your criteria:
   - Location
   - Price range
   - Amenities
   - Property type
3. **View Details**: Click on any property to see complete information

**Making Reservations:**
1. Click "Reserve" on your desired property
2. Select check-in and check-out dates
3. Review pricing and details
4. Submit reservation request
5. Wait for owner confirmation

**Managing Bookings:**
1. View all your reservations in "My Reservations"
2. Track reservation status
3. Cancel reservations if needed
4. View reservation history

**Communication:**
- Contact property owners directly through chat
- Ask questions about properties
- Discuss reservation details
- Receive notifications for reservation updates

---

### For Administrators

**Dashboard Overview:**
1. **Login**: Use admin credentials (default: admin/admin123)
2. **Dashboard**: View system statistics and overview:
   - Total users, properties, reservations
   - Recent activity
   - System health metrics

**User Management:**
1. View all registered users (owners and tenants)
2. Search and filter users
3. View user details and activity
4. Edit user information
5. Delete or suspend problematic accounts
6. Monitor user roles and permissions

**Property Management:**
1. View all properties on the platform
2. Moderate property listings
3. Remove inappropriate or fraudulent listings
4. Monitor property status and activity

**Message Monitoring:**
1. View all platform messages
2. Monitor for inappropriate content
3. Intervene in disputes if necessary
4. Ensure platform communication guidelines are followed

**Contact Form Management:**
1. View all contact form submissions
2. Respond to user inquiries
3. Track resolution status
4. Export contact data for analysis

**System Administration:**
- Send system-wide notifications
- Monitor platform performance
- Manage system settings
- View audit logs and activity reports

---

### API Documentation

**Interactive API Documentation:**

Access the complete API documentation with interactive testing at:
```
https://project-rentify.up.railway.app/swagger-ui.html
```

**API Endpoints Overview:**

**Authentication:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current-user` - Get current user info

**Properties:**
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create property (Owner only)
- `PUT /api/properties/{id}` - Update property (Owner only)
- `DELETE /api/properties/{id}` - Delete property (Owner only)
- `GET /api/properties/owner/{ownerId}` - Get properties by owner

**Reservations:**
- `GET /api/reservations` - Get user reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create reservation (Tenant only)
- `PUT /api/reservations/{id}/confirm` - Confirm reservation (Owner only)
- `PUT /api/reservations/{id}/cancel` - Cancel reservation
- `GET /api/reservations/property/{propertyId}` - Get property reservations

**Messages:**
- `GET /api/messages` - Get user messages
- `GET /api/messages/{id}` - Get message by ID
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/{userId}` - Get conversation with user
- `DELETE /api/messages/{id}` - Delete message

**Admin:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/properties` - Get all properties
- `DELETE /api/admin/properties/{id}` - Delete property
- `GET /api/admin/messages` - Get all messages
- `GET /api/admin/contacts` - Get contact submissions

**File Upload:**
- `POST /api/files/upload` - Upload property images
- `GET /api/files/{filename}` - Retrieve uploaded file

## Screenshots

![Home Page](homePage.png)
![Login Page](loginPage.png)
![Manage Properties/Owner Dashboard](manageProperties.png)
![Add Property](addProperty.png)
![Browse Property/Tenant Dashboard](browseProperty.png)
![Reserve Property](reserveProperty.png)
![Contact Property Owner](contactOwner.png)
![Chat Box In Sidebar](chatBox.png)
![Admin Login ](adminLogin.png)
![Admin Dashboard](adminDashboard.png)
![Manage Messages as Admin](messageManagement.png)

## Contributing

This is an academic project developed as a collaborative team effort. Each member contributed equally to the project's success by taking ownership of specific modules and implementing them from design to deployment.

### Development Team

**Adikari AMND** - Authentication & User Management
- Implemented secure session-based authentication system with Spring Security
- Developed user management features
- Created login, signup, profile, and settings interfaces
- Configured Spring Security and role-based access control

**Warnasooriya KAKM** - Property Management
- Built complete property listing system
- Implemented file upload and storage functionality
- Created owner dashboard and property CRUD operations
- Developed advanced search and filtering with JPA Specifications

**Samaraweera KIS** - Reservations & Messaging
- Developed reservation booking system
- Implemented real-time messaging functionality
- Created tenant dashboard and reservation management
- Built chat interface with conversation threading

**Ethugala EPHH** - Admin Panel & Supporting Features
- Created comprehensive admin dashboard
- Developed user and property moderation tools
- Built landing page and supporting pages
- Implemented notification system and exception handling

### Development Approach

- **Agile Methodology**: Iterative development with regular team meetings
- **Version Control**: Git for collaborative development
- **Code Reviews**: Peer review process for quality assurance
- **Testing**: Manual testing and bug fixing throughout development
- **Documentation**: Comprehensive code comments and API documentation

### Technologies Learned

Through this project, the team gained hands-on experience with:
- Full-stack web development (React + Spring Boot)
- RESTful API design and implementation
- Database design and JPA/Hibernate ORM
- Authentication and authorization (Session-based, Spring Security, CSRF protection)
- File upload and storage management
- Real-time communication systems
- Responsive web design
- Git collaboration and version control

## License

This project is developed as part of an academic assignment for educational purposes.

**Academic Use Only** - This project is created to demonstrate understanding of full-stack web development concepts, including:
- Modern web application architecture
- Frontend and backend integration
- Database design and management
- Security best practices
- RESTful API development
- User interface design

All code is original work by the development team, with standard libraries and frameworks used under their respective licenses.

## Contact

For inquiries about this project, please reach out to the development team:

**Project Repository**: [GitHub Repository Link]

**Team Members:**
- Adikari AMND
- Warnasooriya KAKM
- Samaraweera KIS
- Ethugala EPHH

**Alternative Contact:**
Use the contact form within the application at `http://localhost:3000/contact` when the application is running.

**For Technical Issues:**
- Check the [Getting Started](#getting-started) section for setup instructions
- Ensure all prerequisites are installed
- Verify database connection settings
- Check that both frontend and backend servers are running

**For Academic Inquiries:**
This project demonstrates proficiency in modern web development technologies and can serve as a reference for similar full-stack applications.

---

**Developed with ❤️ by Team Rentify**
