# VulnReaper Frontend

The frontend is the user interface component of VulnReaper built with modern web technologies.

## Purpose

The frontend provides users with an intuitive interface to:
- View dashboard statistics and charts
- Manage vulnerability records
- Initiate security scans
- Generate and download reports
- Review activity logs

## Technologies Used

- **Next.js**: React framework for production-ready applications
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization library

## Setup Instructions

1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

Visit `http://localhost:3000` in your browser to access the application.

## Available Pages

- **Login Page**: User authentication
- **Dashboard**: Overview of vulnerability statistics
- **Vulnerabilities Page**: List and management of security issues
- **Scan Page**: Interface for initiating security scans
- **Reports Page**: Report generation and download
- **Activity Page**: Log of user actions

## Key Features

- Responsive design for all device sizes
- Real-time data visualization
- Intuitive user interface
- Fast performance

## Project Structure

- `src/app/`: Page components and routing
- `src/components/`: Reusable UI components
- `src/context/`: State management
- `src/lib/`: Utility functions and API clients