# Interior Invoice Generator

A production-grade SaaS-style application for interior contractors to generate room-wise cost sheet invoices in PDF format.

## Features
- **Project & Client Management**: Keep track of project details and client names.
- **Room-wise Breakdown**: Add multiple rooms to a single project.
- **Itemized Costs**: Detailed item entry with auto-calculating dimensions (L x W) for sq.ft or units.
- **Real-time Calculations**: Instant updates for room totals and grand totals as you type.
- **PDF Generation**: Generate professional, print-ready PDF invoices.
- **Clean & Professional UI**: Minimalist, contractor-friendly design.

## Tech Stack
- **Backend**: Spring Boot 3, JPA, MySQL, Flying Saucer (PDF generation)
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide Icons
- **Database**: MySQL

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server 8+

## Setup Instructions

### 1. Database Setup
Create a database named `interior_invoice_db` in MySQL:
```sql
CREATE DATABASE interior_invoice_db;
```
*Note: The application is configured to use `root`/`root` as credentials. You can change this in `backend/src/main/resources/application.properties`.*

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run the application using the provided wrapper (it will automatically download Maven if needed):
```bash
./mvnw spring-boot:run
```
*Note: If you are on Windows, use `.\mvnw spring-boot:run` in PowerShell.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Usage
1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Enter Project Name, Client Name, and Date.
3. Add Rooms and Items within those rooms.
4. Click **Save Project** at the top right.
5. Once saved, click **Generate PDF** to download the professional invoice.
