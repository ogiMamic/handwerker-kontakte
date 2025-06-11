#!/bin/bash
echo "🚀 Starting deployment process..."

# Clean install
echo "📦 Installing dependencies..."
npm ci

# Build locally to test
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
