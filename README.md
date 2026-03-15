# Event Management & Ticket Booking System

A robust, scalable backend built with Node.js, Express, PostgreSQL, Prisma, Redis, and BullMQ.

## Features
- **Authentication**: JWT-based auth with Role-Based Access Control (RBAC).
- **Event Management**: Organizers can create, update, and delete events.
- **Ticket Booking**: Customers can book tickets with atomic transactions to prevent overbooking.
- **Background Jobs**: BullMQ and Redis for booking confirmations and event update notifications.
- **Documentation**: Swagger UI for API testing and documentation.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ, Redis
- **Validation**: Zod
- **Logging**: Winston

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup `.env` file (copy from `.env.example`).
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
6. Seed the database:
   ```bash
   node prisma/seed.js
   ```

### Running the Project
- **API Server**:
  ```bash
  npm run dev
  ```
- **Workers**:
  The workers currently run within the same process for simplicity in this demo, but can be split into separate services.

## API Documentation
Once the server is running, access Swagger UI at:
`http://localhost:3000/api/docs`

## Folder Structure
```
src
 ├── config        # DB & Redis configs
 ├── controllers   # Handling requests
 ├── services      # Business logic
 ├── repositories  # Data access (Prisma)
 ├── routes        # API Endpoints
 ├── middleware    # Auth, Role, Error
 ├── validators    # Zod schemas
 ├── queues        # BullMQ queues
 ├── workers       # BullMQ workers
 └── utils         # Logger, etc.
```
