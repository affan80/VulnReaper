# VulnReaper Backend

The backend is the server-side component of VulnReaper that handles data processing, authentication, and business logic.

## Purpose

The backend serves as the central hub that:
- Processes API requests from the frontend
- Manages database operations
- Handles user authentication and authorization
- Executes security scans
- Generates reports

## Technologies Used

- **Express.js**: Web application framework
- **MongoDB**: Database for storing vulnerability data
- **JWT**: Authentication token management
- **Nmap**: Network scanning utility

## Setup Instructions

1. Navigate to the `backend` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server

The server will start on port 5001 by default.

## System Connections

- Connects to MongoDB database for data storage
- Serves API endpoints for frontend consumption

## Core Functions

- User authentication and session management
- Vulnerability data management
- Security scanning orchestration
- Report generation

## Project Structure

- `server.js`: Main application entry point
- `controllers/`: Request handlers
- `models/`: Database schemas
- `routes/`: API route definitions
- `services/`: Business logic implementations