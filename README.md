# Inventory Management System

A comprehensive inventory management system built with Spring Boot (backend) and React.js (frontend).

## Features

- **User Management**
  - Admin and employee roles
  - Secure authentication with JWT
  - User registration and profile management

- **Inventory Management**
  - Add, update, and delete inventory items
  - Categorize items
  - Track stock levels
  - SKU and barcode support

- **Stock Alerts & Notifications**
  - Low stock alerts
  - Expiry tracking
  - Alert management (resolve/ignore)

- **Order Management**
  - Manage incoming & outgoing orders
  - Order status tracking
  - Automatic inventory updates on order processing

- **Reporting & Analytics**
  - Stock reports
  - Sales & purchase summaries
  - Inventory valuation

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT Authentication
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React.js
- React Router
- Axios for API calls
- Bootstrap or Material-UI for styling
- Redux for state management

## Setup Instructions

### Prerequisites
Before starting, make sure you have the following installed:

- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or higher
- [Node.js](https://nodejs.org/) and npm
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

### Clone the Repository
To get the project on your local machine, run:

```sh
https://github.com/Jitendra-Jakkula/Smart_inventory_system.git

```

## Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Configure MySQL database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_inventory
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Build the project:
   ```sh
   mvn clean install
   ```
4. Run the application:
   ```sh
   mvn spring-boot:run
   ```
5. The backend server will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. The frontend application will start on `http://localhost:3000`

## API Documentation

The API endpoints are secured with JWT authentication. To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints
```http
POST /api/auth/signin  # User login
POST /api/auth/signup   # User registration
```

### Item Endpoints
```http
GET /api/items          # Get all items
GET /api/items/{id}     # Get item by ID
POST /api/items         # Create a new item
PUT /api/items/{id}     # Update an item
DELETE /api/items/{id}  # Delete an item
```

### Category Endpoints
```http
GET /api/categories         # Get all categories
GET /api/categories/{id}    # Get category by ID
POST /api/categories        # Create a new category
PUT /api/categories/{id}    # Update a category
DELETE /api/categories/{id} # Delete a category
```

### Order Endpoints
```http
GET /api/orders          # Get all orders
GET /api/orders/{id}     # Get order by ID
POST /api/orders         # Create a new order
PUT /api/orders/{id}/status  # Update order status
DELETE /api/orders/{id}  # Cancel an order
```

### Alert Endpoints
```http
GET /api/alerts          # Get all alerts
GET /api/alerts/{id}     # Get alert by ID
POST /api/alerts/generate # Generate alerts
PUT /api/alerts/{id}/resolve # Resolve an alert
PUT /api/alerts/{id}/ignore  # Ignore an alert
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Jitendra Jakkula - Initial work
