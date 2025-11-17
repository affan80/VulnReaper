#!/bin/bash

# VulnReaper Backend Deployment Script
# This script helps deploy the backend to various platforms

set -e

echo "🚀 VulnReaper Backend Deployment Script"
echo "====================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set!"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗃️ Pushing database schema..."
npx prisma db push

# Run tests if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Build the application (if needed)
if [ -f "package.json" ] && grep -q '"build"' package.json; then
    echo "🔨 Building application..."
    npm run build
fi

echo "✅ Backend deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. For Render/Railway: Push to your repository"
echo "2. For AWS: Run 'eb deploy' or push to ECR"
echo "3. For Vercel: Run 'vercel --prod'"
echo ""
echo "Don't forget to:"
echo "- Set environment variables in your deployment platform"
echo "- Configure CORS settings"
echo "- Set up database network access"
echo "- Enable HTTPS"
