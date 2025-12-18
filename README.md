# NGO Reporting System - Setup Guide

## Overview

This is a full-stack application for NGO monthly reporting with:

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Express.js with MongoDB
- **Features**: Submit reports, bulk upload CSV, admin dashboard

## Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (already configured in `.env`)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

#### Install dependencies:

```bash
cd backend
npm install
```

#### Start the backend server:

```bash
npm start
```

The server will run on **http://localhost:3000**

- You should see: `Server running on port 3000`

#### Health check:

```bash
curl http://localhost:3000/health
```

### 2. Frontend Setup

#### Install dependencies:

```bash
cd frontend
npm install
```

#### Start the development server:

```bash
npm run dev
```

The frontend will run on **http://localhost:5173** (or another port if 5173 is busy)


## API Endpoints

### Report APIs

- **POST** `/api/report` - Submit a single report

  ```json
  {
    "ngoId": "NGO001",
    "month": "2024-12",
    "peopleHelped": 150,
    "eventsConducted": 5,
    "fundsUtilized": 12000.5
  }
  ```

- **POST** `/api/reports/upload` - Upload CSV file (multipart/form-data)

  - Field name: `file`
  - Expected CSV columns: `ngoId,month,peopleHelped,eventsConducted,fundsUtilized`

- **GET** `/api/job-status/:jobId` - Get upload job status
  ```json
  {
    "jobId": "xxx",
    "status": "completed",
    "processed": 10,
    "total": 10,
    "successful": 9,
    "failed": 1,
    "errors": []
  }
  ```

### Dashboard API

- **GET** `/api/dashboard?month=2024-12` - Get dashboard statistics
  ```json
  {
    "success": true,
    "data": {
      "totalNGOs": 5,
      "totalPeopleHelped": 1250,
      "totalEventsConducted": 42,
      "totalFundsUtilized": 125000
    }
  }
  ```

## Features

### 1. Submit Monthly Report

- Fill in NGO ID, month, and metrics
- Single report submission
- Real-time validation

### 2. Bulk Upload

- Upload CSV file with multiple reports
- Progress tracking
- Error reporting
- Sample CSV download

### 3. Admin Dashboard

- View aggregated statistics
- Filter by month
- Real-time updates after submissions


### Mock Mode

If backend is unavailable, set in frontend `.env`:

```dotenv
VITE_USE_MOCK_DATA=true
```

This uses sample data for testing the UI.


## Next Steps

1. Install dependencies in both frontend and backend
2. Ensure MongoDB is accessible
3. Start backend: `npm start` (in backend folder)
4. Start frontend: `npm run dev` (in frontend folder)
5. Open browser to frontend URL and test the application

## Screenshots

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/665d02a2-3c86-4bdd-b966-b8cb633c42b8" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/fa54c6ce-112e-4f94-8c76-45ab7b9656e4" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/1273c72a-6cff-43d7-b638-9abf48875c72" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/31733eb6-4acf-46ec-941c-400bdba5677c" />




