#!/bin/bash

# Build script for GitHub deployment
echo "Building application for deployment..."

# Build the client-side application
npm run build

# Create a temporary directory for deployment
mkdir -p deploy

# Copy the client build to the deploy directory
cp -r dist/* deploy/

# Copy necessary server files
cp -r server deploy/
cp -r shared deploy/
cp package.json deploy/
cp vite.config.ts deploy/
cp tsconfig.json deploy/

echo "Deployment package created in 'deploy' directory"
echo "To deploy to GitHub:"
echo "1. Initialize a Git repository in the deploy directory"
echo "2. Add your GitHub repository as remote"
echo "3. Push to GitHub"
echo ""
echo "Example commands:"
echo "  cd deploy"
echo "  git init"
echo "  git add ."
echo "  git commit -m 'Initial deployment'"
echo "  git remote add origin https://github.com/your-username/your-repo.git"
echo "  git push -u origin main"