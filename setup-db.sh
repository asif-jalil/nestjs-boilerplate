#!/bin/bash

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🗃️  Database Setup Started..."

# Step 1: Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please run 'npm run setup' first."
    exit 1
fi

# Step 2: Check if project is built
if [ ! -d "dist" ]; then
    echo "🔨 Building project first..."
    if npm run build; then
        echo "✅ Project built successfully"
    else
        echo "❌ Failed to build project"
        exit 1
    fi
fi

# Step 3: Run Migrations
echo "🧱 Running database migrations..."
if npm run migration:run; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    echo "💡 Make sure your database is running and .env is configured correctly"
    exit 1
fi

# Step 4: Run Seeds
echo "🌱 Running database seeders..."
if npm run seed:run; then
    echo "✅ Seeders completed successfully"
else
    echo "❌ Seeding failed"
    echo "💡 Check your database connection and seed data"
    exit 1
fi

echo "🎉 Database setup completed successfully!"
echo "📋 Database is ready for use"