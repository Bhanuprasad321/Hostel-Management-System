````markdown
# StaySync 🏠

## Multi-Tenant Hostel Management SaaS

StaySync is a full-stack, multi-tenant SaaS application designed to digitize and simplify hostel administration. It allows multiple hostels to operate on a single platform while keeping their data isolated using hostel-level tenant filtering.

The system supports three major roles: **Super Admin, Hostel Admin, and Student**, with role-based access control and JWT authentication.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Password hashing using bcrypt
- Role-Based Access Control (RBAC)
- Protected REST APIs
- Role-specific authorization
- Subscription-based feature access

### 🏢 Multi-Tenancy
- Multiple hostels supported on a single platform
- Shared MySQL database
- Hostel-level data isolation using `hostel_id`
- Users can only access data belonging to their authorized hostel

### 👨‍💼 Super Admin
- Manage hostels
- Manage hostel administrators
- Create and manage subscription plans
- Manage hostel subscriptions
- View payment transactions
- View platform revenue
- View platform-level analytics
- Manage support tickets
- Review audit logs
- Manage demo requests

### 🏠 Hostel Admin
- Manage students
- Manage rooms
- Allocate students to rooms
- Vacate students
- Manage visitors
- Configure hostel fees
- Manage student fee payments
- Publish notices
- Handle complaints
- Raise support tickets
- View analytics
- Export CSV reports
- Upgrade subscription plans

### 🎓 Student
- View room allocation
- View fee records and payment status
- View hostel notices
- Submit complaints
- Receive notifications

---

## 📦 Core Modules

- Hostel Management
- Student Management
- Room Management
- Room Allocation
- Visitor Management
- Fee Management
- Subscription Management
- Payment Transactions
- Support Tickets
- Notifications
- Audit Logs
- Analytics
- CSV Reports
- Demo Request / Lead Management

---

## 🔄 Room Allocation Workflow

```text
Select Student
      ↓
Select Room
      ↓
Validate Student & Room
      ↓
Check Same Hostel
      ↓
Check Room Capacity
      ↓
Check Existing Allocation
      ↓
Create Allocation
      ↓
Update Room Occupancy
      ↓
Create Security Deposit Fee
      ↓
Create Audit Log
      ↓
Create Notification
````

The system prevents:

* Allocating a non-existent student
* Allocating a non-existent room
* Cross-hostel allocation
* Allocating into a full room
* Multiple active allocations for the same student

---

## 💳 Subscription System

StaySync follows a SaaS subscription model.

When a new hostel is onboarded, the system assigns a **15-day trial subscription**.

### Subscription Flow

```text
View Plans
    ↓
Select Plan
    ↓
Create Payment Transaction
    ↓
Create Subscription
    ↓
Cancel Previous Active Subscription
    ↓
Create Audit Log
    ↓
Create Notification
```

### Subscription Rules

* Trial cannot be purchased again after expiry
* Same plan cannot be purchased again
* Downgrades are not permitted
* Hostel Admin access is restricted when there is no active subscription
* Subscription plans can control feature access

---

## 🔑 Authentication Flow

```text
User Login
    ↓
Email + Password
    ↓
Find User
    ↓
bcrypt Password Verification
    ↓
Generate JWT
    ↓
Return Token
    ↓
Authorization: Bearer <token>
    ↓
JWT Middleware
    ↓
Extract User / Role / hostel_id
    ↓
Role Authorization
    ↓
Feature Authorization
    ↓
Controller
    ↓
MySQL
```

JWT authentication is combined with role-based middleware such as:

```text
protect
adminOnly
superAdminOnly
studentOnly
checkFeature()
```

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│ Dashboards                  │
│ Students                    │
│ Rooms                       │
│ Allocations                 │
│ Fees                        │
│ Visitors                    │
│ Subscriptions               │
│ Analytics                   │
└──────────────┬──────────────┘
               │
               │ Axios / REST API
               ▼
┌─────────────────────────────┐
│     Node.js + Express.js    │
│                             │
│ Routes                      │
│ Controllers                 │
│ Middleware                  │
│ Authentication              │
│ Authorization               │
│ Business Logic              │
└──────────────┬──────────────┘
               │
               │ mysql2
               ▼
┌─────────────────────────────┐
│          MySQL              │
│                             │
│ Hostels                     │
│ Users                       │
│ Rooms                       │
│ Allocations                 │
│ Fees                        │
│ Subscriptions               │
│ Visitors                    │
│ Notifications               │
│ Audit Logs                  │
└─────────────────────────────┘
```

---

## 🗄️ Database

StaySync uses a relational MySQL database.

### Main Tables

```text
hostels
users
rooms
allocations
subscriptions
subscription_plans
payment_transactions
visitors
audit_logs
notifications
support_tickets
fee_settings
student_fees
```

### Tenant Isolation

Business entities contain a `hostel_id` to associate records with their respective hostel.

