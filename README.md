# NestJS Boilerplate

A production-ready NestJS boilerplate with TypeORM, PostgreSQL, Redis, BullMQ, and comprehensive email system.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** running locally
- **Redis** running locally
- **npm** (included with Node.js)

### One-Command Setup

```bash
npm run setup:full
```

This single command will:

- ✅ Check Node.js and npm versions
- ✅ Install all dependencies
- ✅ Create required directories
- ✅ Build the project
- ✅ Set up the database (migrations + seeds)

### Manual Setup (Step by Step)

#### 1. Initial Setup

```bash
npm run setup
```

#### 2. Configure Environment

Update your `.env` file with proper configuration:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

#### 3. Database Setup

```bash
npm run setup:db
```

#### 4. Start Development Server

```bash
npm run start:dev
```

## 📋 Available Scripts

### Development

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run start:dev`   | Start development server with hot reload |
| `npm run start:debug` | Start with debugging enabled             |
| `npm run build`       | Build the project                        |
| `npm run clean`       | Clean build artifacts                    |

### Code Quality

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run lint`         | Lint and auto-fix code          |
| `npm run lint:check`   | Check linting without fixing    |
| `npm run format`       | Format code with Prettier       |
| `npm run format:check` | Check formatting without fixing |
| `npm run precommit`    | Run all checks before commit    |

### Database

| Script                                             | Description            |
| -------------------------------------------------- | ---------------------- |
| `npm run migration:generate --name=migration-name` | Generate new migration |
| `npm run migration:run`                            | Run pending migrations |
| `npm run migration:revert`                         | Revert last migration  |
| `npm run migration:show`                           | Show migration status  |
| `npm run seed:generate --name=seed-name`           | Generate new seed      |
| `npm run seed:run`                                 | Run seed scripts       |

### Testing

| Script               | Description             |
| -------------------- | ----------------------- |
| `npm run test`       | Run unit tests          |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov`   | Run tests with coverage |
| `npm run test:e2e`   | Run end-to-end tests    |

### Setup & Maintenance

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `npm run setup`         | Initial project setup            |
| `npm run setup:db`      | Database setup only              |
| `npm run setup:full`    | Complete setup (setup + db)      |
| `npm run clean:install` | Clean and reinstall dependencies |

## 🏗️ Project Structure

```
src/
├── common/                 # Shared entities and repositories
├── config/                 # Configuration files
├── constants/              # Application constants
├── decorators/             # Custom decorators
├── exceptions/             # Custom exceptions
├── filters/                # Exception filters
├── guards/                 # Route guards
├── interceptors/           # Response interceptors
├── middleware/             # Custom middleware
├── modules/                # Feature modules
│   ├── auth/              # Authentication module
│   ├── profile/           # User profile module
│   ├── queue/             # Queue management
│   └── user/              # User management
├── pipes/                  # Validation pipes
├── redis/                  # Redis configuration
├── routes.ts              # Route definitions
├── shared/                 # Shared services
├── templates/              # Email templates
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🔧 Features

### Core Features

- ✅ **NestJS Framework** - Modern Node.js framework
- ✅ **TypeORM** - Type-safe database ORM
- ✅ **PostgreSQL** - Robust relational database
- ✅ **Redis** - Caching and session storage
- ✅ **BullMQ** - Background job processing
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Email System** - Comprehensive email handling
- ✅ **Validation** - Request validation with class-validator
- ✅ **Swagger** - API documentation
- ✅ **Rate Limiting** - Request throttling
- ✅ **Security** - Helmet, CORS, compression

### Email System

- ✅ **Multiple Templates** - Handlebars-based templates
- ✅ **Queue Processing** - Background email sending
- ✅ **Multiple Recipients** - Send to admin and user simultaneously
- ✅ **Development Mode** - Console output for testing

### Database

- ✅ **Migrations** - Version-controlled schema changes
- ✅ **Seeds** - Sample data population
- ✅ **Repository Pattern** - Clean data access layer
- ✅ **Entity Relationships** - Proper database relationships

## 🌐 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token

### Profile

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Queue/Email

- Email jobs are processed automatically via BullMQ
- Templates: `get-in-touch`, `get-in-touch-confirmation`, `welcome-email`

## 🔐 Default Credentials

```
Email: admin@mail.com
Password: defaultPass123!
```

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Application
NODE_ENV=development
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestjs_boilerplate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM_NAME=Your App Name
MAIL_FROM_EMAIL=noreply@yourapp.com
MAIL_TO_NAME=Admin
MAIL_TO_EMAIL=admin@yourapp.com
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker (Optional)

```bash
# Build image
docker build -t nestjs-boilerplate .

# Run container
docker run -p 4000:4000 nestjs-boilerplate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Redis Connection Failed**
   - Ensure Redis is running
   - Check Redis configuration in `.env`

3. **Build Errors**
   - Run `npm run clean`
   - Check Node.js version (18+)
   - Build again

4. **Migration Errors**
   - Check database connection
   - Verify migration files are valid
   - Run `npm run migration:show` to check status

### Getting Help

- Check the logs for detailed error messages
- Ensure all prerequisites are installed
- Verify environment configuration
- Check database and Redis connections
