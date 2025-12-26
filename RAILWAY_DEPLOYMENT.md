# Railway Deployment Guide

This guide explains how to deploy VulnReaper on Railway using the provided Nixpacks configurations.

## Overview

VulnReaper consists of two services:
1. **Backend** - Express.js API server (port 5002)
2. **Frontend** - Next.js web application (port 3000)

Railway typically deploys one service per project, so you'll need to create two separate Railway projects.

## Deploying Backend Service

1. Create a new Railway project
2. Connect your GitHub repository
3. In the Railway dashboard, go to Settings > Deploy tab
4. Set the "Nixpacks Config Path" to `nixpacks-backend.toml`
5. Add environment variables in Railway:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `PORT` - 5002 (or your preferred port)

## Deploying Frontend Service

1. Create another Railway project
2. Connect your GitHub repository
3. In the Railway dashboard, go to Settings > Deploy tab
4. Set the "Nixpacks Config Path" to `nixpacks-frontend.toml`
5. Add environment variables in Railway:
   - `NEXT_PUBLIC_API_URL` - URL of your deployed backend service

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5002
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app/api
```

## Notes

- Railway automatically sets the `PORT` environment variable, but you can override it
- Make sure your MongoDB database is accessible from Railway (consider using MongoDB Atlas)
- The frontend needs to know the backend URL for API calls
- Both services can be deployed independently
