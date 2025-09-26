#!/bin/bash

# Build verification script
echo "Starting TypeScript build..."

# Clean previous build
rm -rf dist

# Run TypeScript build
npx tsc

# Check if build succeeded
if [ -f "dist/index.js" ]; then
    echo "✅ Build successful! dist/index.js created"
    echo "Starting server..."
    node dist/index.js
else
    echo "❌ Build failed! dist/index.js not found"
    echo "Attempting to run TypeScript directly..."
    npx ts-node -r tsconfig-paths/register src/index.ts
fi