# VulnReaper - Vulnerability Management System

VulnReaper is a cybersecurity tool that helps find and fix computer security issues.

## What does it do?

VulnReaper helps users:
- Find security problems in computer systems
- Track and organize discovered issues
- Manage the fixing process
- Generate reports on findings

## System Architecture

VulnReaper has three main components:
- **Frontend**: The user interface you see in your browser
- **Backend**: The server that processes requests and manages data
- **Database**: Stores all information about vulnerabilities and users

## Quick Start

1. Install Node.js (version 16 or higher) and MongoDB
2. Install dependencies:
   ```
   # In the root directory
   npm run install:all
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` in the `backend` folder
   - Update the MongoDB connection string and other settings as needed
4. Start both servers:
   ```
   # In the root directory
   npm run dev
   ```
5. Visit `http://localhost:3000` in your browser

## Alternative Method (Manual Start)

If you prefer to start servers manually:
1. Terminal 1: Navigate to `backend` folder and run `npm start`
2. Terminal 2: Navigate to `frontend` folder and run `npm run dev`

## Troubleshooting

If you see "Connection Refused" errors:
1. Make sure the backend server is running (port 5002)
2. Check that MongoDB is accessible
3. Verify the `.env` configuration in the backend folder
4. Ensure no firewall is blocking the connection

## Who is this for?

VulnReaper is designed for cybersecurity professionals but is simple enough for anyone to understand the basics of vulnerability management.

## Documentation

See `QUICKSTART.md` for detailed setup and usage instructions.