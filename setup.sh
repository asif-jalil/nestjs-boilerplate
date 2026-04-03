#!/bin/bash

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🔧 NestJS Boilerplate Setup Started..."

# Step 1: Check Node.js version
echo "📋 Checking Node.js version..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
    
    # Check if Node.js version is >= 18
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        echo "❌ Node.js version 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
else
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Step 2: Check npm version
echo "📋 Checking npm version..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
else
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Step 3: Copy .env file
echo "📋 Setting up environment file..."
if [ -f ".env" ]; then
    echo "✅ .env already exists"
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env created from .env.example"
        echo "⚠️  Please update .env file with your configuration"
    else
        echo "⚠️  .env.example not found. Skipping .env creation."
    fi
fi

# Step 4: Ensure required directories exist
echo "📋 Creating required directories..."
mkdir -p database/seeds
mkdir -p database/migrations
mkdir -p src/templates
echo "✅ Required directories created"

# Step 5: Install dependencies using npm
echo "📦 Installing dependencies with npm..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Step 6: Build the project
echo "🔨 Building the project..."
if npm run build; then
    echo "✅ Project built successfully"
else
    echo "❌ Failed to build project"
    exit 1
fi

echo "🎉 Setup completed successfully!"
echo "📋 Next steps:"
echo "  1. Update your .env file with proper configuration"
echo "  2. Run npm run setup:db to set up the database"
echo "  3. Run npm run start:dev to start the development server"