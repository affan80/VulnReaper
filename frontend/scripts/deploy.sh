#!/bin/bash

# VulnReaper Frontend Deployment Script
# This script helps deploy the frontend to various platforms

set -e

echo "🚀 VulnReaper Frontend Deployment Script"
echo "======================================"

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your environment variables."
    echo "Continuing with default values..."
fi

# Load environment variables if file exists
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🔨 Building application..."
npm run build

# Run tests if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "🧪 Running tests..."
    npm test
fi

echo "✅ Frontend deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. For Vercel: Run 'vercel --prod'"
echo "2. For Netlify: Push to repository (auto-deploys)"
echo "3. For Render: Push to repository"
echo "4. For Railway: Push to repository"
echo ""
echo "Don't forget to:"
echo "- Set NEXT_PUBLIC_API_URL environment variable"
echo "- Configure build settings"
echo "- Set up custom domain (optional)"