```text
                    StaySync
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Hostel A       Hostel B       Hostel C
        │              │              │
     Students       Students       Students
     Rooms          Rooms          Rooms
     Fees           Fees           Fees
     Visitors       Visitors       Visitors
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Shared MySQL
                       │
                 hostel_id
                  isolation
```

---

## 📊 Analytics

### Hostel-Level Analytics

Hostel Admins can view:

* Total students
* Total rooms
* Occupancy breakdown
* Total visitors
* Total fees collected
* Pending fee amount
* Fee collection rate

### Platform-Level Analytics

Super Admins can view:

* Total platform revenue
* Active subscriptions
* Recent payment transactions
* Top hostels by revenue
* Subscription plan distribution

---

## 📋 Fee Management

Each hostel can configure:

* Monthly fee
* Security deposit

Fee records contain:

```text
Student
Amount
Status
Due Date
```

Supported statuses:

```text
Pending
Paid
```

When a student is allocated to a room, the system automatically creates a security deposit fee record.

---

## 👥 Visitor Management

Hostel Admins can maintain visitor records containing:

* Visitor name
* Student being visited
* Visit date
* Purpose

---

## 🎫 Support Tickets

Hostel Admins can raise support tickets to the Super Admin.

### Ticket Lifecycle

```text
Open
  ↓
In Progress
  ↓
Resolved
  ↓
Closed
```

Super Admins can view tickets, update their status, and add resolution messages.

---

## 🔔 Notifications

The system generates notifications for important events such as:

* Room allocation
* Subscription purchase / upgrade
* Fee payment
* Support ticket status changes

---

## 📝 Audit Logs

Important actions are recorded in audit logs.

Examples:

```text
STUDENT_CREATED
ROOM_CREATED
ALLOCATION_CREATED
SUBSCRIPTION_PURCHASED
FEE_PAID
```

Each log records:

* User
* Action
* Hostel
* Timestamp

---

## 📈 Reports & CSV Export

Hostel Admins can export operational data as CSV files.

### Student Report

```text
Name
Email
Allocated Room
Hostel
```

### Allocation Report

```text
Student Name
Room Number
Status
Date
```

### Visitor Report

```text
Visitor Name
Student Visited
Date
Purpose
```

---

## 🛠️ Tech Stack

| Category         | Technology                 |
| ---------------- | -------------------------- |
| Frontend         | React.js                   |
| Styling          | Tailwind CSS / CSS Modules |
| Backend          | Node.js                    |
| API Framework    | Express.js                 |
| Database         | MySQL                      |
| Database Driver  | mysql2                     |
| HTTP Client      | Axios                      |
| Authentication   | JWT                        |
| Password Hashing | bcrypt                     |
| CSV Export       | json2csv                   |
| Email            | Nodemailer                 |
| API Architecture | REST API                   |
| Version Control  | Git & GitHub               |

---

## 📁 Project Structure

```text
StaySync/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Bhanuprasad321/Hostel-Management-System.git

cd Hostel-Management-System
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Create MySQL Database

```sql
CREATE DATABASE staysync;
```

Import the project database schema into MySQL.

### 5. Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=staysync

JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔒 Security

StaySync implements:

* JWT authentication
* bcrypt password hashing
* Role-based access control
* Protected routes
* Tenant-level data isolation
* Subscription-based feature authorization
* Business-rule validation
* Audit logging

---

## 🎯 Project Highlights

StaySync goes beyond a basic CRUD hostel management application.

The project demonstrates:

```text
Full-Stack Development
        +
REST API Development
        +
MySQL Database Design
        +
JWT Authentication
        +
Role-Based Access Control
        +
Multi-Tenancy
        +
Subscription Management
        +
Feature Gating
        +
Business Logic
        +
Analytics
        +
Reporting
        +
Audit Logging
```

The application contains **50+ REST APIs** supporting the major hostel administration workflows.

---

## 🔮 Future Enhancements

Planned improvements include:

* Bed-level management
* Maintenance requests
* QR-code visitor entry
* WhatsApp notifications
* Automated monthly fee generation
* Redis caching
* BullMQ background jobs
* AWS deployment
* Stripe/Razorpay automated billing
* Employee management
* Advanced lead-management dashboard

---

## 📌 Project Status

**StaySync v1.0**

Core hostel administration functionality has been implemented, including:

* Multi-tenancy
* Authentication
* RBAC
* Hostel management
* Student management
* Room management
* Room allocation
* Fee management
* Visitor management
* Subscription management
* Payment transactions
* Support tickets
* Notifications
* Audit logs
* Analytics
* CSV reporting
* Demo request workflow

---

## 👨‍💻 Author

**Bhanu Prasad Naidu**

Full-Stack Developer | B.Tech ECE

* GitHub: [https://github.com/Bhanuprasad321](https://github.com/Bhanuprasad321)
* LinkedIn: [https://linkedin.com/in/bhanu-prasad-naidu-kanugula](https://linkedin.com/in/bhanu-prasad-naidu-kanugula)
* Email: [kanugulabhanu012@gmail.com](mailto:kanugulabhanu012@gmail.com)

---

## 📄 License

This project is developed for educational and portfolio purposes.

